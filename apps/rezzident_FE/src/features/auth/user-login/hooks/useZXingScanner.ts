/**
 * useZXingScanner — encapsulates ZXing BrowserMultiFormatReader lifecycle:
 *   • camera stream acquisition
 *   • console-noise suppression (NotFoundException / ChecksumException spam)
 *   • torch capability detection
 *
 * Extracted from BarcodeScannerModal to keep that component ≤ 250 lines.
 */
import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException, ChecksumException, FormatException } from '@zxing/library'

interface UseZXingScannerOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onDetected: (result: string) => void
}

interface UseZXingScannerResult {
  error: string | null
  scanning: boolean
  torchOn: boolean
  torchSupported: boolean
  toggleTorch: () => Promise<void>
}

export function useZXingScanner({
  videoRef,
  onDetected,
}: UseZXingScannerOptions): UseZXingScannerResult {
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(true)
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)

  // ── Torch toggle ──────────────────────────────────────────────────────────
  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] })
      setTorchOn((prev) => !prev)
    } catch {
      // Device doesn't support torch — silently ignore
    }
  }

  // ── Scanner setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let stopped = false

    // Suppress ZXing's internal per-frame decode noise (NotFoundException,
    // ChecksumException, etc. are expected while no barcode is in frame).
    // ZXing routes these through console.log, console.warn, AND console.error.
    /* eslint-disable no-console */
    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    const isZXingNoise = (args: unknown[]) =>
      args.some(
        (a) =>
          a instanceof NotFoundException ||
          a instanceof ChecksumException ||
          a instanceof FormatException ||
          (typeof a === 'string' && a.includes('MultiFormatReader')) ||
          (a instanceof Error &&
            (a.name === 'NotFoundException' ||
              a.name === 'ChecksumException' ||
              a.name === 'FormatException')),
      )
    console.log = (...args: unknown[]) => {
      if (isZXingNoise(args)) return
      originalLog.apply(console, args)
    }
    console.warn = (...args: unknown[]) => {
      if (isZXingNoise(args)) return
      originalWarn.apply(console, args)
    }
    console.error = (...args: unknown[]) => {
      if (isZXingNoise(args)) return
      originalError.apply(console, args)
    }
    /* eslint-enable no-console */

    async function startScan() {
      try {
        if (!videoRef.current) return

        await reader.decodeFromConstraints(
          {
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          videoRef.current,
          (result, err) => {
            if (stopped) return
            if (result) {
              setScanning(false)
              onDetected(result.getText())
            } else if (err && !(err instanceof NotFoundException)) {
              // NotFoundException fires every frame with no barcode — ignore it
              // eslint-disable-next-line no-console
              console.warn('Scan error:', err)
            }
          },
        )

        // Capture the active stream so the torch toggle can access its track
        // videoRef.current is non-null here (guarded by early-return above)
        const stream = videoRef.current.srcObject as MediaStream | null
        if (stream) {
          streamRef.current = stream
          const track = stream.getVideoTracks()[0]
          // Optional chains needed for runtime browser compat — TS types don't
          // reflect that getCapabilities may be absent on some browsers.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const caps = track?.getCapabilities?.() as Record<string, unknown> | undefined
          if (caps && 'torch' in caps) {
            setTorchSupported(true)
          }
        }
      } catch (e: unknown) {
        if (stopped) return
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
          setError('Camera permission denied. Please allow camera access and try again.')
        } else {
          setError('Unable to access camera. Please check your device settings.')
        }
      }
    }

    startScan()

    return () => {
      stopped = true
      // Restore console methods and stop all camera streams
      /* eslint-disable no-console */
      console.log = originalLog
      console.warn = originalWarn
      console.error = originalError
      /* eslint-enable no-console */
      BrowserMultiFormatReader.releaseAllStreams()
    }
  }, [onDetected, videoRef])

  return { error, scanning, torchOn, torchSupported, toggleTorch }
}
