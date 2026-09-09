import {
  SubjectAttendance,
  AttendanceRecord,
  OverallAttendanceStats,
  BunkCalculationResult,
  AttendanceStatus,
} from "@/types/attendance";

const STORAGE_KEYS = {
  SUBJECTS: "campushub_attendance_subjects_v2",
  RECORDS: "campushub_attendance_records_v2",
  DEFAULT_TARGET: "campushub_attendance_target_v2",
};

export const DEFAULT_INITIAL_SUBJECTS: SubjectAttendance[] = [
  {
    id: "sub_os",
    name: "Operating Systems",
    code: "CS-401",
    professor: "Prof. Severus Vance",
    present: 23,
    absent: 5,
    total: 28,
    targetPercentage: 75,
    createdAt: Date.now() - 30 * 86400000,
    colorTheme: "cyan",
  },
  {
    id: "sub_cn",
    name: "Computer Networks",
    code: "CS-402",
    professor: "Prof. Minerva Sterling",
    present: 25,
    absent: 4,
    total: 29,
    targetPercentage: 75,
    createdAt: Date.now() - 30 * 86400000,
    colorTheme: "emerald",
  },
  {
    id: "sub_dbms",
    name: "Database Management",
    code: "CS-403",
    professor: "Dr. Alistair Finch",
    present: 21,
    absent: 7,
    total: 28,
    targetPercentage: 75,
    createdAt: Date.now() - 30 * 86400000,
    colorTheme: "gold",
  },
  {
    id: "sub_toc",
    name: "Theory of Computation",
    code: "CS-404",
    professor: "Prof. Garrick Holloway",
    present: 18,
    absent: 6,
    total: 24,
    targetPercentage: 75,
    createdAt: Date.now() - 30 * 86400000,
    colorTheme: "indigo",
  },
  {
    id: "sub_web",
    name: "Web Engineering & Arcana",
    code: "CS-405",
    professor: "Archmage Cassandra Roy",
    present: 30,
    absent: 2,
    total: 32,
    targetPercentage: 75,
    createdAt: Date.now() - 30 * 86400000,
    colorTheme: "emerald",
  },
];

export const DEFAULT_INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: "rec_101",
    subjectId: "sub_os",
    subjectName: "Operating Systems",
    status: "present",
    date: "09 Sep 2026",
    timestamp: Date.now() - 1 * 86400000,
  },
  {
    id: "rec_102",
    subjectId: "sub_cn",
    subjectName: "Computer Networks",
    status: "present",
    date: "09 Sep 2026",
    timestamp: Date.now() - 1 * 86400000 + 3600000,
  },
  {
    id: "rec_103",
    subjectId: "sub_dbms",
    subjectName: "Database Management",
    status: "absent",
    date: "08 Sep 2026",
    timestamp: Date.now() - 2 * 86400000,
  },
  {
    id: "rec_104",
    subjectId: "sub_toc",
    subjectName: "Theory of Computation",
    status: "present",
    date: "07 Sep 2026",
    timestamp: Date.now() - 3 * 86400000,
  },
  {
    id: "rec_105",
    subjectId: "sub_web",
    subjectName: "Web Engineering & Arcana",
    status: "present",
    date: "06 Sep 2026",
    timestamp: Date.now() - 4 * 86400000,
  },
  {
    id: "rec_106",
    subjectId: "sub_os",
    subjectName: "Operating Systems",
    status: "absent",
    date: "04 Sep 2026",
    timestamp: Date.now() - 6 * 86400000,
  },
];

// Helper: Format Date
export function formatDisplayDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Math calculation: Percentage
export function calculatePercentage(present: number, total: number): number {
  if (total <= 0) return 100;
  const pct = (present / total) * 100;
  return Math.round(pct * 10) / 10;
}

