import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function useJoinEstate() {
  const navigate = useNavigate()
  // Internal step logic: 1 to 6
  // 1: Estate ID (Display 1 of 5)
  // 2: Personal Details (Display 2 of 5)
  // 3: OTP (Display 2 of 5)
  // 4: Address (Display 3 of 5)
  // 5: Facial Capture (Display 4 of 5)
  // 6: PIN Setup (Display 5 of 5)
  const [internalStep, setInternalStep] = useState(1)

  // Form states
  const [estateId, setEstateId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [enableFaceId, setEnableFaceId] = useState(false)
  const [photoCaptured, setPhotoCaptured] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  /* ── Camera lifecycle for facial capture step ── */

  useEffect(() => {
    if (internalStep === 5 && !photoCaptured) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error('Camera access denied or unavailable', err)
        })
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [internalStep, photoCaptured])

  function handleCapturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      }
      setPhotoCaptured(true)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  /* ── Progress display ── */

  function getDisplayStep(step: number): number {
    if (step === 1) return 1
    if (step === 2 || step === 3) return 2
    if (step === 4) return 3
    if (step === 5) return 4
    if (step === 6) return 5
    return 1
  }

  const displayStep = getDisplayStep(internalStep)
  const totalSteps = 5

  /* ── Navigation ── */

  function handleNext() {
    if (internalStep < 6) {
      setInternalStep((prev) => prev + 1)
    } else {
      // Final submission
      navigate({ to: '/app/splash' })
    }
  }

  function handleBack() {
    if (internalStep > 1) {
      setInternalStep((prev) => prev - 1)
    } else {
      navigate({ to: '/app/welcome' })
    }
  }

  /* ── Per-step validation for the Continue button ── */

  function isStepValid(): boolean {
    switch (internalStep) {
      case 1:
        return estateId.trim().length > 0
      case 2:
        return fullName.trim().length > 0 && phoneNumber.trim().length > 0
      case 3:
        return otp.length === 4
      case 4:
        return street.trim().length > 0 && houseNumber.trim().length > 0
      case 5:
        return photoCaptured // simulated
      case 6:
        return pin.length === 4 && confirmPin.length === 4 && pin === confirmPin
      default:
        return false
    }
  }

  return {
    // step / progress
    internalStep,
    displayStep,
    totalSteps,
    // form fields
    estateId,
    setEstateId,
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    street,
    setStreet,
    houseNumber,
    setHouseNumber,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    enableFaceId,
    setEnableFaceId,
    photoCaptured,
    setPhotoCaptured,
    // camera
    videoRef,
    canvasRef,
    handleCapturePhoto,
    // navigation / validation
    handleNext,
    handleBack,
    isStepValid,
  }
}

export type UseJoinEstateReturn = ReturnType<typeof useJoinEstate>
