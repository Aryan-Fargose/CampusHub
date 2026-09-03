import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-900/20 active:translate-y-px",
      secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:translate-y-px",
      outline:
        "border border-amber-500/40 hover:bg-amber-500/10 text-amber-300 active:translate-y-px",
      ghost:
        "text-slate-300 hover:text-white hover:bg-slate-800/60 active:translate-y-px",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 min-h-[36px]",
      md: "text-sm px-4 py-2 min-h-[44px]",
      lg: "text-base px-6 py-3 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
