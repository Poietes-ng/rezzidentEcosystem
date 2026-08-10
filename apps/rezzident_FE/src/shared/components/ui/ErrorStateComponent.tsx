import { Link } from "@tanstack/react-router";
import { Button } from "./button";

interface ErrorStateComponentProps {
  statusCode: string;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: string;
}

export function ErrorStateComponent({
  statusCode,
  title,
  description,
  actionText = "Go Home",
  actionLink = "/app/welcome",
  onAction,
  icon = "error",
}: ErrorStateComponentProps) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
      {/* Animated Icon Container */}
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl shadow-gray-200/50">
        <div className="absolute inset-0 animate-ping rounded-full bg-actionYellow opacity-20"></div>
        <span className="material-symbols-outlined animate-bounce text-[64px] text-actionDark">
          {icon}
        </span>
      </div>

      <div className="mb-2 inline-flex items-center rounded-full bg-actionDark px-3 py-1 text-xs font-bold text-actionYellow">
        {statusCode}
      </div>

      <h1 className="mb-4 font-cabinet text-[32px] font-bold leading-tight text-actionDark">
        {title}
      </h1>

      <p className="mb-8 font-dmsans text-body-base text-gray-500">
        {description}
      </p>

      {onAction ? (
        <Button onClick={onAction} className="min-w-[200px]">
          {actionText}
        </Button>
      ) : (
        <Link to={actionLink} className="w-full max-w-[200px]">
          <Button className="w-full">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
}
