"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import BackgroundWrapper from "@/components/background-wrapper";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      router.push("/signin");
    } else {
      setError(data.message);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      toast.error("Unable to Login with Google!");
    }, 2000);
  };

  return (
    <BackgroundWrapper>
      <div className="flex items-center justify-center min-h-screen ">
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
                className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Sign Up
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
            <div className="flex felx-row items-center mt-4">
              <div className="w-full h-[1px] bg-gray-400" />
              <label className="pl-2 pr-2 text-gray-400">or</label>
              <div className="w-full h-[1px] bg-gray-400" />
            </div>

            <Button
              variant={"secondary"}
              className="w-full mt-4 flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <FcGoogle className=" scale-110 mr-1" />
                  Continue with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </BackgroundWrapper>
  );
};

export default SignUpPage;
