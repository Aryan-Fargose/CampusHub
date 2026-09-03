import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "parchment" | "accent";
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const variantStyles = {
    default:
      "bg-slate-900/90 border-slate-800 text-slate-200 shadow-sm",
    parchment:
      "bg-[#131924] border-amber-900/30 text-amber-100/90 shadow-md shadow-black/20",
    accent:
      "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/20 text-slate-100",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-5 sm:p-6 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
