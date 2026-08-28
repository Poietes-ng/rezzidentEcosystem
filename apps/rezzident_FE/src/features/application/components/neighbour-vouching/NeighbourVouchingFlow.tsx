import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { StepProgress } from "../../../../shared/components/ui/step-progress";
import { IntroStep } from "./IntroStep";
import { PersonalDetailsStep } from "./PersonalDetailsStep";
import { OtpVerificationStep } from "./OtpVerificationStep";
import { FacialVerificationStep } from "./FacialVerificationStep";
import { VouchCodeStep } from "./VouchCodeStep";
import { VouchingStatusStep } from "./VouchingStatusStep";
import { SuccessStep } from "./SuccessStep";
import { PinSetupStep } from "./PinSetupStep";
import { CompletedStep } from "./CompletedStep";
import { ServerDowntimeError } from "../../../../shared/components/ui/server-downtime-error";
import type { NeighbourVouch, VouchingFlowStep, VouchingState } from "./types";

// High quality, reliable avatars matching the screenshots
const AMARA_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
const CHIDI_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";

const INITIAL_NEIGHBOURS: NeighbourVouch[] = [
  {
    id: "1",
    name: "Amara Obi",
    unit: "Block C, Unit 3",
    avatarUrl: AMARA_AVATAR,
    status: "pending",
  },
  {
    id: "2",
    name: "Chidi Eze",
    unit: "Block C, Unit 12",
    avatarUrl: CHIDI_AVATAR,
    status: "pending",
  },
];

/**
 * Maps each VouchingFlowStep to a 1-indexed progress step number.
 * Steps without a number (INTRO, SUCCESS, COMPLETED) map to null —
 * the persistent progress header is hidden for those screens.
 *
 * Both VOUCH_CODE and STATUS are Step 4 of 5 (same logical step).
 */
const VOUCHING_STEP_MAP: Record<VouchingFlowStep, number | null> = {
  INTRO: null,
  DETAILS: 1,
  OTP: 2,
  FACIAL: 3,
  VOUCH_CODE: 4,
  STATUS: 4,
  SUCCESS: null,
  PIN_SETUP: 5,
  COMPLETED: null,
};

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

