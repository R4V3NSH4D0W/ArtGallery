import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import MotionDiv from "@/components/motiondiv";
import { getRemainingTime } from "@/lib/utils";

type OtpVerificationProps = {
  email: string;
  onVerify: (otp: string) => void;
  onResend: (email: string) => void;
  expiresAt: Date | null;
  loading: boolean;
};

const OtpVerification = ({
  email,
  onVerify,
  onResend,
  expiresAt,
  loading,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (expiresAt) {
      const interval = setInterval(() => {
        setRemainingTime(getRemainingTime(expiresAt.toISOString()));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const handleOtpSubmit = () => {
    console.log(otp);
    onVerify(otp);
  };

  const handleResendOtp = () => {
    onResend(email);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full"
      >
        <h3 className="text-3xl font-bold text-gray-800 text-center">
          Verify OTP
        </h3>
        <p className="text-sm text-gray-500 text-center my-4">
          Enter the OTP sent to your email
        </p>
        <div className="flex justify-center mb-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(otpValue) => setOtp(otpValue)}
          >
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
          className="w-full py-3 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Verify OTP"
          )}
        </Button>
        <p className="text-center text-sm mt-4 text-gray-500">
          Didn’t receive the code?{" "}
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
      </MotionDiv>
    </div>
  );
};

export default OtpVerification;
