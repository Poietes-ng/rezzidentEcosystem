import { useRef } from 'react'
import { useZXingScanner } from '../hooks/useZXingScanner'
import type React from 'react'
import { cn } from '#/shared/utils/cn'

interface BarcodeScannerModalProps {
  onDetected: (result: string) => void
  onClose: () => void
}

export function BarcodeScannerModal({
  onDetected,
  onClose,
}: BarcodeScannerModalProps): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { error, scanning, torchOn, torchSupported, toggleTorch } = useZXingScanner({
    videoRef,
    onDetected,
  })

  return (
    /*
     * Fixed overlay — but the inner panel respects the AppFrame max-width
     * (max-w-[768px] centred) so it never stretches wider than the app on desktop.
     */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Barcode Scanner"
    >
      <div className="relative flex h-dvh w-full max-w-[768px] flex-col bg-black">
        {/* ── Top bar: back (left) · title (centre) · flash (right) ── */}
        <div className="flex items-center justify-between px-5 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-white transition-opacity active:opacity-60"
            aria-label="Close scanner"
          >
            <span className="material-symbols-outlined text-[26px]">close</span>
          </button>

          {/* centre slot intentionally empty — title lives below the viewfinder */}
          <span />

          {/*
           * Flash button — always rendered.
           * Dimmed (opacity-30) when the device doesn't expose a torch capability
           * so the layout stays balanced and users on supported devices see it lit.
           */}
          <button
            type="button"
            onClick={toggleTorch}
            className={cn(
              'flex h-10 w-10 items-center justify-center transition-opacity active:opacity-60',
              torchOn ? 'text-actionYellow' : 'text-white',
              !torchSupported && 'cursor-default opacity-30',
            )}
            aria-label={torchOn ? 'Turn flash off' : 'Turn flash on'}
            aria-pressed={torchOn}
            aria-disabled={!torchSupported}
          >
            <span className="material-symbols-outlined text-[26px]">
              {torchOn ? 'flash_on' : 'flash_off'}
            </span>
          </button>
        </div>

        {/* ── Body — viewfinder pushed 75px below icon bar ── */}
        <div className="flex flex-1 flex-col items-center px-6 pt-[75px] pb-12">
          {/* Title above the viewfinder */}
          <p className="font-dmsans mb-5 text-center text-[16px] font-semibold text-white">
            Scan Estate Barcode
          </p>

          {/* ── Viewfinder rect — 220 × 220, r=15 (design spec) ── */}
          <div className="relative h-[220px] w-[220px] select-none">
            {/* Camera stream — clipped to rounded rect */}
            <div className="absolute inset-[3px] overflow-hidden rounded-[15px] bg-gray-900">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>

            {/* Animated scan line */}
            {scanning && !error && (
              <div className="scan-line via-actionYellow pointer-events-none absolute inset-x-4 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent to-transparent" />
            )}

            {/*
             * SVG corner brackets — 220 × 220 viewBox, rx/ry = 15, arm = 30px.
             */}
            <ViewfinderOverlay />
          </div>

          {/* Hint below the viewfinder */}
          <p className="font-dmsans mt-5 text-center text-[12px] text-white/40">
            Align the barcode within the frame
          </p>

          {/* ── Error state (floated above bottom safe area) ── */}
          {error && (
            <div className="absolute inset-x-6 bottom-20 rounded-2xl bg-white/10 px-6 py-5 text-center backdrop-blur-sm">
              <span className="material-symbols-outlined mb-3 block text-[40px] text-red-400">
                camera_off
              </span>
              <p className="font-dmsans text-[14px] text-white">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scan-line keyframe */}
      <style>{`
        @keyframes scanline {
          0%   { top: 4px;              opacity: 1;   }
          50%  {                         opacity: 0.6; }
          100% { top: calc(100% - 4px); opacity: 1;   }
        }
        .scan-line { animation: scanline 2s ease-in-out infinite alternate; }
      `}</style>
    </div>
  )
}

// ── Viewfinder SVG overlay ─────────────────────────────────────────────────

function ViewfinderOverlay() {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {/* Subtle connecting perimeter */}
      <rect
        x="3.5"
        y="3.5"
        width="213"
        height="213"
        rx="15"
        ry="15"
        className="stroke-actionYellow/50"
        strokeWidth="1"
        fill="none"
      />

      {/* Top-Left */}
      <path
        d="M 3.5 33.5 L 3.5 18.5 A 15 15 0 0 1 18.5 3.5 L 33.5 3.5"
        className="stroke-actionYellowPressed"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top-Right */}
      <path
        d="M 186.5 3.5 L 201.5 3.5 A 15 15 0 0 1 216.5 18.5 L 216.5 33.5"
        className="stroke-actionYellowPressed"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Right */}
      <path
        d="M 216.5 186.5 L 216.5 201.5 A 15 15 0 0 1 201.5 216.5 L 186.5 216.5"
        className="stroke-actionYellowPressed"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Left */}
      <path
        d="M 33.5 216.5 L 18.5 216.5 A 15 15 0 0 1 3.5 201.5 L 3.5 186.5"
        className="stroke-actionYellowPressed"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
