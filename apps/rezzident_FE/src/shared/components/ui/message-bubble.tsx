import * as React from "react";
import { cn } from "../../utils/cn";

export type MessageBubbleProps = {
  content: string;
  timestamp: string;
  variant: "sender" | "receiver";
  isDeleted?: boolean;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  readStatus?: "sent" | "delivered" | "read";
  className?: string;
};

export function MessageBubble({
  content,
  timestamp,
  variant,
  isDeleted = false,
  isVoiceNote = false,
  voiceDuration,
  isPlaying = false,
  onPlayPause,
  readStatus,
  className,
}: MessageBubbleProps) {
  const isSender = variant === "sender";

  if (isDeleted) {
    return (
      <div
        className={cn(
          "flex max-w-[75%] items-center gap-2 rounded-[16px] px-[16px] py-[10px]",
          isSender ? "ml-auto bg-deletedBubble" : "mr-auto bg-deletedBubble",
          className
        )}
      >
        <span className="material-symbols-outlined text-[18px] text-gray-400">block</span>
        <span className="text-body-small italic text-gray-400">
          This message was deleted
        </span>
      </div>
    );
  }

  if (isVoiceNote) {
    return (
      <div
        className={cn(
          "flex max-w-[75%] items-center gap-3 px-[16px] py-[10px]",
          isSender
            ? "ml-auto rounded-tl-[16px] rounded-tr-[4px] rounded-bl-[16px] rounded-br-[16px] bg-actionDark text-white"
            : "mr-auto rounded-tl-[4px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] bg-receiverBubble text-actionDark",
          className
        )}
      >
        <button
          onClick={onPlayPause}
          className={cn(
            "flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full",
            isSender ? "bg-white/20" : "bg-actionDark/10"
          )}
        >
          <span className={cn(
            "material-symbols-outlined text-[18px]",
            isSender ? "text-white" : "text-actionDark"
          )}>
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* Waveform bars */}
        <div className="flex flex-1 items-center gap-[2px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-[3px] rounded-full",
                isSender ? "bg-white/50" : "bg-actionDark/30"
              )}
              style={{ height: `${Math.max(4, Math.random() * 16)}px` }}
            />
          ))}
        </div>

        <span className={cn(
          "text-caption shrink-0",
          isSender ? "text-white/60" : "text-gray-400"
        )}>
          {voiceDuration || "0:00"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex max-w-[75%] flex-col px-[16px] py-[10px]",
        isSender
          ? "ml-auto rounded-tl-[16px] rounded-tr-[4px] rounded-bl-[16px] rounded-br-[16px] bg-actionDark text-white"
          : "mr-auto rounded-tl-[4px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] bg-receiverBubble text-actionDark",
        className
      )}
    >
      <p className="text-body-small">{content}</p>
      <div className={cn(
        "mt-1 flex items-center justify-end gap-1",
        isSender ? "text-white/50" : "text-gray-400"
      )}>
        <span className="text-[11px]">{timestamp}</span>
        {isSender && readStatus && (
          <span className="material-symbols-outlined text-[14px]">
            {readStatus === "read" ? "done_all" : readStatus === "delivered" ? "done_all" : "check"}
          </span>
        )}
      </div>
    </div>
  );
}
