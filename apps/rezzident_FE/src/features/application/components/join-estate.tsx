import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Switch } from "../../../shared/components/ui/switch";
import { PinInput } from "../../../shared/components/ui/pin-input";
import { cn } from "../../../shared/utils/cn";

export function JoinEstateFlow() {
  const navigate = useNavigate();
  // Internal step logic: 1 to 6
  // 1: Estate ID (Display 1 of 5)
  // 2: Personal Details (Display 2 of 5)
  // 3: OTP (Display 2 of 5)
  // 4: Address (Display 3 of 5)
  // 5: Facial Capture (Display 4 of 5)
  // 6: PIN Setup (Display 5 of 5)
  const [internalStep, setInternalStep] = useState(1);

  // Form states
  const [estateId, setEstateId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [enableFaceId, setEnableFaceId] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (internalStep === 5 && !photoCaptured) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access denied or unavailable", err);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [internalStep, photoCaptured]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      setPhotoCaptured(true);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const getDisplayStep = (step: number) => {
    if (step === 1) return 1;
    if (step === 2 || step === 3) return 2;
    if (step === 4) return 3;
    if (step === 5) return 4;
    if (step === 6) return 5;
    return 1;
  };

  const displayStep = getDisplayStep(internalStep);
  const totalSteps = 5;

  const handleNext = () => {
    if (internalStep < 6) {
      setInternalStep((prev) => prev + 1);
    } else {
      // Final submission
      navigate({ to: "/app/splash" });
    }
  };

  const handleBack = () => {
    if (internalStep > 1) {
      setInternalStep((prev) => prev - 1);
    } else {
      navigate({ to: "/app/welcome" });
    }
  };

  // Validation logic for buttons
  const isStepValid = () => {
    switch (internalStep) {
      case 1:
        return estateId.trim().length > 0;
      case 2:
        return fullName.trim().length > 0 && phoneNumber.trim().length > 0;
      case 3:
        return otp.length === 4;
      case 4:
        return street.trim().length > 0 && houseNumber.trim().length > 0;
      case 5:
        return photoCaptured; // simulated
      case 6:
        return pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;
      default:
        return false;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white font-dmsans">
      {/* Header */}
      <div className="flex flex-col px-6 pt-12 pb-4">
        <button onClick={handleBack} className="mb-6 flex items-center justify-start text-actionDark w-fit">
          <span className="material-symbols-outlined text-[24px]">chevron_left</span>
        </button>

        {/* Progress Bar */}
        <div className="relative h-[4px] w-full max-w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full bg-actionDark transition-all duration-300"
            style={{ width: `${(displayStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col px-6 pb-8 overflow-y-auto hide-scrollbar">

        {/* Step 1: Estate ID */}
        {internalStep === 1 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              Enter your estate ID
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              Your estate administrator will provide you with a unique code to join your community.
            </p>

            <div className="mb-2">
              <label className="mb-2 block text-[12px] font-medium text-gray-400">Estate ID</label>
              <Input
                type="text"
                placeholder="e.g. RSZ-2024-LEKK"
                value={estateId}
                onChange={(e) => setEstateId(e.target.value)}
                className="h-[52px] border-x-0 border-t-0 border-b border-gray-300 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-actionYellow font-medium text-[15px]"
              />
            </div>
            <p className="mb-8 text-[11px] text-gray-400">Usually found in your welcome letter or email</p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-gray-100"></div>
              <span className="text-[12px] text-gray-400">or</span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            <Button variant="secondary" className="w-full mb-8">
              <span className="material-symbols-outlined mr-2 text-[20px]">qr_code_scanner</span>
              Scan Estate Barcode
            </Button>

            <div className="text-center mb-8">
              <a href="#" className="text-[13px] font-bold text-actionDark underline underline-offset-4 decoration-gray-300">
                I don't have my estate ID
              </a>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full"
              >
                Continue
              </Button>
              <Button variant="secondary" className="w-full mb-6">
                I already have an account
              </Button>
              <p className="text-center text-[10px] text-gray-400">
                By continuing, you agree to our <span className="underline decoration-gray-300">Terms</span> & <span className="underline decoration-gray-300">Privacy Policy</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {internalStep === 2 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              What's your name?
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              We'll use this to personalize your experience
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-[12px] font-medium text-gray-400">Full Name</label>
              <Input
                type="text"
                placeholder="e.g. Adaeze Okonkwo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-[52px] border-x-0 border-t-0 border-b border-gray-300 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-actionYellow font-medium text-[15px]"
              />
            </div>

            <div className="mb-2">
              <label className="mb-2 block text-[12px] font-medium text-gray-400">Phone Number</label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-actionYellow transition-colors">
                <span className="text-[15px] font-medium text-actionDark mr-2 whitespace-nowrap">+234</span>
                <div className="w-[1px] h-[20px] bg-gray-300 mr-2"></div>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-[52px] border-none rounded-none px-0 bg-transparent focus-visible:ring-0 font-medium text-[15px]"
                />
              </div>
            </div>
            <p className="mb-8 text-[11px] text-gray-400">We'll send a verification code to this number</p>

            <div className="mt-auto">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {internalStep === 3 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              Verify your number
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              We sent a 4-digit code to +234 {phoneNumber || "801 234 XXXX"}
            </p>

            <div className="mb-8 flex justify-center">
              <PinInput
                length={4}
                value={otp}
                onChange={setOtp}
                className="gap-6"
              />
            </div>

            <div className="text-center mb-8">
              <p className="text-[13px] font-medium text-gray-500">
                Didn't receive a code? <button className="text-actionDark font-bold underline underline-offset-4 decoration-gray-300">Resend</button>
              </p>
            </div>

            <div className="mt-auto">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={cn(
                  "h-[52px] w-full rounded-2xl text-[15px] font-medium transition-colors",
                  isStepValid() ? "bg-actionDark text-white hover:bg-actionDark/90" : "bg-[#D3D0C9] text-white"
                )}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Address */}
        {internalStep === 4 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              Where do you live?
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              This helps us connect you to your community
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-[12px] font-medium text-gray-400">Street</label>
              <Input
                type="text"
                placeholder="e.g. Admiralty Way"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="h-[52px] border-x-0 border-t-0 border-b border-gray-300 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-actionDark font-medium text-[15px]"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-[12px] font-medium text-gray-400">House Number</label>
              <Input
                type="text"
                placeholder="e.g. Block C, Unit 7"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="h-[52px] border-x-0 border-t-0 border-b border-gray-300 rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-actionDark font-medium text-[15px]"
              />
            </div>

            <div className="mt-auto">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={cn(
                  "h-[52px] w-full rounded-2xl text-[15px] font-medium transition-colors",
                  isStepValid() ? "bg-actionDark text-white hover:bg-actionDark/90" : "bg-[#D3D0C9] text-white"
                )}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Facial Capture */}
        {internalStep === 5 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              Let's verify your identity
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              Take a quick selfie for secure access to your estate
            </p>

            <div className="flex flex-1 flex-col items-center justify-center">
              <div className={cn(
                "relative w-[280px] aspect-square rounded-[24px] border-[2px] mb-6 transition-colors duration-300 overflow-hidden",
                photoCaptured ? "border-[#05A645] bg-[#05A645]/5" : "border-[#FFE022] bg-black border-dashed"
              )}>
                {/* Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn("absolute inset-0 w-full h-full object-cover", photoCaptured ? "hidden" : "block")}
                />

                {/* Captured Snapshot */}
                <canvas
                  ref={canvasRef}
                  className={cn("absolute inset-0 w-full h-full object-cover", photoCaptured ? "block" : "hidden")}
                />

                {/* Frame corners overlay */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-inherit rounded-tl-[24px] z-10"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-inherit rounded-tr-[24px] z-10"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-inherit rounded-bl-[24px] z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-inherit rounded-br-[24px] z-10"></div>
              </div>

              <p className={cn(
                "text-[13px] font-medium",
                photoCaptured ? "text-[#05A645]" : "text-gray-400"
              )}>
                {photoCaptured ? "Face captured successfully" : "Position your face within the frame"}
              </p>
            </div>

            <div className="mt-auto">
              {!photoCaptured ? (
                <Button
                  onClick={handleCapturePhoto}
                  className="w-full"
                >
                  <span className="material-symbols-outlined mr-2">photo_camera</span>
                  Take Photo
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPhotoCaptured(false)}
                    className="w-full"
                  >
                    Retake
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: PIN Setup */}
        {internalStep === 6 && (
          <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Step {displayStep} of {totalSteps}
            </span>
            <h1 className="mb-3 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
              Create your PIN
            </h1>
            <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
              Set a 4-digit PIN for quick and secure access
            </p>

            <div className="flex flex-col items-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-gray-400 mb-4">Enter PIN</span>
                <PinInput
                  length={4}
                  value={pin}
                  onChange={setPin}
                  className="gap-6"
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[12px] text-gray-400 mb-4">Confirm PIN</span>
                <PinInput
                  length={4}
                  value={confirmPin}
                  onChange={setConfirmPin}
                  className="gap-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-4 mb-4">
              <div className="flex items-center gap-2 text-actionDark font-medium text-[14px]">
                <span className="material-symbols-outlined text-[20px]">ar_on_you</span>
                Enable Face ID
              </div>
              <Switch
                checked={enableFaceId}
                onCheckedChange={setEnableFaceId}
                className="data-[state=checked]:bg-actionDark data-[state=unchecked]:bg-gray-200 border-none shadow-none focus-visible:ring-0 w-[42px] h-[24px]"
              />
            </div>

            <div className="mt-auto">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
