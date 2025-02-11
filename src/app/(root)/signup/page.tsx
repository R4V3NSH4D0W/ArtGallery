"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackgroundWrapper from "@/components/background-wrapper";
import MotionDiv from "@/components/motiondiv";
import { getRemainingTime } from "@/lib/utils";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpExpires, setOtpExpires] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (otpExpires) {
      const interval = setInterval(() => {
        const timeRemaining = getRemainingTime(otpExpires.toISOString());
        setRemainingTime(timeRemaining);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [otpExpires]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setOtpExpires(new Date(data.expiresAt)); // Save expiration date
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

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp, password, name }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error verifying OTP");

      toast.success(data.message);
      router.push("/signin");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error resending OTP");

      toast.success(data.message);
      setOtpExpires(new Date(data.expiresAt)); // Reset OTP expiration time
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
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Verify OTP
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Enter the OTP sent to your email
              </p>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="flex justify-center mb-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleOtpSubmit}
                className="w-full py-3"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <p className="text-center text-sm mt-4 text-gray-500">
                Didn’t receive the code?
                {remainingTime ? (
                  <span className="ml-1 text-blue-600">{remainingTime}</span>
                ) : (
                  <button
                    className="text-blue-600 font-medium ml-1"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </CardContent>
          </MotionDiv>
        </div>
      )}
    </BackgroundWrapper>
  );
};

export default SignUpPage;
