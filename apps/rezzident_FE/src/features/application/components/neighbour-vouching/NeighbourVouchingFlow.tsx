import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepProgress } from "#/shared/components/ui/step-progress";
import { IntroStep } from "./IntroStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { OtpVerificationStep } from "./OtpVerificationStep";
import { FacialVerificationStep } from "./FacialVerificationStep";
import { VouchCodeStep } from "./VouchCodeStep";
import { VouchingStatusStep } from "./VouchingStatusStep";
import { SuccessStep } from "./SuccessStep";
import { PinSetupStep } from "./PinSetupStep";
import { CompletedStep } from "./CompletedStep";
import { ServerDowntimeError } from "#/shared/components/ui/server-downtime-error";
import {
  useNeighbourVouchingFlow,
  slideVariants,
  TOTAL_STEPS,
} from "./useNeighbourVouchingFlow";

export function NeighbourVouchingFlow() {
  const {
    state,
    setState,
    direction,
    currentStepNumber,
    currentNeighbours,
    topToast,
    serverDowntime,
    goToStep,
    handleBack,
    handleRefreshStatus,
    handleFinish,
    showToast,
  } = useNeighbourVouchingFlow();

  const isStepWithoutHeader =
    state.currentStep === "INTRO" ||
    state.currentStep === "SUCCESS" ||
    state.currentStep === "COMPLETED";

  return (
    <div className="relative flex h-full w-full flex-col bg-white font-dmsans overflow-hidden">
      {/* ── Top Floating Toast Notification Banner ── */}
      <AnimatePresence>
        {topToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-6 right-6 z-50 rounded-xl bg-actionDark px-4 py-3 text-center text-[13px] font-medium text-white shadow-lg"
          >
            {topToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed Header Area ── */}
      {!isStepWithoutHeader && (
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
                  onClick={handleBack}
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
      )}

      {/* ── Scrollable Body Step Container ── */}
      <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex min-h-full flex-1 flex-col"
          >
            {/* 1. INTRO STEP */}
            {state.currentStep === "INTRO" && (
              <IntroStep
                onStart={() => goToStep("DETAILS", 1)}
                onBack={handleBack}
              />
            )}

            {/* 2. STEP 1 OF 5 — PERSONAL DETAILS */}
            {state.currentStep === "DETAILS" && (
              <PersonalDetailsStep
                currentStep={1}
                totalSteps={TOTAL_STEPS}
                fullName={state.fullName}
                phoneNumber={state.phoneNumber}
                onFullNameChange={(val) => setState((prev) => ({ ...prev, fullName: val }))}
                onPhoneNumberChange={(val) => setState((prev) => ({ ...prev, phoneNumber: val }))}
                onNext={() => goToStep("OTP", 1)}
              />
            )}

            {/* 3. STEP 2 OF 5 — OTP VERIFICATION */}
            {state.currentStep === "OTP" && (
              <OtpVerificationStep
                currentStep={2}
                totalSteps={TOTAL_STEPS}
                phoneNumber={state.phoneNumber}
                otp={state.otp}
                onOtpChange={(val) => setState((prev) => ({ ...prev, otp: val }))}
                onVerify={() => {
                  setState((prev) => ({ ...prev, otpVerified: true }));
                  goToStep("FACIAL", 1);
                }}
                onResend={() => showToast("Code resent successfully")}
              />
            )}

            {/* 4. STEP 3 OF 5 — FACIAL VERIFICATION */}
            {state.currentStep === "FACIAL" && (
              <FacialVerificationStep
                currentStep={3}
                totalSteps={TOTAL_STEPS}
                serverDowntime={serverDowntime}
                onCaptureComplete={() => {
                  setState((prev) => ({ ...prev, facialVerificationCompleted: true }));
                  goToStep("VOUCH_CODE", 1);
                }}
              />
            )}

            {/* 5. STEP 4 OF 5 — SHARE VOUCH CODE / LINK */}
            {state.currentStep === "VOUCH_CODE" && (
              <VouchCodeStep
                currentStep={4}
                totalSteps={TOTAL_STEPS}
                vouchCode={state.vouchCode}
                vouchLink={state.vouchLink}
                onViewStatus={() => goToStep("STATUS", 1)}
              />
            )}

            {/* 6. STEP 4 OF 5 — STATUS TRACKING */}
            {state.currentStep === "STATUS" && (
              <VouchingStatusStep
                currentStep={4}
                totalSteps={TOTAL_STEPS}
                vouchCount={state.vouchCount}
                neighbours={currentNeighbours}
                onRefresh={handleRefreshStatus}
                onContinue={() => goToStep("SUCCESS", 1)}
              />
            )}

            {/* 7. CELEBRATION — HURRAY YOU'RE VERIFIED */}
            {state.currentStep === "SUCCESS" && (
              <SuccessStep onSetupPin={() => goToStep("PIN_SETUP", 1)} />
            )}

            {/* 8. STEP 5 OF 5 — PIN SETUP */}
            {state.currentStep === "PIN_SETUP" && (
              <PinSetupStep
                currentStep={5}
                totalSteps={TOTAL_STEPS}
                pin={state.pin}
                confirmPin={state.confirmPin}
                faceIdEnabled={state.faceIdEnabled}
                onPinChange={(val) => setState((prev) => ({ ...prev, pin: val }))}
                onConfirmPinChange={(val) =>
                  setState((prev) => ({ ...prev, confirmPin: val }))
                }
                onFaceIdToggle={(enabled) =>
                  setState((prev) => ({ ...prev, faceIdEnabled: enabled }))
                }
                onComplete={() => {
                  setState((prev) => ({
                    ...prev,
                    isCompleted: true,
                    currentStep: "COMPLETED",
                  }));
                  goToStep("COMPLETED", 1);
                }}
              />
            )}

            {/* 9. FINAL SUMMARY & COMPLETE */}
            {state.currentStep === "COMPLETED" && (
              <CompletedStep
                fullName={state.fullName}
                faceIdEnabled={state.faceIdEnabled}
                onFinish={handleFinish}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
