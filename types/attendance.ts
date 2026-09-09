/**
 * CampusHub - Attendance Module Type Definitions & Contracts
 * Follows modern iOS attendance tracker UX and data structures.
 */

export type AttendanceStatus = "safe" | "warning" | "danger";

export interface SubjectAttendance {
  id: string;
  name: string;
  code?: string;
  professor?: string;
  present: number;
  absent: number;
  total: number;
  targetPercentage: number; // e.g. 75
  createdAt: number;
  colorTheme?: "emerald" | "cyan" | "gold" | "crimson" | "indigo";
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  status: "present" | "absent";
  date: string; // e.g. "03 Sep 2026"
  timestamp: number;
  note?: string;
}

export interface OverallAttendanceStats {
  percentage: number;
  present: number;
  absent: number;
  total: number;
  safeBunks: number;
  requiredLectures: number;
  subjectsCount: number;
  subjectsBelowTarget: number;
  targetPercentage: number;
  status: AttendanceStatus;
}

export interface BunkCalculationResult {
  currentPercentage: number;
  targetPercentage: number;
  status: AttendanceStatus;
  safeBunks: number;
  requiredLectures: number;
  statusMessage: string;
  bunkMessage: string;
}
