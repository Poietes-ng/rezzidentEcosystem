import { Link, useRouterState } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface NavTab {
  id: string
  label: string
  icon: string
  to?: LinkProps['to'] | (string & {})
  disabled?: boolean
}

export interface BottomNavigationProps {
  className?: string
  tabs?: NavTab[]
  onTabClick?: (tabId: string) => void
}

export const DEFAULT_TABS: NavTab[] = [
  { id: 'home', label: 'Home', icon: 'home', to: '/user-dashboard' },
  { id: 'bills', label: 'Bills', icon: 'payments', to: '/bills' },
  { id: 'forum', label: 'Forum', icon: 'group_work', to: '/forum' },
  { id: 'vote', label: 'Vote', icon: 'how_to_vote', to: '/vote' },
  { id: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
]

export function BottomNavigation({
  className,
  tabs = DEFAULT_TABS,
  onTabClick,
}: BottomNavigationProps): ReactNode {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        'border-t border-black/5 bg-white/95 backdrop-blur-md',
        'fixed bottom-0 left-1/2 z-40 -translate-x-1/2',
        'min-h-[64px] w-full max-w-[768px]',
        'pb-[env(safe-area-inset-bottom,0px)]',
        'flex items-center justify-around px-2',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isTabDisabled = Boolean(tab.disabled)

        // Single active rule: tab's `to` matches current router path
        const isActive = !isTabDisabled && Boolean(tab.to) && currentPath === tab.to

        const content = (
          <>
            <span
              className={cn(
                'material-symbols-outlined text-[24px] leading-none transition-colors duration-150',
                isActive
                  ? "text-actionDark [font-variation-settings:'FILL'_1]"
                  : "text-warmGray [font-variation-settings:'FILL'_0]",
              )}
              aria-hidden="true"
            >
              {tab.icon}
            </span>
            <span
              className={cn(
                'font-dmsans text-[12px] leading-tight tracking-tight transition-colors duration-150 select-none',
                isActive ? 'text-actionDark font-bold' : 'text-warmGray font-medium',
              )}
            >
              {tab.label}
            </span>
          </>
        )

        const itemClasses = cn(
          'group flex flex-1 flex-col items-center justify-center gap-1 py-1 outline-none',
          'transition-all duration-150',
          isTabDisabled
            ? 'cursor-not-allowed opacity-40 active:scale-100'
            : 'cursor-pointer active:scale-90',
        )

        if (tab.to && !isTabDisabled) {
          return (
            <Link
              key={tab.id}
              to={tab.to}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onTabClick?.(tab.id)}
              className={itemClasses}
            >
              {content}
            </Link>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            disabled={isTabDisabled}
            aria-disabled={isTabDisabled}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              if (isTabDisabled) return
              onTabClick?.(tab.id)
            }}
            className={itemClasses}
          >
            {content}
          </button>
        )
      })}
    </nav>
  )
}
