"use client";

import { createGalleryEntry } from "@/app/actions/gallery";
import { Button } from "@/components/ui/button";
import { ActionResult, GalleryArt } from "@/lib/types";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const initialState: ActionResult<GalleryArt> = {
  success: false,
  error: "",
};

export default function GalleryUploadForm() {
  const [state, formAction, pending] = useActionState(
    createGalleryEntry,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const prevState = useRef<ActionResult<GalleryArt> | null>(null);

  useEffect(() => {
    if (prevState.current !== state) {
      if (state.success) {
        toast.success("Images uploaded successfully!");
        formRef.current?.reset();
      } else if (state.success === false && state.error) {
        toast.error(state.error);
      }
      prevState.current = state;
    }
  }, [state]);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upload New Artwork
      </h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white "
            disabled={pending}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-black text-white"
          aria-disabled={pending}
        >
          {pending ? "Uploading..." : "Upload Images"}
        </Button>
      </form>
    </div>
  );
}