export function NeighbourVouchingFlow() {
  const navigate = useNavigate();

  // Direction tracker for transitions: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  // Complete persistent client-side state
  const [state, setState] = useState<VouchingState>({
    currentStep: "INTRO",
    fullName: "",
    phoneNumber: "",
    otp: "",
    otpVerified: false,
    facialVerificationCompleted: false,
    vouchCode: "VCH-7829",
    vouchLink: "rezzident.app/vouch/vch7829",
    vouchCount: 0,
    neighbours: INITIAL_NEIGHBOURS,
    pin: "",
    confirmPin: "",
    faceIdEnabled: false,
    isCompleted: false,
  });

  // Derive the current numbered step (null for non-numbered screens)
  const currentStepNumber = VOUCHING_STEP_MAP[state.currentStep];

  // Calculate neighbour list based on vouch count (0/2, 1/2, 2/2)
  const currentNeighbours = useMemo<NeighbourVouch[]>(() => {
    return [
      {
        ...INITIAL_NEIGHBOURS[0],
        status: state.vouchCount >= 1 ? "vouched" : "pending",
      },
      {
        ...INITIAL_NEIGHBOURS[1],
        status: state.vouchCount >= 2 ? "vouched" : "pending",
      },
    ];
  }, [state.vouchCount]);

  // Navigation helpers
  const goToStep = (nextStep: VouchingFlowStep, dir = 1) => {
    setDirection(dir);
    setState((prev) => ({ ...prev, currentStep: nextStep }));
  };

  // Central back handler — maps each step to where "back" should go
  const handleBack = () => {
    switch (state.currentStep) {
      case "INTRO":
        navigate({ to: "/app/join" });
        break;
      case "DETAILS":
        goToStep("INTRO", -1);
        break;
      case "OTP":
        goToStep("DETAILS", -1);
        break;
      case "FACIAL":
        goToStep("OTP", -1);
        break;
      case "VOUCH_CODE":
        goToStep("FACIAL", -1);
        break;
      case "STATUS":
        goToStep("VOUCH_CODE", -1);
        break;
      case "PIN_SETUP":
        goToStep("STATUS", -1);
        break;
      default:
        break;
    }
  };

  const handleRefreshStatus = () => {
    setState((prev) => {
      const nextCount: 0 | 1 | 2 = prev.vouchCount === 0 ? 1 : 2;
      return {
        ...prev,
        vouchCount: nextCount,
      };
    });
  };

  const handleFinish = () => {
    navigate({ to: "/app/welcome" });
  };

  // Top Toast Banner state
  const [topToast, setTopToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [serverDowntime, setServerDowntime] = useState(false);

  const showToast = (message: string) => {
    setTopToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setTopToast(null);
    }, 4000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white font-dmsans overflow-hidden">
      {/* ── Top Header (Server Downtime popup at the very top OR back arrow + progress bar) ── */}
      {currentStepNumber !== null && (
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
                {/* Top Row: Back button or Toast popup */}
                <div className="relative mb-4 min-h-[40px] flex items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-start text-actionDark transition-opacity hover:opacity-75 focus-visible:outline-none w-fit"
                    aria-label="Go back"
                  >
                    <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                  </button>

                  {/* Top Toast Banner (renders on top of header, above the progress bar) */}
                  <AnimatePresence>
                    {topToast && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center gap-2 rounded-[14px] bg-[#2D8A4E] py-2.5 px-4 shadow-md text-white z-20"
                      >
                        <span className="material-symbols-outlined text-[20px] text-white shrink-0">
                          check_circle
                        </span>
                        <span className="text-[14px] font-medium text-white">
                          {topToast}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Shared progress bar — single source of truth */}
                <StepProgress
                  currentStep={currentStepNumber}
                  totalSteps={TOTAL_STEPS}
                  showLabel={false}
                  className="mb-0"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Scrollable Step Content Container ── */}
      <div className="flex flex-1 flex-col min-h-0 overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={state.currentStep}
            custom={direction}
            variants={slideVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex min-h-full w-full flex-col"
          >
            {/* 1. INTRO SCREEN */}
            {state.currentStep === "INTRO" && (
              <IntroStep
                onStart={() => goToStep("DETAILS", 1)}
                onBack={() => navigate({ to: "/app/join" })}
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
                onToggleServerDowntime={() => setServerDowntime((prev) => !prev)}
                onCaptureComplete={() => {
                  setState((prev) => ({ ...prev, facialVerificationCompleted: true }));
                  goToStep("VOUCH_CODE", 1);
                }}
              />
            )}

            {/* 5. STEP 4 OF 5 — VOUCH CODE & SHARE */}
            {state.currentStep === "VOUCH_CODE" && (
              <VouchCodeStep
                currentStep={4}
                totalSteps={TOTAL_STEPS}
                vouchCode={state.vouchCode}
                vouchLink={state.vouchLink}
                onViewStatus={() => goToStep("STATUS", 1)}
              />
            )}

            {/* 6. STEP 4 OF 5 — VOUCHING STATUS (0/2, 1/2, 2/2) */}
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

            {/* 7. SUCCESS SCREEN (HURRAY YOU'RE VERIFIED!) */}
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
                onConfirmPinChange={(val) => setState((prev) => ({ ...prev, confirmPin: val }))}
                onFaceIdToggle={(val) => setState((prev) => ({ ...prev, faceIdEnabled: val }))}
                onComplete={() => {
                  setState((prev) => ({ ...prev, isCompleted: true }));
                  goToStep("COMPLETED", 1);
                }}
              />
            )}

            {/* 9. COMPLETED SUMMARY */}
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
