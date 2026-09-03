import { ThemeConfig, ThemeId } from "@/types";

/**
 * CampusHub - Academy Theme Registry
 * Scalable theme architecture for Midnight Castle and future Common Room Chambers.
 */
export const ACADEMY_THEMES: Record<ThemeId, ThemeConfig> = {
  midnight: {
    id: "midnight",
    name: "Midnight Castle",
    subtitle: "The Ancient Grand Citadel",
    primaryAccent: "#c69b3f", // Arcane Gold
    glowColor: "rgba(198, 155, 63, 0.4)",
    surfaceBg: "#0b1019",
    borderColor: "rgba(198, 155, 63, 0.2)",
    icon: "🏰",
  },
  crimson: {
    id: "crimson",
    name: "Crimson Chamber",
    subtitle: "Hearth of Bravery & Fire",
    primaryAccent: "#e11d48", // Ruby Flame
    glowColor: "rgba(225, 29, 72, 0.4)",
    surfaceBg: "#1a0b0e",
    borderColor: "rgba(225, 29, 72, 0.25)",
    icon: "🦁",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Chamber",
    subtitle: "Sanctum of Ambition & Alchemy",
    primaryAccent: "#10b981", // Mystic Emerald
    glowColor: "rgba(16, 185, 129, 0.4)",
    surfaceBg: "#07140e",
    borderColor: "rgba(16, 185, 129, 0.25)",
    icon: "🐍",
  },
  azure: {
    id: "azure",
    name: "Azure Chamber",
    subtitle: "Observatory of Wit & Starlight",
    primaryAccent: "#38bdf8", // Celestial Sapphire
    glowColor: "rgba(56, 189, 248, 0.4)",
    surfaceBg: "#071220",
    borderColor: "rgba(56, 189, 248, 0.25)",
    icon: "🦅",
  },
  golden: {
    id: "golden",
    name: "Golden Chamber",
    subtitle: "Garden of Loyalty & Patience",
    primaryAccent: "#f59e0b", // Harvest Amber
    glowColor: "rgba(245, 158, 11, 0.4)",
    surfaceBg: "#171206",
    borderColor: "rgba(245, 158, 11, 0.25)",
    icon: "🦡",
  },
};

export const DEFAULT_THEME: ThemeConfig = ACADEMY_THEMES.midnight;

export const chamberThemes: ThemeConfig[] = Object.values(ACADEMY_THEMES);
