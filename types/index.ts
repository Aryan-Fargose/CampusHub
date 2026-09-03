/**
 * CampusHub - Core Type Definitions & Data Contracts
 */

export type ThemeId = "midnight" | "crimson" | "emerald" | "azure" | "golden";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  primaryAccent: string;
  glowColor: string;
  surfaceBg: string;
  borderColor: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  fullName: string;
  house: string;
  avatarUrl?: string;
  campusName: string;
  academicYear: string;
  role: "student" | "prefect" | "scholar";
}

export interface AttendanceSummary {
  percentage: number;
  status: "safe" | "warning" | "critical";
  statusLabel: string;
  safeBunksCount: number;
  totalLectures: number;
  attendedLectures: number;
}

export interface CanteenPick {
  id: string;
  itemName: string;
  canteenName: string;
  rating: number;
  tag: string;
  imageUrl?: string;
  price?: string;
}

export interface OwlPostSummary {
  unreadCount: number;
  latestTag: string;
  totalToday: number;
}

export interface CommonRoomPreview {
  featuredGame: string;
  subtitle: string;
  onlinePlayersCount: number;
  gameType: "tictactoe" | "wordle" | "trivia";
}

export interface CampusQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string;
  isExternal?: boolean;
}

export type StatusTag = "planned" | "in_development" | "ready";

export interface FeaturePreview {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: "gold" | "indigo" | "emerald" | "amber";
  status: StatusTag;
}
