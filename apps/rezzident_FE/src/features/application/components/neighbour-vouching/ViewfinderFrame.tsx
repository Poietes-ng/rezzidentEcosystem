import React from "react";
import { cn } from "../../../../shared/utils/cn";

export interface ViewfinderFrameProps {
  className?: string;
  isCapturing?: boolean;
  captured?: boolean;
  hasError?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function ViewfinderFrame({
  className,
  isCapturing = false,
  captured = false,
  hasError = false,
  videoRef,
  canvasRef,
}: ViewfinderFrameProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative aspect-square w-[260px] max-w-[80vw] select-none transition-all duration-300">
        {/* Inner Content Area (Camera Stream or Snapshot) */}
        <div className="absolute inset-[3px] overflow-hidden rounded-[34px] bg-[#FAFAF5]">
          {/* Live Camera Stream Video */}
          {videoRef && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                captured ? "hidden" : "block"
              )}
            />
          )}

          {/* Snapshot Canvas */}
          {canvasRef && (
            <canvas
              ref={canvasRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                captured ? "block" : "hidden"
              )}
            />
          )}

          {/* Scanning beam animation when isCapturing */}
          {isCapturing && (
            <div className="absolute inset-x-0 h-1 bg-[#FFE022] shadow-[0_0_12px_#FFE022] animate-pulse transition-all duration-700" />
          )}
        </div>

        {/* ── Precision SVG Overlay for Corners & Connecting Border ── */}
        <svg
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {/* 1. Subtle light yellow connecting perimeter border */}
          <rect
            x="3.5"
            y="3.5"
            width="253"
            height="253"
            rx="34"
            ry="34"
            stroke="#FFE853"
            strokeWidth="1.2"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* 2. Four Bright Vibrant Yellow Corner Brackets with Rounded Caps */}
          {/* Top-Left Corner */}
          <path
            d="M 3.5 48 L 3.5 37.5 A 34 34 0 0 1 37.5 3.5 L 48 3.5"
            stroke="#E5C200"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top-Right Corner */}
          <path
            d="M 212 3.5 L 222.5 3.5 A 34 34 0 0 1 256.5 37.5 L 256.5 48"
            stroke="#E5C200"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom-Right Corner */}
          <path
            d="M 256.5 212 L 256.5 222.5 A 34 34 0 0 1 222.5 256.5 L 212 256.5"
            stroke="#E5C200"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom-Left Corner */}
          <path
            d="M 48 256.5 L 37.5 256.5 A 34 34 0 0 1 3.5 222.5 L 3.5 212"
            stroke="#E5C200"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Caption or Error message below frame */}
      {hasError ? (
        <p className="mt-5 text-center font-dmsans text-[14px] text-[#DC2626]">
          Verification failed. Please try again.
        </p>
      ) : (
        <p className="mt-5 text-center font-dmsans text-[14px] text-[#71717A]">
          Position your face within the frame
        </p>
      )}
    </div>
  );
}
