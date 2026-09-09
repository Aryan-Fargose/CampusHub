"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SubjectAttendance,
  AttendanceRecord,
  OverallAttendanceStats,
} from "@/types/attendance";
import {
  loadStoredSubjects,
  loadStoredRecords,
  loadStoredGlobalTarget,
  saveStoredGlobalTarget,
  calculateOverallStats,
  markLecturePresent,
  markLectureAbsent,
  addNewSubject,
  editSubjectDetails,
  deleteSubject,
  deleteAttendanceRecord,
  resetAttendanceSystem,
  ATTENDANCE_CHANGE_EVENT,
} from "@/lib/attendanceStorage";

export function useAttendance() {
  const [subjects, setSubjects] = useState<SubjectAttendance[]>(() =>
    loadStoredSubjects()
  );
  const [records, setRecords] = useState<AttendanceRecord[]>(() =>
    loadStoredRecords()
  );
  const [targetPercentage, setTargetPercentage] = useState<number>(() =>
    loadStoredGlobalTarget()
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const reloadData = useCallback(() => {
    const loadedSubs = loadStoredSubjects();
    const loadedRecs = loadStoredRecords();
    const loadedTarget = loadStoredGlobalTarget();
    setSubjects(loadedSubs);
    setRecords(loadedRecs);
    setTargetPercentage(loadedTarget);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleStorageEvent = () => reloadData();
    window.addEventListener(ATTENDANCE_CHANGE_EVENT, handleStorageEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(ATTENDANCE_CHANGE_EVENT, handleStorageEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [reloadData]);

  const updateGlobalTarget = useCallback((newTarget: number) => {
    saveStoredGlobalTarget(newTarget);
    setTargetPercentage(newTarget);
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
    isLoaded,
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
    refresh: reloadData,
  };
}
