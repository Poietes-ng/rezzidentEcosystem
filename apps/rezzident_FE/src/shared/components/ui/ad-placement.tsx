import * as React from "react";
import { cn } from "../../utils/cn";

export type AdPlacementProps = {
  variant: "top-banner" | "mid-feed";
  imageUrl?: string;
  altText?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  className?: string;
};

export function AdPlacement({
  variant,
  imageUrl,
  altText = "Advertisement",
  onClick,
  onDismiss,
  className,
}: AdPlacementProps) {
  const isTopBanner = variant === "top-banner";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isTopBanner
          ? "h-[60px] w-full rounded-[12px] bg-gray-100"
          : "aspect-[16/9] w-full rounded-[16px] bg-gray-100",
        className
      )}
    >
      {imageUrl ? (
        <button onClick={onClick} className="h-full w-full">
          <img
            src={imageUrl}
            alt={altText}
            className="h-full w-full object-cover"
          />
        </button>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="material-symbols-outlined text-[20px]">ad_group</span>
            <span className="text-caption font-medium">Ad Space</span>
          </div>
        </div>
      )}

      {/* Ad label */}
      <div className="absolute bottom-1 left-2 rounded-sm bg-black/40 px-1.5 py-0.5">
        <span className="text-[10px] font-medium text-white">Ad</span>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      )}
    </div>
  );
}
