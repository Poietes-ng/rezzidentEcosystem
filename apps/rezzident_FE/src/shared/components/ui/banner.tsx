import * as React from "react";
import { cn } from "../../utils/cn";

export type BannerVariant = "info" | "success" | "warning" | "error" | "neutral";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  icon?: React.ReactNode;
  title?: string;
}

const bannerVariants: Record<BannerVariant, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200",
  success: "bg-green-50 text-green-900 border-green-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  error: "bg-red-50 text-red-900 border-red-200",
  neutral: "bg-offWhite text-actionDark border-gray-200",
};

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant = "neutral", icon, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3 rounded-xl border p-4 text-sm font-dmsans",
          bannerVariants[variant],
          className
        )}
        {...props}
      >
        {icon && <div className="shrink-0 pt-0.5">{icon}</div>}
        <div className="flex-1 space-y-1">
          {title && <div className="font-semibold">{title}</div>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    );
  }
);
Banner.displayName = "Banner";
