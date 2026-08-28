import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { ViewfinderFrame } from "./ViewfinderFrame";
import { cn } from "../../../../shared/utils/cn";

export interface FacialVerificationStepProps {
  currentStep: number;
  totalSteps: number;
  onCaptureComplete: () => void;
  initialError?: boolean;
  serverDowntime?: boolean;
  onToggleServerDowntime?: () => void;
}

export function FacialVerificationStep({
  currentStep,
  totalSteps,
  onCaptureComplete,
  initialError = false,
  serverDowntime = false,
  onToggleServerDowntime,
}: FacialVerificationStepProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasError, setHasError] = useState(initialError);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              setCameraReady(true);
            };
          }
          setTimeout(() => setCameraReady(true), 500);
        })
        .catch(() => {
          // Camera access denied/unavailable in environment - graceful fallback
          setTimeout(() => setCameraReady(true), 600);
        });
    } else {
      setTimeout(() => setCameraReady(true), 600);
    }
  };

  // Attempt to open front camera if available, fallback gracefully if not
  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTakePhoto = () => {
    if (!cameraReady || isCapturing) return;

    setIsCapturing(true);
    setHasError(false);

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    }

    // Simulate verification processing then show error or advance
    setTimeout(() => {
      setCaptured(true);
      setIsCapturing(false);
      
      // If server downtime is active, fail with error
      if (serverDowntime) {
        setHasError(true);
        return;
      }

      // Normal flow advances
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setTimeout(() => {
        onCaptureComplete();
      }, 500);
    }, 800);
  };

  const handleRetakePhoto = () => {
    setHasError(false);
    setCaptured(false);
    setIsCapturing(false);
    startCamera();
  };

  const isButtonActive = cameraReady && !isCapturing && !captured;

  return (
    <div className="flex w-full flex-col px-6 pb-8 pt-2 font-dmsans">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="block font-dmsans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[28px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Let's verify your identity
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
          Take a quick selfie for secure access to your estate community
        </p>

        {/* ── Camera Viewfinder Frame ── */}
        <div className="mt-10 flex justify-center">
          <ViewfinderFrame
            isCapturing={isCapturing}
            captured={captured}
            hasError={hasError}
            videoRef={videoRef}
            canvasRef={canvasRef}
          />
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={hasError ? handleRetakePhoto : handleTakePhoto}
          disabled={!hasError && !isButtonActive}
          className={cn(
            "h-[54px] w-full rounded-[14px] text-[16px] font-medium text-white transition-colors duration-200",
            hasError || isButtonActive
              ? "bg-actionDark hover:bg-actionDark/90 cursor-pointer"
              : "bg-[#D4D0C8] hover:bg-[#D4D0C8] active:bg-[#D4D0C8] cursor-not-allowed"
          )}
        >
          {hasError ? "Retake Photo" : isCapturing ? "Processing..." : "Take Photo"}
        </Button>
      </div>

      {/* ── UI Prototype Error State Simulator Controls (for previewing design states) ── */}
      <div className="mt-6 flex items-center justify-center gap-2 pt-2 border-t border-gray-100/60">
        <button
          type="button"
          onClick={() => setHasError((prev) => !prev)}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
            hasError ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {hasError ? "Hide Failed Error" : "Test Failed Error"}
        </button>
        {onToggleServerDowntime && (
          <button
            type="button"
            onClick={onToggleServerDowntime}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              serverDowntime
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {serverDowntime ? "Hide Downtime Banner" : "Test Server Downtime"}
          </button>
        )}
      </div>
    </div>
  );
}
