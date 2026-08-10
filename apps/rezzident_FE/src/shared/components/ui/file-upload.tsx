import * as React from "react";
import { cn } from "../../utils/cn";

export interface FileUploadProps {
  label?: string;
  title: string;
  description: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange?: (file: File | null) => void;
  error?: string;
  className?: string;
}

export function FileUpload({
  label,
  title,
  description,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 5,
  value,
  onChange,
  error,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      onChange?.(null);
      return;
    }
    onChange?.(file);
  }

  function handleRemove() {
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="font-dmsans text-body-small text-gray-500">{label}</span>
      )}

      <div
        className={cn(
          "flex items-center gap-4 rounded-[12px] border border-black/10 px-4 py-4",
          error && "border-red-400"
        )}
      >
        {/* Icon */}
        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-gray-100">
          <span className="material-symbols-outlined text-[20px] text-gray-400">
            {value ? "description" : "image"}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          {value ? (
            <>
              <span className="truncate font-dmsans text-body-small font-medium text-actionDark">
                {value.name}
              </span>
              <span className="font-dmsans text-[11px] text-gray-400">
                {(value.size / 1024).toFixed(0)} KB
              </span>
            </>
          ) : (
            <>
              <span className="font-dmsans text-body-small font-medium text-actionDark">
                {title}
              </span>
              <span className="font-dmsans text-[11px] leading-snug text-gray-400">
                {description}
              </span>
            </>
          )}
        </div>

        {/* Action button */}
        {value ? (
          <button
            type="button"
            onClick={handleRemove}
            className="flex shrink-0 items-center gap-1 rounded-[8px] border border-red-200 bg-red-50 px-3 py-1.5 font-dmsans text-[12px] font-medium text-red-600 hover:bg-red-100"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex shrink-0 items-center gap-1 rounded-[8px] border border-black/10 bg-white px-3 py-1.5 font-dmsans text-[12px] font-medium text-actionDark hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-[14px]">upload</span>
            Upload
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <span className="font-dmsans text-[11px] text-red-500">{error}</span>
      )}
    </div>
  );
}
