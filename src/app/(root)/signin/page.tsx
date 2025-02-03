"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/context/userContext";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignInPage() {
  const { refetchUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = Cookie.get("rememberEmail");
    const savedPassword = Cookie.get("rememberPassword");
    if (savedEmail && savedPassword) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully!");
        Cookie.set("token", result.token, { expires: 1 });
        refetchUser();

        if (rememberMe) {
          Cookie.set("rememberEmail", data.email, { expires: 7 });
          Cookie.set("rememberPassword", data.password, { expires: 7 });
        } else {
          Cookie.remove("rememberEmail");
          Cookie.remove("rememberPassword");
        }

        router.push("/");
      } else {
        setError(result.error);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Email"
                {...register("email")}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="text-sm">
                Remember Me
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
            <div className="flex justify-center">
              <label className="text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-blue-600">
                  Sign Up
                </a>
              </label>
            </div>
          </form>
          <div className="flex flex-row items-center mt-4">
            <div className="w-full h-[1px] bg-gray-400" />
            <label className="pl-2 pr-2 text-gray-400">or</label>
            <div className="w-full h-[1px] bg-gray-400" />
          </div>
          <Button variant={"secondary"} className="w-full mt-4">
            <Image
              src="/utils/google.png"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>

          {/* <div className="text-left">
            <button
              onClick={() => router.push("/forgot-password")}
              className="text-blue-600 text-sm"
            >
              Forgot Password?
            </button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
