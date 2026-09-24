import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { Card } from '#/shared/components/ui/card'

const MAIN_RECOVERY_OPTIONS = [
  {
    id: 1,
    title: 'Contact Support',
    description: 'Our team can verify your details and help you move forward.',
    icon: 'support_agent',
    route: '/app/support',
  },
  {
    id: 2,
    title: 'Get vouched for by neighbours',
    description: 'Ask trusted neighbours to confirm your identity so you can continue.',
    imageIcon: '/assets/vouch.svg',
    route: '/app/vouch',
  },
]

const SEARCH_OPTION = {
  id: 3,
  title: 'How to find your estate ID',
  description: 'Open a short guide that shows where to locate it if you still want to look.',
  route: '/app/onboarding/get-started/find-estate-id',
}

export default function IDontHaveEstatePrefix(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <section className="font-dmsans flex h-full w-full flex-col overflow-y-auto bg-transparent px-6 pb-10">
      <button
        onClick={() => navigate({ to: '/app/join' })}
        className="text-actionDark mt-6 mb-6 flex w-fit items-center justify-start transition-opacity hover:opacity-70"
      >
        <span className="material-symbols-outlined text-[18px]!">arrow_back_ios_new</span>
      </button>

      <div className="text-actionDark">
        <span className="text-web-overline font-dmsans text-warmGray md:text-web-sm mb-3 block text-sm font-medium tracking-wider uppercase">
          WE’LL HELP YOU GET BACK IN
        </span>
        <h1 className="font-dmsans text-web-h1 font-web-bold text-actionDark mb-3 leading-tight">
          No estate ID? <br /> We understand.
        </h1>
        <p className="font-dmsans text-web-md leading-relaxed text-gray-500">
          It happens more often than you'd think. Choose the option below that feels easiest for you
          right now.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-8">
        <span className="font-dmsans text-warmGray pb-1 text-sm font-semibold">
          Choose a recovery option
        </span>

        {/* First Two Cards (Bordered, No Chevron) */}
        {MAIN_RECOVERY_OPTIONS.map((option) => (
          <Card
            key={option.id}
            variant="outlined"
            onClick={() => navigate({ to: option.route as any })}
            role="button"
            tabIndex={0}
            className="hover:border-actionYellow focus:ring-actionYellow flex cursor-pointer items-center gap-4 bg-white p-4 transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
          >
            <div className="text-actionDark flex shrink-0 items-center justify-center rounded-full">
              {option.imageIcon ? (
                <img
                  src={option.imageIcon}
                  alt={option.title}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="material-symbols-outlined text-[40px]!">{option.icon}</span>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <span className="font-dmsans text-actionDark text-base font-semibold">
                {option.title}
              </span>
              <span className="font-dmsans mt-0.5 line-clamp-2 text-sm font-normal text-gray-500">
                {option.description}
              </span>
            </div>
          </Card>
        ))}

        {/* Third Card (No Border, Transparent, With Chevron, 28px Margin Top) */}
        <div
          onClick={() => navigate({ to: SEARCH_OPTION.route as any })}
          role="button"
          tabIndex={0}
          className="group mt-7 flex cursor-pointer items-center gap-4 p-4 transition-all focus:outline-none active:scale-[0.98]"
        >
          <div className="flex flex-1 flex-col">
            <span className="font-dmsans text-actionDark text-base font-bold">
              {SEARCH_OPTION.title}
            </span>
            <span className="font-dmsans mt-0.5 line-clamp-2 text-sm text-gray-500">
              {SEARCH_OPTION.description}
            </span>
          </div>

          <span className="material-symbols-outlined group-hover:text-actionDark shrink-0 text-gray-400 transition-colors">
            chevron_right
          </span>
        </div>
      </div>
    </section>
  )
}
