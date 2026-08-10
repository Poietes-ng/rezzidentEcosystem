import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[40px] w-full bg-transparent px-0 py-2 font-dmsans text-body-base text-[#1A1A1A] outline-none transition-colors",
          "border-b border-[#E5E5E5]",
          "placeholder:text-gray-400",
          "focus-visible:border-b-[#FFE022]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-b-red-500 text-red-500 focus-visible:border-b-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
