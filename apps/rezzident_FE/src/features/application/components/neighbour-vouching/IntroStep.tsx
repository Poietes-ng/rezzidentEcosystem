import React from "react";
import { Button } from "#/shared/components/ui/button";

export interface IntroStepProps {
  onStart: () => void;
  onBack: () => void;
}

export function IntroStep({ onStart, onBack }: IntroStepProps) {
  const steps = [
    {
      number: "1",
      title: "Fill in your details",
      description: "Enter your name, phone number, and capture a selfie for verification.",
    },
    {
      number: "2",
      title: "Share your vouch code",
      description: "Send your unique code or link to at least 2 neighbours in your estate.",
    },
    {
      number: "3",
      title: "Get vouched",
      description: "Once 2 neighbours confirm, you'll get access to set up your PIN.",
    },
  ];

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-4 font-dmsans">
      {/* ── Top Header with Back Arrow ── */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex h-10 w-10 items-center justify-start text-actionDark transition-opacity hover:opacity-75 focus-visible:outline-none"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[26px]">chevron_left</span>
        </button>

        {/* ── Centered Badge Graphic ── */}
        <div className="flex justify-center py-2">
          <img
            src="/assets/Vouch.svg"
            alt="Neighbour Vouching Badge"
            className="h-[140px] w-[140px] object-contain"
          />
        </div>

        {/* ── Titles & Description ── */}
        <div className="mt-4">
          <span className="block font-dmsans text-[14px] font-semibold uppercase tracking-wider text-warmGray">
            Neighbour Vouching
          </span>
          <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
            Get verified by your neighbours
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-warmGray">
            Don't have your estate code? No worries. At least 2 neighbours need to vouch for you to gain access.
          </p>
        </div>

        {/* ── 3-Step Timeline ── */}
        <div className="mt-6 space-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex items-start gap-4">
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute left-[13px] top-[28px] h-[calc(100%-8px)] w-[1.5px] bg-stoneEdge/50"
                  aria-hidden="true"
                />
              )}

              {/* Number Circle */}
              <div className="relative z-10 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-actionDark text-[13px] font-bold text-white shadow-xs">
                {step.number}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-5">
                <h3 className="font-dmsans text-[16px] font-bold text-actionDark leading-snug">
                  {step.title}
                </h3>
                <p className="mt-0.5 font-dmsans text-[13px] text-warmGray leading-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={onStart}
          className="h-[56px] w-full rounded-[12px] bg-actionDark text-[16px] font-medium text-white transition-colors hover:bg-actionDarkHover active:bg-actionDarkPressed"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
