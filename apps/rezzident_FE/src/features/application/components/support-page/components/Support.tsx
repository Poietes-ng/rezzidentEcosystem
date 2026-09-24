import type React from 'react'
import { Card } from '#/shared/components/ui/card'

export function Support(): React.JSX.Element {
  return (
    <section className="font-dmsans flex h-full w-full flex-col bg-transparent px-6 pb-10">
      {/* ── Header ── */}
      <div className="relative mb-8 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="text-actionDark z-10 flex h-10 w-10 items-center justify-start transition-opacity hover:opacity-70 focus:outline-none"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[18px]!">arrow_back_ios_new</span>
        </button>
        <h1 className="text-actionDark pointer-events-none absolute right-0 left-0 text-center text-[18px] font-bold">
          Support
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="hide-scrollbar flex-1 overflow-y-auto pb-8">
        {/* ── Subheader ── */}
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-actionDark text-[18px] font-bold">Product Support</h2>
          <span className="bg-actionYellow text-actionDark rounded-md px-3 py-1 text-[13px] font-medium">
            Rezzident
          </span>
        </div>

        {/* ── Cards List ── */}
        <div className="flex flex-col gap-4">
          {/* CALL */}
          <a href="tel:+2348077784848" className="block">
            <Card
              variant="flat"
              className="flex cursor-pointer flex-col gap-4 p-5 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-actionDark text-[16px] font-bold">Call</span>
                <div className="bg-cardwarning text-actionDark flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-semibold">
                  <span className="material-symbols-outlined text-warningGold! text-[14px]">
                    bolt
                  </span>
                  Response time: Instant
                </div>
              </div>
              <div className="mt-1 flex items-start gap-4">
                <span className="material-symbols-outlined text-actionDark mt-0.5 text-[20px]">
                  call
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-actionDark text-[15px] font-medium">+234 8077784848</span>
                  <span className="text-actionDark text-[14px]">Give us a call</span>
                </div>
              </div>
            </Card>
          </a>

          {/* CHAT */}
          <a
            href="https://wa.me/2348107470031"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card
              variant="flat"
              className="flex cursor-pointer flex-col gap-4 p-5 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-actionDark text-[16px] font-bold">Chat</span>
                <div className="bg-cardwarning text-actionDark flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-semibold">
                  <span className="material-symbols-outlined text-warningGold! text-[14px]">
                    bolt
                  </span>
                  Response time: 2 min
                </div>
              </div>
              <div className="mt-1 flex items-start gap-4">
                <img
                  src="/assets/selfhst_whatsapp.svg"
                  alt="whatsapp"
                  className="mt-0.5 h-5 w-5 shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-actionDark text-[15px] font-medium">Whatsapp</span>
                  <span className="text-actionDark text-[14px]">Send us a message on whatsapp</span>
                </div>
              </div>
            </Card>
          </a>

          {/* EMAIL */}
          <a href="mailto:support@rezzident.co" className="block">
            <Card
              variant="flat"
              className="flex cursor-pointer flex-col gap-4 p-5 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-actionDark text-[16px] font-bold">Email</span>
                <div className="bg-inputBg text-actionDark flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-semibold">
                  Response time: 5 min
                </div>
              </div>
              <div className="mt-1 flex items-start gap-4">
                <span className="material-symbols-outlined text-actionDark mt-0.5 text-[20px]">
                  stacked_email
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-actionDark text-[15px] font-medium">
                    support@rezzident.co
                  </span>
                  <span className="text-actionDark text-[14px]">Send us an email</span>
                </div>
              </div>
            </Card>
          </a>

          {/* ARTICLES */}
          <Card variant="flat" className="flex flex-col gap-3 p-5">
            <span className="text-actionDark text-[16px] font-bold">Articles</span>
            <div className="mt-2 flex flex-col">
              <span className="text-actionDark text-[15px] font-bold">
                Rezzident support documentation
              </span>
              <span className="text-warmGray mt-1.5 text-[14px] leading-relaxed">
                Read up articles and docs on how to use the rezzident app.
              </span>
            </div>
            <button className="text-actionDark group mt-3 flex w-fit items-center gap-1 text-[14px] font-bold transition-opacity hover:opacity-70">
              <span className="underline underline-offset-2">Read now</span>
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                chevron_right
              </span>
            </button>
          </Card>

          {/* REPORT AN ISSUE */}
          <Card variant="flat" className="flex flex-col gap-3 p-5">
            <span className="text-actionDark text-[16px] font-bold">Report an issue</span>
            <span className="text-warmGray mt-1 text-[14px] leading-relaxed">
              Experiencing a bug or have feedback? Let us know and we'll look into it.
            </span>
            <button className="text-actionDark group mt-3 flex w-fit items-center gap-1 text-[14px] font-bold transition-opacity hover:opacity-70">
              <span className="underline underline-offset-2">Submit a report</span>
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                chevron_right
              </span>
            </button>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Support
