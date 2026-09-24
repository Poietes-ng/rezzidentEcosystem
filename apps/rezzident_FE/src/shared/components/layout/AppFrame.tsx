import React from 'react'
import { cn } from '../../utils/cn'

export type AppFrameProps = {
  children: React.ReactNode
  className?: string
  withTopSafeArea?: boolean
  withBottomSafeArea?: boolean
}

export function AppFrame({
  children,
  className,
  withTopSafeArea = true,
  withBottomSafeArea = true,
}: AppFrameProps): React.JSX.Element {
  return (
    <div className="bg-lightCream flex h-dvh w-full items-center justify-center">
      <div
        className={cn(
          'bg-lightCream relative flex h-full w-full max-w-[768px] flex-col overflow-hidden',
          withTopSafeArea && '',
          withBottomSafeArea && '',
          className,
        )}
      >
        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-hidden px-0">
          {children}
        </div>
      </div>
    </div>
  )
}
