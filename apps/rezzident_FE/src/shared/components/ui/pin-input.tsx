import React, { useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: "dot" | "dash" | "number";
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function PinInput({
  length = 4,
  value = "",
  onChange,
  className,
  variant = "dot",
  error = false,
  disabled = false,
  autoFocus = false,
}: PinInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;
    const inputValue = e.target.value;
    // Extract only digits/alphanumerics
    const cleanValue = inputValue.replace(/\D/g, "");
    if (!cleanValue) {
      const newValue = value.split("");
      newValue[index] = "";
      onChange?.(newValue.join(""));
      return;
    }

    const char = cleanValue.slice(-1);
    const newValue = value.split("");
    while (newValue.length < length) newValue.push("");
    newValue[index] = char;
    const finalValue = newValue.slice(0, length).join("");

    onChange?.(finalValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pastedData) {
      onChange?.(pastedData);
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValue = value.split("");
        newValue[index] = "";
        onChange?.(newValue.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      {Array.from({ length }).map((_, index) => {
        const char = value[index];
        const isFocused = focusedIndex === index;
        const isFilled = Boolean(char);

        return (
          <div
            key={index}
            className="relative flex h-[48px] w-[40px] items-center justify-center"
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus={autoFocus && index === 0}
              disabled={disabled}
              maxLength={2}
              value={char || ""}
              onChange={(e) => handleChange(e, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              className="absolute inset-0 h-full w-full bg-transparent text-center text-transparent outline-none caret-transparent disabled:cursor-not-allowed"
              aria-label={`Digit ${index + 1}`}
            />

            {/* Display representation */}
            <div className="pointer-events-none flex h-full w-full items-center justify-center">
              {isFilled ? (
                variant === "dot" ? (
                  <div
                    className={cn(
                      "size-[8px] rounded-full",
                      error ? "bg-[#D94848]" : "bg-[#1A1A1A]"
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "font-dmsans text-[22px] font-bold",
                      error ? "text-[#D94848]" : "text-[#1A1A1A]"
                    )}
                  >
                    {char}
                  </span>
                )
              ) : (
                <span
                  className={cn(
                    "text-[20px] font-normal leading-none select-none",
                    error ? "text-[#D94848]" : "text-[#B0ABA0]"
                  )}
                >
                  —
                </span>
              )}
            </div>

            {/* Bottom underline */}
            <div
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full transition-colors",
                error
                  ? "bg-[#D94848]"
                  : isFocused
                  ? "bg-[#FFE022] h-[2px]"
                  : "bg-[#E5E5E5]"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
