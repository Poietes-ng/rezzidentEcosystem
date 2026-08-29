import { useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Variants } from "framer-motion";
import type { NeighbourVouch, VouchingFlowStep, VouchingState } from "./types";

// High quality, reliable avatars matching the screenshots
const AMARA_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
const CHIDI_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";

export const INITIAL_NEIGHBOURS: NeighbourVouch[] = [
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
 */
export const VOUCHING_STEP_MAP: Record<VouchingFlowStep, number | null> = {
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

export const TOTAL_STEPS = 5;

export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

export function useNeighbourVouchingFlow() {
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

  return {
    state,
    setState,
    direction,
    currentStepNumber,
    currentNeighbours,
    topToast,
    serverDowntime,
    setServerDowntime,
    goToStep,
    handleBack,
    handleRefreshStatus,
    handleFinish,
    showToast,
  };
}
