import { Link } from '@tanstack/react-router'

export function SupportChannelsScreen() {
  return (
    <div className="font-dmsans flex min-h-full w-full flex-col bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div className="relative flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-actionDark absolute left-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-4xl">
            chevron_left
          </span>
        </button>
        <h2 className="font-dmsans text-actionDark text-[16px] font-semibold">
          Support
        </h2>
      </div>

      {/* ── Section Title with Badge ── */}
      <div className="mt-2 mb-4 flex items-center gap-2">
        <h1 className="font-dmsans text-actionDark text-[18px] font-bold">
          Product Support
        </h1>
        <span className="font-dmsans text-actionDark rounded-[4px] bg-[#FFE022] px-2 py-1 text-[12px] font-bold">
          Rezzident
        </span>
      </div>

      {/* ── Cards List ── */}
      <div className="space-y-4 pb-6">
        {/* Card 1: Call */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-5">
          <div className="flex items-center justify-between">
            <span className="font-dmsans text-[18px] font-bold text-[#1A1A1A]">
              Call
            </span>
            <div className="inline-flex items-center gap-1 rounded-[6px] bg-[#FBE5C4] px-2.5 py-1 text-[14px] font-bold text-[#1A1A1A]">
              <span className="material-symbols-outlined text-[#FF9100]">
                bolt
              </span>
              <span>Response time: Instant</span>
            </div>
          </div>
          <a
            href="tel:+2348077784848"
            className="group mt-4 flex items-center gap-3.5"
          >
            <div className="text-actionDark flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A0D] shadow-sm transition-colors group-hover:bg-gray-50">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="font-dmsans text-actionDark text-[17px] font-bold group-hover:underline">
                +234 8077784848
              </p>
              <p className="font-dmsans text-[15px] font-medium text-[#1A1A1A]">
                Give us a call
              </p>
            </div>
          </a>
        </div>

        {/* Card 2: Chat */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-5">
          <div className="flex items-center justify-between">
            <span className="font-dmsans text-actionDark text-[15px] font-bold">
              Chat
            </span>
            <div className="inline-flex items-center gap-1 rounded-[6px] bg-[#FBE5C4] px-2.5 py-1 text-[14px] font-bold text-[#1A1A1A]">
              <span className="material-symbols-outlined text-[#FF9100]">
                bolt
              </span>
              <span>Response time: 2 min</span>
            </div>
          </div>
          <a
            href="https://wa.me/2348077784848"
            target="_blank"
            rel="noreferrer"
            className="group mt-4 flex items-center gap-3.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A0D] shadow-sm transition-colors group-hover:bg-gray-50">
              {/* WhatsApp Green Icon */}
              <span className="material-symbols-outlined">
                selfhst:whatsapp
              </span>
            </div>
            <div>
              <p className="font-dmsans text-actionDark text-[15px] font-bold group-hover:underline">
                Whatsapp
              </p>
              <p className="font-dmsans text-[15px] font-medium text-[#1A1A1A]">
                Send us a message on whatsapp
              </p>
            </div>
          </a>
        </div>

        {/* Card 3: Email */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-5">
          <div className="flex items-center justify-between">
            <span className="font-dmsans text-actionDark text-[15px] font-bold">
              Email
            </span>
            <div className="inline-flex items-center gap-1 rounded-[6px] bg-[#FBF5CB] px-2.5 py-1 text-[14px] font-bold text-[#1A1A1A]">
              <span>Response time: 5 min</span>
            </div>
          </div>
          <a
            href="mailto:support@rezzident.co"
            className="group mt-4 flex items-center gap-3.5"
          >
            <div className="text-actionDark flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A0D] shadow-sm transition-colors group-hover:bg-gray-50">
              <span className="material-symbols-outlined">stacked_email</span>
            </div>
            <div>
              <p className="font-dmsans text-actionDark text-[15px] font-bold group-hover:underline">
                support@rezzident.co
              </p>
              <p className="font-dmsans text-[15px] font-medium text-[#1A1A1A]">
                Send us an email
              </p>
            </div>
          </a>
        </div>

        {/* Card 4: Articles */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-5">
          <span className="font-dmsans text-actionDark text-[15px] font-bold">
            Articles
          </span>
          <h3 className="font-dmsans text-actionDark mt-2 text-[17px] font-bold">
            Rezzident support documentation
          </h3>
          <p className="font-dmsans mt-1 text-[16px] font-medium text-[#9A9488]">
            Read up articles and docs on how to use the rezzident app.
          </p>
          <div className="mt-3">
            <Link
              to="/about"
              className="font-dmsans text-actionDark decoration-actionDark inline-flex items-center gap-1 text-[16px] font-bold underline underline-offset-4 hover:opacity-80"
            >
              <span>Read now</span>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        </div>

        {/* Card 5: Report an Issue */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-5">
          <h3 className="font-dmsans text-actionDark text-[17px] font-bold">
            Report an issue
          </h3>
          <p className="font-dmsans mt-1 text-[16px] font-medium text-[#9A9488]">
            Experiencing a bug or have feedback? Let us know and we’ll look into
            it.
          </p>
          <div className="mt-3">
            <Link
              to="/report-issue"
              className="font-dmsans text-actionDark decoration-actionDark inline-flex items-center gap-1 text-[16px] font-bold underline underline-offset-4 hover:opacity-80"
            >
              <span>Submit a report</span>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
