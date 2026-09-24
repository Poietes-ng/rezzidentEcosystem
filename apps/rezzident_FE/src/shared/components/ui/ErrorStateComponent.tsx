import { Link } from '@tanstack/react-router'
import { Button } from './button'

interface ErrorStateComponentProps {
  statusCode: string
  title: string
  description: string
  actionText?: string
  actionLink?: string
  onAction?: () => void
  icon?: string
}

export function ErrorStateComponent({
  statusCode,
  title,
  description,
  actionText = 'Go Home',
  actionLink = '/app/welcome',
  onAction,
  icon = 'error',
}: ErrorStateComponentProps) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center px-6 py-12 text-center">
      {/* Animated Icon Container */}
      <div className="rounded-ful relative mb-8 flex h-32 w-32 items-center justify-center shadow-xl shadow-gray-200/50">
        <img
          src="/assets/LoginHeroImageTest1.png"
          alt=""
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
        <div className="bg-actionYellow absolute inset-0 animate-ping rounded-full opacity-20"></div>
        <span className="material-symbols-outlined animate-bounce text-[64px] text-white">
          {icon}
        </span>
      </div>

      <div className="bg-actionDark text-actionYellow mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold">
        {statusCode}
      </div>

      <h1 className="font-cabinet text-actionDark mb-4 text-[32px] leading-tight font-bold">
        {title}
      </h1>

      <p className="font-dmsans text-body-base mb-8 text-gray-500">{description}</p>

      {onAction ? (
        <Button onClick={onAction} className="min-w-[200px]">
          {actionText}
        </Button>
      ) : (
        <Link to={actionLink} className="w-full max-w-[200px]">
          <Button className="w-full">{actionText}</Button>
        </Link>
      )}
    </div>
  )
}
