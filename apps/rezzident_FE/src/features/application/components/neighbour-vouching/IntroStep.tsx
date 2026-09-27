import React from 'react'
import { Button } from '#/shared/components/ui'

export interface IntroStepProps {
  onStart: () => void
  onBack: () => void
}

export function IntroStep({ onStart, onBack }: IntroStepProps): React.JSX.Element {
  const steps = [
    {
      number: '1',
      title: 'Fill in your details',
      description: 'Enter your name, phone number, and capture a selfie for verification.',
    },
    {
      number: '2',
      title: 'Share your vouch code',
      description: 'Send your unique code or link to at least 2 neighbours in your estate.',
    },
    {
      number: '3',
      title: 'Get vouched',
      description: "Once 2 neighbours confirm, you'll get access to set up your PIN.",
    },
  ]

  return (
    <div className="font-dmsans flex w-full flex-col px-6 pt-4 pb-8">
      {/* ── Top Header with Back Arrow ── */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-actionDark mb-4 flex h-10 w-10 items-center justify-start transition-opacity hover:opacity-75 focus-visible:outline-none"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[18px]!">arrow_back_ios_new</span>
        </button>

        {/* ── Centered Badge Graphic ── */}
        <div className="flex justify-center py-2">
          <img
            src="/assets/vouch.svg"
            alt="Neighbour Vouching Badge"
            className="h-[140px] w-[140px] object-contain"
          />
        </div>

        {/* ── Titles & Description ── */}
        <div className="mt-4">
          <span className="font-dmsans text-warmGray block text-[14px] font-semibold tracking-wider uppercase">
            Neighbour Vouching
          </span>
          <h1 className="font-dmsans text-actionDark mt-1 text-[28px] leading-tight font-bold sm:text-[32px]">
            Get verified by your neighbours
          </h1>
          <p className="text-warmGray mt-2 text-[14px] leading-relaxed">
            Don't have your estate code? No worries. At least 2 neighbours need to vouch for you to
            gain access.
          </p>
        </div>

        {/* ── 3-Step Timeline ── */}
        <div className="mt-6 space-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex items-start gap-4">
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="bg-stoneEdge/50 absolute top-[28px] left-[13px] h-[calc(100%-8px)] w-[1.5px]"
                  aria-hidden="true"
                />
              )}

              {/* Number Circle */}
              <div className="bg-actionDark relative z-10 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-xs">
                {step.number}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-5">
                <h3 className="font-dmsans text-actionDark text-[16px] leading-snug font-bold">
                  {step.title}
                </h3>
                <p className="font-dmsans text-warmGray mt-0.5 text-[13px] leading-normal">
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
          className="bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed h-[56px] w-full rounded-[12px] text-[16px] font-medium text-white transition-colors"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
