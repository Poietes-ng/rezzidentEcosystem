import * as React from "react";
import { cn } from "../../utils/cn";

export interface ServerDowntimeErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

export const ServerDowntimeError = React.forwardRef<HTMLDivElement, ServerDowntimeErrorProps>(
  (
    {
      className,
      title = "Server Downtime",
      description = "Our servers are currently undergoing maintenance. Please check back shortly.",
      onClose,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex items-start gap-3.5 rounded-2xl bg-errorRed p-4 text-white shadow-sm font-dmsans",
          className
        )}
        {...props}
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white text-white font-bold text-[14px] mt-0.5 select-none">
          !
        </div>
        <div className="flex-1">
          <h3 className="font-dmsans text-[16px] font-bold text-white leading-snug">
            {title}
          </h3>
          <p className="mt-1 font-dmsans text-[13px] leading-relaxed text-white/90">
            {description}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-white/80 hover:text-white transition-opacity p-0.5 focus:outline-none"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    );
  }
);

ServerDowntimeError.displayName = "ServerDowntimeError";
