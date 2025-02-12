"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BackgroundWrapper from "@/components/background-wrapper";
import { IoMdArrowBack } from "react-icons/io";
import { forgotPassword, verifyOtp } from "@/app/actions/auth";
import OtpVerification from "@/components/otp-verifitcation-model";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpExpires, setOtpExpires] = useState<Date | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result?.error) throw new Error(result.error);

      toast.success(result.success);
      setOtpExpires(result.expiresAt ? new Date(result.expiresAt) : null);
      setOtpModalOpen(true);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);

    try {
      const result = await verifyOtp(email, otp);

      if (result?.error) throw new Error(result.error);

      toast.success(result.success);
      router.push(`/signin/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (email: string) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error resending OTP");

      toast.success(data.message);
      setOtpExpires(new Date(data.expiresAt));
    } finally {
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex items-center justify-center min-h-screen px-2 lg:px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
          <p className="text-gray-600 mb-6">
            No worries. We&apos;ll send you reset instructions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 text-md text-gray-800">Email</label>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
            </Button>
          </form>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.push("/signin")}
              className="flex flex-row items-center gap-2 hover:underline hover:text-blue-700"
            >
              <IoMdArrowBack />
              Back to login
            </button>
          </div>
        </div>
      </div>
      {otpModalOpen && (
        <OtpVerification
          email={email}
          onVerify={handleOtpSubmit}
          onResend={handleResendOtp}
          expiresAt={otpExpires}
          loading={loading}
        />
      )}
    </BackgroundWrapper>
  );
};

export default ForgotPassword;
