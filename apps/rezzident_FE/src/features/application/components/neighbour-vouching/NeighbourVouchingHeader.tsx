import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepProgress } from "#/shared/components/ui/step-progress";
import { ServerDowntimeError } from "#/shared/components/ui/server-downtime-error";
import { TOTAL_STEPS } from "./useNeighbourVouchingFlow";

export interface NeighbourVouchingHeaderProps {
  currentStepNumber: number | null;
  serverDowntime: boolean;
  onBack: () => void;
}

export function NeighbourVouchingHeader({
  currentStepNumber,
  serverDowntime,
  onBack,
}: NeighbourVouchingHeaderProps): React.JSX.Element {
  return (
    <div className="relative shrink-0 bg-white z-10">
      <AnimatePresence mode="wait">
        {serverDowntime ? (
          <motion.div
            key="server-downtime"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="px-6 pt-4 pb-2"
          >
            <ServerDowntimeError />
          </motion.div>
        ) : (
          <motion.div
            key="normal-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pt-4 pb-10"
          >
            {/* Back button */}
            <button
              type="button"
              onClick={onBack}
              className="mb-4 flex h-6 w-6 items-center justify-start text-actionDark transition-opacity hover:opacity-75 focus-visible:outline-none"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>

            {/* Progress bar */}
            {currentStepNumber !== null && (
              <StepProgress
                currentStep={currentStepNumber}
                totalSteps={TOTAL_STEPS}
                showLabel={false}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
