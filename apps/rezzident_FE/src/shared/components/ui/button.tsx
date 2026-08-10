import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

export type ButtonVariant = 
  | "default" 
  | "secondary" 
  | "ghost" 
  | "accent" 
  | "outline-gold";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
}

const buttonVariants: Record<ButtonVariant, string> = {
  default: "bg-actionDark text-white hover:bg-actionDarkHover disabled:bg-gray-200 disabled:text-white",
  secondary: "bg-white border border-gray-200 text-actionDark hover:bg-gray-50 disabled:opacity-50",
  ghost: "bg-transparent text-actionDark hover:underline disabled:opacity-50",
  accent: "bg-actionYellow text-actionDark hover:bg-actionYellowHover disabled:bg-gray-200 disabled:text-actionDark/50",
  "outline-gold": "bg-white border border-actionYellow text-actionYellow hover:bg-[#FFFDE7] disabled:opacity-50",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none",
          "font-dmsans font-medium text-body-base",
          variant !== "ghost" && "h-[56px] min-h-[56px] rounded-[12px] px-[24px] py-[16px]",
          buttonVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
