import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export type NavTab = {
  id: string;
  label: string;
  icon: string; // Material Symbol name
  to: string;
};

export const DEFAULT_TABS: NavTab[] = [
  { id: "home", label: "Home", icon: "home", to: "/" },
  { id: "bills", label: "Bills", icon: "payments", to: "/bills" },
  { id: "forum", label: "Forum", icon: "forum", to: "/forum" },
  { id: "vote", label: "Vote", icon: "how_to_vote", to: "/vote" },
  { id: "settings", label: "Settings", icon: "settings", to: "/settings" },
];

export function BottomNavigation({
  className,
  tabs = DEFAULT_TABS,
}: {
  className?: string;
  tabs?: NavTab[];
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div
      className={cn(
        "flex h-[56px] w-full items-center justify-around bg-white px-2",
        className
      )}
    >
      {tabs.map((tab) => {
        // Simple active check. In reality, might need more robust path matching.
        const isActive = currentPath === tab.to || (currentPath.startsWith(tab.to) && tab.to !== "/");

        return (
          <Link
            key={tab.id}
            to={tab.to}
            className="flex flex-1 flex-col items-center justify-center gap-[4px] outline-none"
          >
            <div
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[8px] transition-colors",
                isActive ? "bg-[#FFE022] text-[#1A1A1A]" : "bg-transparent text-[#8A8478]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[24px]",
                  // When active, some icons in Material Symbols look better filled, 
                  // but the spec specifically asked for Outline Style.
                  isActive && "font-variation-settings-'FILL'-1" 
                )}
              >
                {tab.icon}
              </span>
            </div>
            <span
              className={cn(
                "font-dmsans text-[10px] font-medium transition-colors",
                isActive ? "text-[#1A1A1A]" : "text-[#8A8478]"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
