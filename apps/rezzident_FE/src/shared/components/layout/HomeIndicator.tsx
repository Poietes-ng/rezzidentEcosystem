import React from "react";
import { cn } from "../../utils/cn";

export type HomeIndicatorProps = {
  platform?: "ios" | "android";
  className?: string;
  theme?: "light" | "dark";
};

export function HomeIndicator({
  platform = "ios",
  className,
  theme = "light",
}: HomeIndicatorProps) {
  const isDark = theme === "dark";
  
  if (platform === "android") {
    return (
      <div
        className={cn(
          "flex h-[20px] w-full items-end justify-center pb-[8px]",
          className
        )}
      >
        <div
          className={cn(
            "h-[4px] w-[72px] rounded-[2px]",
            isDark ? "bg-white" : "bg-actionDark"
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[34px] w-full items-end justify-center pb-[8px]",
        className
      )}
    >
      <div
        className={cn(
          "h-[5px] w-[134px] rounded-[3px]",
          isDark ? "bg-white" : "bg-actionDark"
        )}
      />
    </div>
  );
}
