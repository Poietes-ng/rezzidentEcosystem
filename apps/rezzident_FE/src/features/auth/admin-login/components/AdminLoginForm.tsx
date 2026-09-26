import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '#/shared/components/ui/button'

export function AdminLoginForm() {
  const navigate = useNavigate()

  const steps = [
    {
      number: 1,
      title: 'Fill in estate details',
      description: 'Enter esta  te name, address, state, e.t.c.',
    },
    {
      number: 2,
      title: 'Setup estate structure',
      description: 'Number of units, naming structure, bank acc info.',
    },
    {
      number: 3,
      title: 'Management details',
      description:
        'At least 2 estate stakeholders information - full name, phone number, email &amp; NIN.',
    },
    {
      number: 4,
      title: 'Import residents (optional)',
      description: 'Upload a CSV file containing your residents data.',
    },
  ]

  return (
    <div className="flex w-full flex-col">
      {/* Back Button */}
      <div className="mb-web-lg">
        <Link
          to="/"
          className="text-web-sm font-web-medium text-actionDark inline-flex items-center gap-1 hover:opacity-70"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          Go Back
        </Link>
      </div>

      {/* Header */}
      <div className="mb-web-md">
        <span className="text-web-overline font-dmsans mb-3 block text-gray-400 uppercase">
          Setup Guide
        </span>
        <h1 className="font-cabinet text-web-h3 font-web-bold text-actionDark mb-3 leading-tight">
          Let's Set Up Your Estate
        </h1>
        <p className="font-dmsans text-web-sm leading-relaxed text-gray-500">
          Follow the steps below to configure your estate and start managing your community with
          Rezzident.
        </p>
      </div>

      {/* Steps */}
      <div className="mb-web-lg">
        {/* ── Timeline ── */}
        <div className="mt-6 space-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex items-start gap-4">
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="bg-stoneEdge/50 absolute top-[28px] left-[13px] h-[calc(100%-8px)] w-[1.5px]"
                  aria-hidden="true"
                />
              )}

              {/* Number Circle */}
              <div className="bg-actionDark relative z-10 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-xs">
                {step.number}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-5">
                <h3 className="font-dmsans text-actionDark text-[16px] leading-snug font-bold">
                  {step.title}
                </h3>
                <p className="font-dmsans text-warmGray mt-0.5 text-[13px] leading-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          className="h-[52px] w-full text-[14px]"
          onClick={() => navigate({ to: '/registration' })}
        >
          Get Started
        </Button>

        <Button
          variant="secondary"
          className="h-[52px] w-full text-[14px]"
          onClick={() => navigate({ to: '/app/login' })}
        >
          I already have an account
        </Button>
      </div>
    </div>
  )
}