// Math calculation: Safe bunks (when present/total >= target)
export function calculateSafeBunks(
  present: number,
  total: number,
  target: number
): number {
  if (total <= 0) return 0;
  const targetFraction = target / 100;
  if (present / total < targetFraction) return 0;
  // Formula: present / (total + x) >= targetFraction
  // present - targetFraction * total >= targetFraction * x
  // x = floor((present - targetFraction * total) / targetFraction)
  const safe = Math.floor((present - targetFraction * total) / targetFraction);
  return Math.max(0, safe);
}

// Math calculation: Required consecutive classes to reach target (when present/total < target)
export function calculateRequiredLectures(
  present: number,
  total: number,
  target: number
): number {
  if (total <= 0) return 0;
  const targetFraction = target / 100;
  if (present / total >= targetFraction) return 0;
  if (targetFraction >= 1) return 999;
  // Formula: (present + y) / (total + y) >= targetFraction
  // y * (1 - targetFraction) >= targetFraction * total - present
  // y = ceil((targetFraction * total - present) / (1 - targetFraction))
  const required = Math.ceil(
    (targetFraction * total - present) / (1 - targetFraction)
  );
  return Math.max(0, required);
}

// Status classifier
export function getAttendanceStatus(
  percentage: number,
  target: number,
  safeBunks: number
): AttendanceStatus {
  if (percentage >= target) {
    if (percentage > target + 2 || safeBunks >= 2) {
      return "safe";
    }
    return "warning";
  }
  if (percentage >= target - 3) {
    return "warning";
  }
  return "danger";
}

// Comprehensive Bunk Analysis
export function getBunkAnalysis(
  present: number,
  total: number,
  target: number
): BunkCalculationResult {
  const currentPercentage = calculatePercentage(present, total);
  const safeBunks = calculateSafeBunks(present, total, target);
  const requiredLectures = calculateRequiredLectures(present, total, target);
  const status = getAttendanceStatus(currentPercentage, target, safeBunks);

  let statusMessage = "";
  let bunkMessage = "";

  if (currentPercentage >= target) {
    statusMessage = "You are comfortably above your target threshold.";
    if (safeBunks === 0) {
      bunkMessage =
        "Do not miss the next lecture or you will drop below your target.";
    } else if (safeBunks === 1) {
      bunkMessage = "You can safely bunk 1 lecture without dropping below target.";
    } else {
      bunkMessage = `You can safely miss up to ${safeBunks} lectures while staying at or above ${target}%.`;
    }
  } else {
    statusMessage = `You are currently ${Math.round((target - currentPercentage) * 10) / 10}% below your ${target}% target.`;
    bunkMessage = `You must attend the next ${requiredLectures} consecutive lecture${requiredLectures > 1 ? "s" : ""} to reach ${target}%.`;
  }

  return {
    currentPercentage,
    targetPercentage: target,
    status,
    safeBunks,
    requiredLectures,
    statusMessage,
    bunkMessage,
  };
}

// Overall Aggregation
export function calculateOverallStats(
  subjects: SubjectAttendance[],
  defaultTarget: number = 75
): OverallAttendanceStats {
  if (!subjects || subjects.length === 0) {
    return {
      percentage: 100,
      present: 0,
      absent: 0,
      total: 0,
      safeBunks: 0,
      requiredLectures: 0,
      subjectsCount: 0,
      subjectsBelowTarget: 0,
      targetPercentage: defaultTarget,
      status: "safe",
    };
  }

  let totalPresent = 0;
  let totalAbsent = 0;
  let totalClasses = 0;
  let subjectsBelow = 0;

  subjects.forEach((sub) => {
    totalPresent += sub.present;
    totalAbsent += sub.absent;
    totalClasses += sub.total;
    const subPct = calculatePercentage(sub.present, sub.total);
    if (subPct < sub.targetPercentage) {
      subjectsBelow++;
    }
  });

  const overallPct = calculatePercentage(totalPresent, totalClasses);
  const overallSafe = calculateSafeBunks(totalPresent, totalClasses, defaultTarget);
  const overallReq = calculateRequiredLectures(
    totalPresent,
    totalClasses,
    defaultTarget
  );
  const status = getAttendanceStatus(overallPct, defaultTarget, overallSafe);

  return {
    percentage: overallPct,
    present: totalPresent,
    absent: totalAbsent,
    total: totalClasses,
    safeBunks: overallSafe,
    requiredLectures: overallReq,
    subjectsCount: subjects.length,
    subjectsBelowTarget: subjectsBelow,
    targetPercentage: defaultTarget,
    status,
  };
}

