import * as React from "react";
import { cn } from "../../utils/cn";

export type AlertCardVariant = "success" | "error" | "warning" | "info";

export type AlertCardProps = {
  variant: AlertCardVariant;
  title: string;
  description?: string;
  icon?: string;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const variantStyles: Record<AlertCardVariant, { bg: string; border: string; iconColor: string; icon: string }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-600",
    icon: "check_circle",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-600",
    icon: "error",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    icon: "warning",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    icon: "info",
  },
};

export function AlertCard({
  variant,
  title,
  description,
  icon,
  onDismiss,
  action,
  className,
}: AlertCardProps) {
  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[16px] border p-[16px]",
        style.bg,
        style.border,
        className
      )}
    >
      <span className={cn("material-symbols-outlined mt-0.5 text-[20px]", style.iconColor)}>
        {icon || style.icon}
      </span>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-body-small font-semibold text-actionDark">{title}</p>
        {description && (
          <p className="text-caption text-gray-500">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-1 self-start text-caption font-semibold text-actionDark underline underline-offset-2"
          >
            {action.label}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

/* ---------- Modal Alert Overlay ---------- */

export type ModalAlertProps = {
  open: boolean;
  onClose: () => void;
  icon?: string;
  iconColor?: string;
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
};

export function ModalAlert({
  open,
  onClose,
  icon,
  iconColor = "text-actionYellow",
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: ModalAlertProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-[340px] rounded-[24px] bg-white p-[24px] shadow-alert-modal">
        {/* Close */}
        <div className="mb-4 flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Icon */}
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gray-100">
              <span className={cn("material-symbols-outlined text-[28px]", iconColor)}>
                {icon}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-heading-3 font-semibold text-actionDark">{title}</h3>
          {description && (
            <p className="text-body-small text-gray-500">{description}</p>
          )}
          {children}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-actionDark text-body-small font-semibold text-white hover:bg-actionDarkHover"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-black/10 bg-white text-body-small font-medium text-actionDark hover:bg-gray-50"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
