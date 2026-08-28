import React from "react";
import { cn } from "../../utils/cn";

export type AppFrameProps = {
  children: React.ReactNode;
  className?: string;
  withTopSafeArea?: boolean;
  withBottomSafeArea?: boolean;
};

export function AppFrame({
  children,
  className,
  withTopSafeArea = true,
  withBottomSafeArea = true,
}: AppFrameProps) {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <div
        className={cn(
          "relative flex h-full w-full max-w-[768px] flex-col overflow-hidden bg-white",
          withTopSafeArea && "pt-[54px]",
          withBottomSafeArea && "pb-[21px]",
          className
        )}
      >
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden px-0 hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
