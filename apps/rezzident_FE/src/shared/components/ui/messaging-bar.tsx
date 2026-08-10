import * as React from "react";
import { cn } from "../../utils/cn";

export type MessagingBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  isRecording?: boolean;
  recordingDuration?: string;
  attachments?: { id: string; type: "image" | "video" | "file"; preview?: string; name?: string }[];
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  className?: string;
};

export function MessagingBar({
  value,
  onChange,
  onSend,
  onAttach,
  onVoiceStart,
  onVoiceStop,
  isRecording = false,
  recordingDuration,
  attachments = [],
  onRemoveAttachment,
  placeholder = "Type a message...",
  className,
}: MessagingBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

  const hasContent = value.trim().length > 0 || attachments.length > 0;

  if (isRecording) {
    return (
      <div className={cn(
        "flex items-center gap-3 border-t border-black/5 bg-white px-[16px] py-[12px]",
        className
      )}>
        <div className="flex flex-1 items-center gap-3">
          <div className="h-[8px] w-[8px] animate-pulse rounded-full bg-red-500" />
          <span className="text-body-small font-medium text-red-500">
            {recordingDuration || "0:00"}
          </span>
          {/* Waveform visualization */}
          <div className="flex flex-1 items-center gap-[2px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-[2px] animate-pulse rounded-full bg-red-300"
                style={{
                  height: `${Math.max(4, Math.random() * 20)}px`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
        <button
          onClick={onVoiceStop}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-red-500 text-white"
        >
          <span className="material-symbols-outlined text-[20px]">stop</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("border-t border-black/5 bg-white", className)}>
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-[16px] pt-[12px] hide-scrollbar">
          {attachments.map((att) => (
            <div key={att.id} className="relative shrink-0">
              {att.type === "image" && att.preview ? (
                <img
                  src={att.preview}
                  alt=""
                  className="h-[64px] w-[64px] rounded-[12px] object-cover"
                />
              ) : (
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[12px] bg-gray-100">
                  <span className="material-symbols-outlined text-[24px] text-gray-400">
                    {att.type === "video" ? "videocam" : "description"}
                  </span>
                </div>
              )}
              {onRemoveAttachment && (
                <button
                  onClick={() => onRemoveAttachment(att.id)}
                  className="absolute -right-1 -top-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-actionDark text-white"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 px-[16px] py-[12px]">
        {onAttach && (
          <button
            onClick={onAttach}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[24px]">attach_file</span>
          </button>
        )}

        <div className="flex flex-1 items-end rounded-[20px] border border-black/10 bg-gray-50 px-[16px] py-[8px]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-transparent text-body-small outline-none placeholder:text-gray-400"
          />
        </div>

        {hasContent ? (
          <button
            onClick={onSend}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-actionDark text-white"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        ) : (
          <button
            onClick={onVoiceStart}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
          </button>
        )}
      </div>
    </div>
  );
}
