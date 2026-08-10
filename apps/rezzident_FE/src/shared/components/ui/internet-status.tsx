import * as React from "react";
import { cn } from "../../utils/cn";

export type InternetStatusProps = {
  status: "offline" | "reconnected" | "online";
  onReconnect?: () => void;
  className?: string;
};

export function InternetStatus({ status, onReconnect, className }: InternetStatusProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (status === "offline" || status === "reconnected") {
      setVisible(true);
      if (status === "reconnected") {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [status]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-3 px-4 py-3 text-body-small font-medium text-white transition-transform duration-300",
        status === "offline" ? "bg-red-500" : "bg-green-500",
        visible ? "translate-y-0" : "-translate-y-full",
        className
      )}
    >
      <span className="material-symbols-outlined text-[18px]">
        {status === "offline" ? "wifi_off" : "wifi"}
      </span>
      <span>
        {status === "offline"
          ? "No internet connection"
          : "Connection restored"}
      </span>
      {status === "offline" && onReconnect && (
        <button
          onClick={onReconnect}
          className="ml-2 rounded-full border border-white/30 px-3 py-1 text-caption font-semibold hover:bg-white/10"
        >
          Reconnect
        </button>
      )}
    </div>
  );
}
