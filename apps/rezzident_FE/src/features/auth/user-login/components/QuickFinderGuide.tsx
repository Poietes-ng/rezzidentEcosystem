import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { Card } from '#/shared/components/ui/card'
import { MessageBubble } from '#/shared/components/ui/message-bubble'
import { Button } from '#/shared/components/ui/button'

const GUIDES = [
  {
    id: 1,
    title: 'Look at the estate gate',
    description:
      'Every estate using Rezzident has an official estate ID board displayed clearly at the gate entrance for visitors and residents.',
  },
  {
    id: 2,
    title: 'Reach out to estate admin',
    description:
      "Check your estate's community WhatsApp platform, or dial the admin's direct line to request your unique verification code.",
    hasBubble: true,
  },
  {
    id: 3,
    title: 'Ask your neighbours',
    description:
      'Your close neighbours are already registered on Rezzident. Feel free to ask them to share the estate code or let you scan the estate barcode.',
  },
]

export function QuickFinderGuide(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <section className="font-dmsans flex h-full w-full flex-col bg-transparent px-6 pb-8">
      {/* ── Header & Back Button ── */}
      <button
        onClick={() => window.history.back()}
        className="text-actionDark mt-6 mb-4 flex w-fit items-center justify-start transition-opacity hover:opacity-70 focus:outline-none"
      >
        <span className="material-symbols-outlined text-[18px]!">arrow_back_ios_new</span>
      </button>

      <div className="text-actionDark hide-scrollbar flex-1 overflow-y-auto pb-24">
        <span className="text-web-overline font-dmsans text-warmGray mb-2 block text-[12px] font-medium tracking-wider uppercase md:text-[14px]">
          QUICK FINDER GUIDE
        </span>

        <h1 className="text-web-h1 font-dmsans md:text-web-h1 mb-3 text-[28px] leading-tight font-bold">
          How to find your estate ID
        </h1>

        <p className="text-web-body font-dmsans text-warmGray md:text-web-body mb-8 text-[15px] leading-relaxed font-normal">
          Every residence linked with Rezzident has an active code. Here are the three easiest ways
          to retrieve yours right now.
        </p>

        <div className="flex flex-col gap-4">
          {GUIDES.map((guide) => (
            <Card
              key={guide.id}
              variant="outlined"
              className="border-stoneEdge/80 flex flex-col gap-3 rounded-2xl bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div className="text-actionDark flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[14px] font-bold">
                  {guide.id}
                </div>
                <div className="flex flex-1 flex-col pt-1">
                  <span className="font-dmsans text-actionDark text-[16px] font-bold">
                    {guide.title}
                  </span>
                  <span className="font-dmsans text-warmGray mt-2 text-[14px] leading-relaxed">
                    {guide.description}
                  </span>
                </div>
              </div>

              {guide.hasBubble && (
                <div className="mt-2 w-full">
                  <MessageBubble
                    content="Hi Admin, could you kindly share our Rezzident Estate ID?"
                    timestamp="Just now"
                    variant="sender"
                    readStatus="read"
                    className="max-w-[100%] bg-[#1A1A1A]"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* ── Fixed Bottom Button ── */}
      <div className="bg-lightCream/95 fixed right-0 bottom-0 left-0 mx-auto max-w-[768px] p-6 pt-4 backdrop-blur-sm">
        <Button
          className="h-[56px] w-full rounded-xl bg-[#1A1A1A] text-[16px] font-medium text-white hover:bg-[#1A1A1A]/90"
          onClick={() => navigate({ to: '/app/support' })}
        >
          Still Stuck? Contact Support
        </Button>
      </div>
    </section>
  )
}

export default QuickFinderGuide