// =========================================================================
// Storage Manager (Local Storage with fallbacks & Custom Events)
// =========================================================================

export const ATTENDANCE_CHANGE_EVENT = "campushub:attendance_updated";

function notifyChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ATTENDANCE_CHANGE_EVENT));
  }
}

export function loadStoredSubjects(): SubjectAttendance[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_SUBJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.SUBJECTS,
        JSON.stringify(DEFAULT_INITIAL_SUBJECTS)
      );
      return DEFAULT_INITIAL_SUBJECTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_INITIAL_SUBJECTS;
  } catch {
    return DEFAULT_INITIAL_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: SubjectAttendance[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    notifyChange();
  } catch (err) {
    console.error("Failed to save subjects to localStorage", err);
  }
}

export function loadStoredRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.RECORDS,
        JSON.stringify(DEFAULT_INITIAL_RECORDS)
      );
      return DEFAULT_INITIAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_RECORDS;
  } catch {
    return DEFAULT_INITIAL_RECORDS;
  }
}

export function saveStoredRecords(records: AttendanceRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    notifyChange();
  } catch (err) {
    console.error("Failed to save records to localStorage", err);
  }
}

export function loadStoredGlobalTarget(): number {
  if (typeof window === "undefined") return 75;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEFAULT_TARGET);
    if (!raw) return 75;
    const num = parseInt(raw, 10);
    return isNaN(num) ? 75 : num;
  } catch {
    return 75;
  }
}

export function saveStoredGlobalTarget(target: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_TARGET, target.toString());
    notifyChange();
  } catch (err) {
    console.error("Failed to save global target", err);
  }
}

// Action: Quick Mark Present (+1)
export function markLecturePresent(
  subjectId: string,
  dateStr: string = formatDisplayDate()
): void {
  const subjects = loadStoredSubjects();
  const records = loadStoredRecords();

  const idx = subjects.findIndex((s) => s.id === subjectId);
  if (idx === -1) return;

  const targetSubject = subjects[idx];
  const updatedSubjects = [...subjects];
  updatedSubjects[idx] = {
    ...targetSubject,
    present: targetSubject.present + 1,
    total: targetSubject.total + 1,
  };

  const newRecord: AttendanceRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    subjectId: targetSubject.id,
    subjectName: targetSubject.name,
    status: "present",
    date: dateStr,
    timestamp: Date.now(),
  };

  saveStoredSubjects(updatedSubjects);
  saveStoredRecords([newRecord, ...records]);
}

// Action: Quick Mark Absent (+1)
export function markLectureAbsent(
  subjectId: string,
  dateStr: string = formatDisplayDate()
): void {
  const subjects = loadStoredSubjects();
  const records = loadStoredRecords();

  const idx = subjects.findIndex((s) => s.id === subjectId);
  if (idx === -1) return;

  const targetSubject = subjects[idx];
  const updatedSubjects = [...subjects];
  updatedSubjects[idx] = {
    ...targetSubject,
    absent: targetSubject.absent + 1,
    total: targetSubject.total + 1,
  };

  const newRecord: AttendanceRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    subjectId: targetSubject.id,
    subjectName: targetSubject.name,
    status: "absent",
    date: dateStr,
    timestamp: Date.now(),
  };

  saveStoredSubjects(updatedSubjects);
  saveStoredRecords([newRecord, ...records]);
}

