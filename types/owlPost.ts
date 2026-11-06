/**
 * CampusHub — Owl Post Domain Types & Data Contracts
 * Strict type definitions for anonymous confessions, reactions, reporting, and moderation.
 */

export type OwlPostAlias =
  | "Anonymous"
  | "The Silent Owl"
  | "The Wandering Wizard"
  | "The Midnight Messenger"
  | "The Unknown Witch"
  | "The Curious Raven";

export const OWL_POST_ALIASES: OwlPostAlias[] = [
  "Anonymous",
  "The Silent Owl",
  "The Wandering Wizard",
  "The Midnight Messenger",
  "The Unknown Witch",
  "The Curious Raven",
];

export type OwlPostStatus = "pending" | "approved" | "rejected";

export type OwlReactionType = "heart" | "owl" | "sparkle" | "laugh";

export interface OwlReactionCounts {
  heart: number;
  owl: number;
  sparkle: number;
  laugh: number;
}

export type UserReactionsMap = Partial<Record<OwlReactionType, boolean>>;

/**
 * Public Owl Post representation.
 * STRICT PRIVACY REQUIREMENT:
 * This interface NEVER contains author user_id, email, student ID, IP address, or private profile data.
 */
export interface PublicOwlPost {
  id: string;
  content: string;
  alias: OwlPostAlias | string;
  status: OwlPostStatus;
  createdAt: string; // ISO 8601 string
  reactions: OwlReactionCounts;
  userReactions?: UserReactionsMap;
  isOwn?: boolean; // Privately calculated for the authenticated viewer only
}

export type OwlPostTab = "latest" | "popular" | "my-letters" | "moderation";

export interface PendingOwlPost {
  id: string;
  content: string;
  alias: OwlPostAlias | string;
  status: OwlPostStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OwlPostReportRecord {
  id: string;
  postId: string;
  reason: string;
  status: string;
  createdAt: string;
  postContent?: string;
  postAlias?: string;
}

export type OwlReportReason =
  | "Harassment or bullying"
  | "Personal information exposure"
  | "Hate or abusive content"
  | "Spam"
  | "Threats or unsafe content"
  | "Other";

export const OWL_REPORT_REASONS: OwlReportReason[] = [
  "Harassment or bullying",
  "Personal information exposure",
  "Hate or abusive content",
  "Spam",
  "Threats or unsafe content",
  "Other",
];

export interface CreateOwlPostInput {
  content: string;
  alias?: OwlPostAlias | string;
}

export interface ReportOwlPostInput {
  postId: string;
  reason: OwlReportReason;
}

