import { useNavigate, Link } from "@tanstack/react-router";
import { Button } from "#/shared/components/ui/button";

export function RegistrationCriteria() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col">
      {/* Back Button */}
      <div className="mb-web-lg">
        <Link to="/" className="inline-flex items-center gap-1 text-web-sm font-web-medium text-actionDark hover:opacity-70">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Go Back
        </Link>
      </div>

      {/* Header */}
      <div className="mb-web-md">
        <span className="mb-3 block text-web-overline text-gray-400 uppercase font-dmsans">
          Setup Guide
        </span>
        <h1 className="mb-3 font-cabinet text-web-h3 font-web-bold leading-tight text-actionDark">
          Let's Set Up Your Estate
        </h1>
        <p className="font-dmsans text-web-sm text-gray-500 leading-relaxed">
          Follow the steps below to configure your estate and start managing your community with Rezzident.
        </p>
      </div>

      {/* Steps */}
      <div className="relative mb-web-lg pl-1">
        {/* Vertical line connecting steps */}
        <div className="absolute left-[15px] top-[28px] bottom-[28px] w-[1px] bg-gray-200" />

        <div className="flex flex-col gap-7">
          {/* Step 1 */}
          <div className="relative z-10 flex gap-4 items-start">
            <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-actionDark text-web-xs font-web-bold text-white ring-[6px] ring-[#FAFAF5]">
              1
            </div>
            <div className="pt-1">
              <h3 className="font-dmsans text-web-sm font-web-bold text-actionDark leading-tight">
                Fill in estate details
              </h3>
              <p className="mt-1 font-dmsans text-web-xs text-gray-400 leading-snug">
                Enter estate name, address, state, e.t.c.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex gap-4 items-start">
            <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-actionDark text-web-xs font-web-bold text-white ring-[6px] ring-[#FAFAF5]">
              2
            </div>
            <div className="pt-1">
              <h3 className="font-dmsans text-web-sm font-web-bold text-actionDark leading-tight">
                Setup estate structure
              </h3>
              <p className="mt-1 font-dmsans text-web-xs text-gray-400 leading-snug">
                Number of units, naming structure, bank acc info.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex gap-4 items-start">
            <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-actionDark text-web-xs font-web-bold text-white ring-[6px] ring-[#FAFAF5]">
              3
            </div>
            <div className="pt-1">
              <h3 className="font-dmsans text-web-sm font-web-bold text-actionDark leading-tight">
                Management details
              </h3>
              <p className="mt-1 font-dmsans text-web-xs text-gray-400 leading-snug">
                At least 2 estate stakeholders information - full name, phone number, email &amp; NIN.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          className="w-full h-[52px] text-[14px]"
          onClick={() => navigate({ to: "/registration" })}
        >
          Get Started
        </Button>

        <Button
          variant="secondary"
          className="w-full h-[52px] text-[14px]"
          onClick={() => navigate({ to: "/" })}
        >
          I already have an account
        </Button>
      </div>
    </div>
  );
}