// Action: Add new Subject
export function addNewSubject(data: {
  name: string;
  code?: string;
  professor?: string;
  targetPercentage: number;
  initialPresent: number;
  initialAbsent: number;
  colorTheme?: "emerald" | "cyan" | "gold" | "crimson" | "indigo";
}): SubjectAttendance {
  const subjects = loadStoredSubjects();
  const newSubject: SubjectAttendance = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    code: data.code?.trim() || undefined,
    professor: data.professor?.trim() || undefined,
    present: Math.max(0, data.initialPresent || 0),
    absent: Math.max(0, data.initialAbsent || 0),
    total:
      Math.max(0, data.initialPresent || 0) +
      Math.max(0, data.initialAbsent || 0),
    targetPercentage: data.targetPercentage || 75,
    createdAt: Date.now(),
    colorTheme: data.colorTheme || "cyan",
  };

  saveStoredSubjects([...subjects, newSubject]);
  return newSubject;
}

// Action: Edit Subject Details & Counts directly
export function editSubjectDetails(
  subjectId: string,
  data: {
    name: string;
    code?: string;
    professor?: string;
    present: number;
    absent: number;
    targetPercentage: number;
  }
): void {
  const subjects = loadStoredSubjects();
  const idx = subjects.findIndex((s) => s.id === subjectId);
  if (idx === -1) return;

  const updatedSubjects = [...subjects];
  updatedSubjects[idx] = {
    ...updatedSubjects[idx],
    name: data.name.trim(),
    code: data.code?.trim() || undefined,
    professor: data.professor?.trim() || undefined,
    present: Math.max(0, data.present),
    absent: Math.max(0, data.absent),
    total: Math.max(0, data.present) + Math.max(0, data.absent),
    targetPercentage: data.targetPercentage,
  };

  saveStoredSubjects(updatedSubjects);
}

// Action: Delete Subject and its records
export function deleteSubject(subjectId: string): void {
  const subjects = loadStoredSubjects();
  const records = loadStoredRecords();

  saveStoredSubjects(subjects.filter((s) => s.id !== subjectId));
  saveStoredRecords(records.filter((r) => r.subjectId !== subjectId));
}

// Action: Delete a single history record and re-adjust subject counts
export function deleteAttendanceRecord(recordId: string): void {
  const records = loadStoredRecords();
  const targetRecord = records.find((r) => r.id === recordId);
  if (!targetRecord) return;

  const subjects = loadStoredSubjects();
  const subIdx = subjects.findIndex((s) => s.id === targetRecord.subjectId);

  if (subIdx !== -1) {
    const sub = subjects[subIdx];
    const updatedSubjects = [...subjects];
    if (targetRecord.status === "present") {
      const newPresent = Math.max(0, sub.present - 1);
      const newTotal = Math.max(0, sub.total - 1);
      updatedSubjects[subIdx] = {
        ...sub,
        present: newPresent,
        total: newTotal,
      };
    } else {
      const newAbsent = Math.max(0, sub.absent - 1);
      const newTotal = Math.max(0, sub.total - 1);
      updatedSubjects[subIdx] = {
        ...sub,
        absent: newAbsent,
        total: newTotal,
      };
    }
    saveStoredSubjects(updatedSubjects);
  }

  saveStoredRecords(records.filter((r) => r.id !== recordId));
}

// Action: Reset everything to initial demo data
export function resetAttendanceSystem(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEYS.SUBJECTS,
    JSON.stringify(DEFAULT_INITIAL_SUBJECTS)
  );
  localStorage.setItem(
    STORAGE_KEYS.RECORDS,
    JSON.stringify(DEFAULT_INITIAL_RECORDS)
  );
  localStorage.setItem(STORAGE_KEYS.DEFAULT_TARGET, "75");
  notifyChange();
}
