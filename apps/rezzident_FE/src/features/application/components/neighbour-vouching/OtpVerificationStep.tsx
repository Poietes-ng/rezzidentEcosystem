import React, { useState, useEffect, useRef } from "react";
import { Button } from "#/shared/components/ui/button";
import { PinInput } from "#/shared/components/ui/pin-input";
import { cn } from "#/shared/utils/cn";

export const MOCK_VALID_OTP = "1234";
export const MOCK_EXPIRED_OTP_CODES = ["0000", "9999", "8888"] as const;

export interface OtpVerificationStepProps {
  currentStep: number;
  totalSteps: number;
  phoneNumber: string;
  otp: string;
  onOtpChange: (val: string) => void;
  onVerify: () => void;
  onResend?: () => void;
}

export function OtpVerificationStep({
  currentStep,
  totalSteps,
  phoneNumber,
  otp,
  onOtpChange,
  onVerify,
  onResend,
}: OtpVerificationStepProps) {
  const [otpStatus, setOtpStatus] = useState<"idle" | "invalid" | "expired">("idle");
  const [countdown, setCountdown] = useState(0);

  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check expired OTP code
  const isExpiredCode = (MOCK_EXPIRED_OTP_CODES as readonly string[]).includes(otp);

  // Format phone number e.g. +234 801 234 XXXX
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const formattedPhone = cleanPhone
    ? `+234 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6) || "XXXX"}`
    : "+234 801 234 XXXX";

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [countdown]);

  const handleOtpChange = (val: string) => {
    if (otpStatus !== "idle") {
      setOtpStatus("idle");
    }
    onOtpChange(val);
  };

  const handleResend = () => {
    onOtpChange("");
    setOtpStatus("idle");
    setCountdown(30);
    onResend?.();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (otp.length < 4) {
      setOtpStatus("invalid");
      return;
    }

    if (isExpiredCode) {
      setOtpStatus("expired");
      return;
    }

    if (otp === MOCK_VALID_OTP) {
      setOtpStatus("idle");
      onVerify();
    } else {
      setOtpStatus("invalid");
    }
  };

  const isError = otpStatus === "invalid" || otpStatus === "expired";
  const isOtpComplete = otp.length === 4;

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Verify your number
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          We sent a 4-digit code to {formattedPhone}
        </p>

        {/* ── 4-Digit OTP Input ── */}
        <div className="mt-12 flex flex-col items-center">
          <PinInput
            length={4}
            value={otp}
            onChange={handleOtpChange}
            variant="number"
            error={isError}
            autoFocus
            className="gap-8"
          />

          {/* Resend / Countdown Link */}
          <div className="mt-10 text-center">
            {countdown > 0 ? (
              <p className="font-dmsans text-[14px] text-gray-500">
                Resend code in <span className="font-bold text-actionDark">{formatCountdown(countdown)}</span>
              </p>
            ) : (
              <p className="font-dmsans text-[14px] text-gray-500">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-actionDark underline decoration-gray-400 underline-offset-4 hover:decoration-actionDark"
                >
                  Resend
                </button>
              </p>
            )}

            {/* Error / Expired Messages */}
            {otpStatus === "invalid" && (
              <p className="mt-6 font-dmsans text-[13px] font-normal text-errorRed animate-in fade-in">
                Incorrect code. Please try again.
              </p>
            )}

            {otpStatus === "expired" && (
              <p className="mt-6 font-dmsans text-[13px] font-normal text-errorRed animate-in fade-in">
                OTP expired. Resend OTP.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={() => handleVerify()}
          className={cn(
            "h-[54px] w-full rounded-xl text-[16px] font-medium text-white transition-colors duration-200",
            isOtpComplete
              ? "bg-actionDark hover:bg-actionDark/90 cursor-pointer"
              : "bg-stoneEdge hover:bg-stoneEdge active:bg-stoneEdge"
          )}
        >
          Verify
        </Button>
      </div>
    </div>
  );
}
