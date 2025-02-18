"use client";

import { generateMonthlyStatement } from "@/app/actions/statement";
import { useTransition } from "react";

export function StatementDownload() {
  const [isPending, startTransition] = useTransition();

  const handleDownload = (formData: FormData) => {
    startTransition(async () => {
      try {
        const month = formData.get("month");
        if (!month || typeof month !== "string") {
          throw new Error("Invalid month selection");
        }

        const { data, fileName } = await generateMonthlyStatement(month);

        const binaryString = atob(data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to download statement"
        );
      }
    });
  };

  return (
    <form
      action={handleDownload}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex items-center gap-4">
        <label className="block flex-1">
          <span className="text-sm font-medium text-gray-700">
            Select Month:
          </span>
          <input
            name="month"
            type="month"
            required
            defaultValue={new Date().toISOString().slice(0, 7)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 px-6 py-2 text-sm font-medium text-white bg-black rounded-md hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Generating..." : "Download PDF"}
        </button>
      </div>
    </form>
  );
}
