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
          "flex h-[40px] w-full bg-transparent px-0 py-2 font-dmsans text-body-base text-actionDark outline-none transition-colors",
          "border-b border-gray-200",
          "placeholder:text-gray-400",
          "focus-visible:border-b-actionYellow",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-b-errorRed text-errorRed focus-visible:border-b-errorRed",
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
