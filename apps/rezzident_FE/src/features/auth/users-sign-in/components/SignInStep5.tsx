import { Button } from '../../../../shared/components/ui/button'
import { cn } from '../../../../shared/utils/cn'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step5FacialCapture({ join }: Props) {
  const {
    displayStep,
    totalSteps,
    photoCaptured,
    setPhotoCaptured,
    videoRef,
    canvasRef,
    handleCapturePhoto,
    handleNext,
  } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        Let's verify your identity
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        Take a quick selfie for secure access to your estate
      </p>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className={cn(
            'relative mb-6 aspect-square w-[280px] overflow-hidden rounded-[24px] border-[2px] transition-colors duration-300',
            photoCaptured
              ? 'border-[#05A645] bg-[#05A645]/5'
              : 'border-dashed border-[#FFE022] bg-black',
          )}
        >
          {/* Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              photoCaptured ? 'hidden' : 'block',
            )}
          />

          {/* Captured Snapshot */}
          <canvas
            ref={canvasRef}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              photoCaptured ? 'block' : 'hidden',
            )}
          />

          {/* Frame corners overlay */}
          <div className="absolute top-0 left-0 z-10 h-8 w-8 rounded-tl-[24px] border-t-4 border-l-4 border-inherit"></div>
          <div className="absolute top-0 right-0 z-10 h-8 w-8 rounded-tr-[24px] border-t-4 border-r-4 border-inherit"></div>
          <div className="absolute bottom-0 left-0 z-10 h-8 w-8 rounded-bl-[24px] border-b-4 border-l-4 border-inherit"></div>
          <div className="absolute right-0 bottom-0 z-10 h-8 w-8 rounded-br-[24px] border-r-4 border-b-4 border-inherit"></div>
        </div>

        <p
          className={cn(
            'text-[13px] font-medium',
            photoCaptured ? 'text-[#05A645]' : 'text-gray-400',
          )}
        >
          {photoCaptured ? 'Face captured successfully' : 'Position your face within the frame'}
        </p>
      </div>

      <div className="mt-auto">
        {!photoCaptured ? (
          <Button onClick={handleCapturePhoto} className="w-full">
            <span className="material-symbols-outlined mr-2">photo_camera</span>
            Take Photo
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setPhotoCaptured(false)} className="w-full">
              Retake
            </Button>
            <Button onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
