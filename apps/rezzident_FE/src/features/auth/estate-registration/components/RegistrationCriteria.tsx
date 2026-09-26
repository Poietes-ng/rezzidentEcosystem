import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '#/shared/components/ui/button'

export function RegistrationCriteria() {
  const navigate = useNavigate()

  const steps = [
    {
      number: 1,
      title: 'Fill in estate details',
      description: 'Enter estate name, address, state, e.t.c.',
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
      {/* Header */}

      <div className="bg-menuHover sticky top-0 z-30 flex w-full flex-1 flex-col">
        {/* Back Button */}
        <div className="bg-menuHover sticky top-0 z-10 mt-1.5 mb-15.75">
          <Link
            to="/"
            className="font-dmsans text-actionDark inline-flex items-center gap-2 text-base font-normal hover:opacity-70"
          >
            <span className="material-symbols-outlined text-[13px]!">arrow_back_ios_new</span>
            Go Back
          </Link>
        </div>
      </div>

      {/* Steps */}
      <div className="">
        <span className="text-web-overline text-warmGray font-dmsans mb-8 block text-[14px] font-medium uppercase">
          Setup Guide
        </span>
        <h1 className="font-dmsans font-web-bold text-actionDark mb-4 text-[28px] leading-tight">
          Let's Set Up Your Estate
        </h1>
        <p className="font-dmsans text-web-sm text-warmGray mb-8 leading-relaxed">
          Follow the steps below to configure your estate and start managing your community with
          Rezzident.
        </p>
        {/* ── Timeline ── */}
        <div className="space-y-0">
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
              <div className={`flex-1 ${idx < steps.length - 1 ? 'pb-[32px]' : ''}`}>
                <h3 className="font-dmsans text-actionDark text-[16px] leading-snug font-semibold">
                  {step.title}
                </h3>
                <p className="font-dmsans text-warmGray mt-1 text-[13px] leading-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-xl mt-16 flex flex-col gap-3">
        <Button variant="primary" onClick={() => navigate({ to: '/registration' })}>
          Get Started
        </Button>

        <Button variant="secondary" onClick={() => navigate({ to: '/admin-login' })}>
          I already have an account
        </Button>
      </div>
    </div>
  )
}
