import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "indigo" | "emerald" | "amber" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className,
  ...props
}) => {
  const variantStyles = {
    gold: "bg-amber-950/40 text-amber-300 border-amber-500/30",
    indigo: "bg-indigo-950/40 text-indigo-300 border-indigo-500/30",
    emerald: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30",
    amber: "bg-orange-950/40 text-orange-300 border-orange-500/30",
    neutral: "bg-slate-900/60 text-slate-300 border-slate-700/50",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs font-medium px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
