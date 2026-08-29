import React, { useState } from "react";
import { Button } from "#/shared/components/ui/button";
import { Input } from "#/shared/components/ui/input";
import { cn } from "#/shared/utils/cn";

export interface PersonalDetailsStepProps {
  currentStep: number;
  totalSteps: number;
  fullName: string;
  phoneNumber: string;
  onFullNameChange: (val: string) => void;
  onPhoneNumberChange: (val: string) => void;
  onNext: () => void;
}

export function PersonalDetailsStep({
  currentStep,
  totalSteps,
  fullName,
  phoneNumber,
  onFullNameChange,
  onPhoneNumberChange,
  onNext,
}: PersonalDetailsStepProps) {
  const [submitted, setSubmitted] = useState(false);

  // Validate inputs
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const isNameValid = fullName.trim().length >= 2;
  const isPhoneValid = cleanPhone.length >= 10;

  const nameError = submitted && !isNameValid ? "Please enter your full name." : null;
  const phoneError = submitted && !isPhoneValid ? "Please enter a valid phone number." : null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitted(true);
    if (isNameValid && isPhoneValid) {
      onNext();
    }
  };

  const handleNameChange = (val: string) => {
    onFullNameChange(val);
  };

  const handlePhoneChange = (val: string) => {
    onPhoneNumberChange(val);
  };

  const isFormComplete = isNameValid && isPhoneValid;

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Your details
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          We need this to verify your identity
        </p>

        {/* ── Form Inputs ── */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block font-dmsans text-[13px] font-medium text-gray-500 mb-1"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => handleNameChange(e.target.value)}
              className={cn(
                "h-[44px] text-[15px] border-b placeholder:text-gray-400",
                nameError
                  ? "border-b-errorRed text-actionDark focus-visible:border-b-errorRed"
                  : "border-b-gray-200 focus-visible:border-b-actionYellow"
              )}
              autoFocus
            />
            {nameError && (
              <p className="mt-1.5 font-dmsans text-[12px] font-normal text-errorRed animate-in fade-in">
                {nameError}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block font-dmsans text-[13px] font-medium text-gray-500 mb-1"
            >
              Phone Number
            </label>
            <div
              className={cn(
                "flex items-center border-b transition-colors",
                phoneError
                  ? "border-b-errorRed focus-within:border-b-errorRed"
                  : "border-b-gray-200 focus-within:border-b-actionYellow"
              )}
            >
              <span className="font-dmsans text-[15px] font-bold text-actionDark pr-2.5">
                +234
              </span>
              <div className="h-[18px] w-[1px] bg-gray-300 mr-2.5" />
              <Input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="h-[44px] flex-1 border-none bg-transparent px-0 font-dmsans text-[15px] text-actionDark outline-none placeholder:text-gray-400 focus-visible:border-none focus-visible:ring-0"
              />
            </div>
            {phoneError ? (
              <p className="mt-1.5 font-dmsans text-[12px] font-normal text-errorRed animate-in fade-in">
                {phoneError}
              </p>
            ) : (
              <p className="mt-1.5 font-dmsans text-[11px] text-gray-400">
                We'll send a verification code to this number
              </p>
            )}
          </div>
        </form>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={() => handleSubmit()}
          className={cn(
            "h-[54px] w-full rounded-xl text-[16px] font-medium text-white transition-colors duration-200",
            isFormComplete
              ? "bg-actionDark hover:bg-actionDark/90 cursor-pointer"
              : "bg-stoneEdge hover:bg-stoneEdge active:bg-stoneEdge"
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
