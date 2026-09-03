/**
 * CampusHub - Core Utility Helpers
 */

/**
 * Combines conditional class names into a clean, space-separated string.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date into a human-readable scholarly format.
 */
export function formatScholarlyDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
