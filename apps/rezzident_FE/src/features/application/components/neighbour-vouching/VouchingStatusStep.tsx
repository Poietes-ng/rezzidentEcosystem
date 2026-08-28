import React, { useState } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { NeighbourCard } from "./NeighbourCard";
import type { NeighbourVouch } from "./types";

export interface VouchingStatusStepProps {
  currentStep: number;
  totalSteps: number;
  vouchCount: 0 | 1 | 2;
  neighbours: NeighbourVouch[];
  onRefresh: () => void;
  onContinue: () => void;
}

export function VouchingStatusStep({
  currentStep,
  totalSteps,
  vouchCount,
  neighbours,
  onRefresh,
  onContinue,
}: VouchingStatusStepProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isComplete = vouchCount === 2;

  // Title and subtitle dynamic based on vouch count
  const getHeaderInfo = () => {
    switch (vouchCount) {
      case 0:
        return {
          title: "Vouching status",
          subtitle: "You need at least 2 neighbours to vouch for you before you can access the app.",
        };
      case 1:
        return {
          title: "Vouching status",
          subtitle: "Almost there! 1 more neighbour needs to vouch for you.",
        };
      case 2:
      default:
        return {
          title: "Vouching complete",
          subtitle: "Both neighbours have vouched for you. You're all set to continue!",
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          {subtitle}
        </p>

        {/* ── Vouching Progress Section ── */}
        <div className="mt-8">
          <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Vouching Progress
          </span>
          <h2 className="mt-1 font-dmsans text-[16px] font-bold text-actionDark">
            {vouchCount} of 2 neighbours vouched
          </h2>

          {/* ── Neighbour Cards List ── */}
          <div className="mt-4 divide-y divide-[#F0EFEB]">
            {neighbours.map((neighbour, index) => (
              <NeighbourCard
                key={neighbour.id}
                neighbour={neighbour}
                index={index}
                showDivider={index < neighbours.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        {isComplete ? (
          <Button
            type="button"
            onClick={onContinue}
            className="h-[54px] w-full rounded-[14px] bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="h-[54px] w-full rounded-[14px] bg-actionDark text-[16px] font-medium text-white hover:bg-actionDark/90 flex items-center justify-center gap-2"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            >
              refresh
            </span>
            <span>{isRefreshing ? "Checking..." : "Refresh Status"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
