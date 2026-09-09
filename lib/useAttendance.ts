"use client";

import { useSyncExternalStore, useCallback } from "react";
import { OverallAttendanceStats } from "@/types/attendance";
import {
  subscribeToAttendance,
  getSubjectsSnapshot,
  getServerSubjectsSnapshot,
  getRecordsSnapshot,
  getServerRecordsSnapshot,
  getTargetSnapshot,
  getServerTargetSnapshot,
  saveStoredGlobalTarget,
  calculateOverallStats,
  markLecturePresent,
  markLectureAbsent,
  addNewSubject,
  editSubjectDetails,
  deleteSubject,
  deleteAttendanceRecord,
  resetAttendanceSystem,
} from "@/lib/attendanceStorage";

export function useAttendance() {
  const subjects = useSyncExternalStore(
    subscribeToAttendance,
    getSubjectsSnapshot,
    getServerSubjectsSnapshot
  );

  const records = useSyncExternalStore(
    subscribeToAttendance,
    getRecordsSnapshot,
    getServerRecordsSnapshot
  );

  const targetPercentage = useSyncExternalStore(
    subscribeToAttendance,
    getTargetSnapshot,
    getServerTargetSnapshot
  );

  const updateGlobalTarget = useCallback((newTarget: number) => {
    saveStoredGlobalTarget(newTarget);
  }, []);

  const markPresent = useCallback((subjectId: string, dateStr?: string) => {
    markLecturePresent(subjectId, dateStr);
  }, []);

  const markAbsent = useCallback((subjectId: string, dateStr?: string) => {
    markLectureAbsent(subjectId, dateStr);
  }, []);

  const addSubject = useCallback(
    (data: {
      name: string;
      code?: string;
      professor?: string;
      targetPercentage: number;
      initialPresent: number;
      initialAbsent: number;
      colorTheme?: "emerald" | "cyan" | "gold" | "crimson" | "indigo";
    }) => {
      return addNewSubject(data);
    },
    []
  );

  const editSubject = useCallback(
    (
      subjectId: string,
      data: {
        name: string;
        code?: string;
        professor?: string;
        present: number;
        absent: number;
        targetPercentage: number;
      }
    ) => {
      editSubjectDetails(subjectId, data);
    },
    []
  );

  const removeSubject = useCallback((subjectId: string) => {
    deleteSubject(subjectId);
  }, []);

  const removeRecord = useCallback((recordId: string) => {
    deleteAttendanceRecord(recordId);
  }, []);

  const resetAll = useCallback(() => {
    resetAttendanceSystem();
  }, []);

  const overallStats: OverallAttendanceStats = calculateOverallStats(
    subjects,
    targetPercentage
  );

  return {
    isLoaded: true,
    subjects,
    records,
    targetPercentage,
    overallStats,
    setTargetPercentage: updateGlobalTarget,
    markPresent,
    markAbsent,
    addSubject,
    editSubject,
    removeSubject,
    removeRecord,
    resetAll,
    refresh: () => {},
  };
}
