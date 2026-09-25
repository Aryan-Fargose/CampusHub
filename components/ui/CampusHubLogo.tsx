import React from "react";
import Image from "next/image";

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CampusHubLogoProps {
  size?: LogoSize | number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  withGlow?: boolean;
  alt?: string;
}

const SIZE_MAP: Record<LogoSize, number> = {
  xs: 28,
  sm: 36,
  md: 52,
  lg: 72,
  xl: 96,
};

export const CampusHubLogo: React.FC<CampusHubLogoProps> = ({
  size = "md",
  className = "",
  imgClassName = "",
  priority = true,
  withGlow = true,
  alt = "CampusHub Logo",
}) => {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 52;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-[22%] select-none ${
        withGlow ? "shadow-[0_0_16px_rgba(231,197,109,0.35)]" : ""
      } ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      <Image
        src="/campushub-logo.png"
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        priority={priority}
        className={`w-full h-full object-contain rounded-[22%] drop-shadow-sm transition-transform duration-200 ${imgClassName}`}
      />
    </div>
  );
};
