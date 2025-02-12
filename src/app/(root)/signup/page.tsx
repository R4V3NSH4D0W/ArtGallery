"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackgroundWrapper from "@/components/background-wrapper";

import OtpVerification from "@/components/otp-verifitcation-model";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpExpires, setOtpExpires] = useState<Date | null>(null);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setOtpExpires(new Date(data.expiresAt));
      if (!response.ok) throw new Error(data.message || "Error sending OTP");

      toast.success(data.message);
      setOtpModalOpen(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      toast.error("Unable to Login with Google!");
    }, 2000);
  };

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ ...formData, otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error verifying OTP");

      toast.success(data.message);
      router.push("/signin");
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
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Sign up"
                )}
              </Button>
              <div className="text-center">
                <p className="text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.replace("/signin")}
                    className="text-blue-600"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
            <div className="flex flex-row items-center mt-4">
              <div className="w-full h-[1px] bg-gray-400" />
              <label className="pl-2 pr-2 text-gray-400">or</label>
              <div className="w-full h-[1px] bg-gray-400" />
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4 flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <FcGoogle className="scale-110 mr-1" /> Continue with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      {otpModalOpen && (
        <OtpVerification
          email={formData.email}
          onVerify={handleOtpSubmit}
          onResend={handleResendOtp}
          expiresAt={otpExpires}
          loading={loading}
        />
      )}
    </BackgroundWrapper>
  );
};

export default SignUpPage;
