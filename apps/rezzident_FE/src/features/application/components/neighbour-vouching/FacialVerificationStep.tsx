import React, { useState, useRef, useEffect } from "react";
import { Button } from "#/shared/components/ui/button";
import { ViewfinderFrame } from "./ViewfinderFrame";
import { cn } from "#/shared/utils/cn";

export interface FacialVerificationStepProps {
  currentStep: number;
  totalSteps: number;
  onCaptureComplete: () => void;
  initialError?: boolean;
  serverDowntime?: boolean;
}

export function FacialVerificationStep({
  currentStep,
  totalSteps,
  onCaptureComplete,
  initialError = false,
  serverDowntime = false,
}: FacialVerificationStepProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasError, setHasError] = useState(initialError);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  const stopActiveStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = () => {
    stopActiveStream();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (!isMountedRef.current) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (isMountedRef.current) setCameraReady(true);
            };
          }
          setTimeout(() => {
            if (isMountedRef.current) setCameraReady(true);
          }, 500);
        })
        .catch(() => {
          // Camera access denied/unavailable in environment - graceful fallback
          setTimeout(() => {
            if (isMountedRef.current) setCameraReady(true);
          }, 600);
        });
    } else {
      setTimeout(() => {
        if (isMountedRef.current) setCameraReady(true);
      }, 600);
    }
  };

  // Attempt to open front camera if available, fallback gracefully if not
  useEffect(() => {
    isMountedRef.current = true;
    startCamera();

    return () => {
      isMountedRef.current = false;
      stopActiveStream();
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
      if (!isMountedRef.current) return;
      setCaptured(true);
      setIsCapturing(false);
      
      // If server downtime is active, fail with error
      if (serverDowntime) {
        setHasError(true);
        return;
      }

      // Normal flow advances
      stopActiveStream();
      setTimeout(() => {
        if (isMountedRef.current) {
          onCaptureComplete();
        }
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
        <span className="block font-dmsans text-[14px] font-semibold uppercase tracking-wider text-warmGray">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="mt-1 font-dmsans text-[32px] font-bold leading-tight text-actionDark sm:text-[32px]">
          Let's verify your identity
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-warmGray">
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
            "h-[56px] w-full rounded-[12px] text-[16px] font-medium text-white transition-colors duration-200",
            hasError || isButtonActive
              ? "bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed cursor-pointer"
              : "bg-stoneEdge hover:bg-stoneEdge active:bg-stoneEdge text-warmGray cursor-not-allowed"
          )}
        >
          {hasError ? "Retake Photo" : isCapturing ? "Processing..." : "Take Photo"}
        </Button>
      </div>
    </div>
  );
}
