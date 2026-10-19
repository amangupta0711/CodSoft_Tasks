"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  CheckCheck,
  Filter,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/Toast";
import { Role } from "@/lib/types";

export default function AttendancePage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<Role>("ADMIN");
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-10-16");
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; remarks: string }>>({});
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"mark" | "history">("mark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch auth role
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.role) {
          setUserRole(data.user.role);
          if (data.user.role === "STUDENT") {
            setViewMode("history");
          }
        }
      })
      .catch(() => {});

    // Fetch classes
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setClasses(data.data);
          setSelectedClassId(data.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // When class or date changes, load attendance and student roster
  useEffect(() => {
    if (!selectedClassId) return;

    setLoading(true);
    const cls = classes.find((c) => c.id === selectedClassId);
    const students = cls?.students || [];
    setEnrolledStudents(students);

    // Fetch existing attendance for this class & date
    fetch(`/api/attendance?classId=${selectedClassId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const map: Record<string, any> = {};
          // Initialize for all enrolled students with existing or default PRESENT
          students.forEach((s: any) => {
            const existing = data.data.find((a: any) => a.studentId === s.id);
            if (existing) {
              map[s.id] = { status: existing.status, remarks: existing.remarks || "" };
            } else {
              map[s.id] = { status: "PRESENT", remarks: "" };
            }
          });
          setAttendanceMap(map);
        }
      })
      .finally(() => setLoading(false));

    // Fetch class history
    fetch(`/api/attendance?classId=${selectedClassId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHistoryRecords(data.data);
        }
      })
      .catch(() => {});
  }, [selectedClassId, selectedDate, classes]);

  const handleStatusChange = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, any> = {};
    enrolledStudents.forEach((s) => {
      updated[s.id] = {
        ...attendanceMap[s.id],
        status: "PRESENT",
      };
    });
    setAttendanceMap(updated);
    toast("All students marked Present", "info");
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId) {
      toast("Please select a class", "error");
      return;
    }

    setSaving(true);
    try {
      const records = Object.entries(attendanceMap).map(([studentId, val]) => ({
        studentId,
        status: val.status,
        remarks: val.remarks || null,
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassId,
          date: selectedDate,
          records,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save attendance");

      toast("Attendance registered successfully!", "success");

      // Refresh history
      fetch(`/api/attendance?classId=${selectedClassId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setHistoryRecords(d.data);
        });
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Calculate stats
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === "PRESENT").length;
  const lateCount = Object.values(attendanceMap).filter((v) => v.status === "LATE").length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === "ABSENT").length;
  const total = enrolledStudents.length || 1;
  const todayRate = Number((((presentCount + lateCount) / total) * 100).toFixed(1));

  return (
    <DashboardLayout userRole={userRole}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Attendance Verification System
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACID Compliant
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record, audit and review official institutional attendance logs.
          </p>
        </div>

        {userRole !== "STUDENT" && (
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("mark")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "mark" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
              }`}
            >
              Mark Register
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "history" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
              }`}
            >
              Attendance History
            </button>
          </div>
        )}
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50 focus:border-navy-900 outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Register Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50 focus:border-navy-900 outline-none"
            />
          </div>
        </div>

        {/* Live Attendance Rate Pill */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Today&apos;s Rate</span>
            <span className="text-base font-extrabold text-navy-900">{todayRate}%</span>
          </div>

          {userRole !== "STUDENT" && viewMode === "mark" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllPresent}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-navy-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5 text-gold-400" />
                <span>{saving ? "Saving..." : "Save Register"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MARK ATTENDANCE VIEW */}
      {viewMode === "mark" && userRole !== "STUDENT" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-navy-950">
              Enrolled Students ({enrolledStudents.length})
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present: {presentCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Late: {lateCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Absent: {absentCount}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {enrolledStudents.map((s) => {
              const currentStatus = attendanceMap[s.id]?.status || "PRESENT";
              const remarks = attendanceMap[s.id]?.remarks || "";

              return (
                <div
                  key={s.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                      {s.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-navy-950 block">{s.fullName}</span>
                      <span className="text-[11px] font-mono text-slate-400">{s.studentId}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Toggles */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, "PRESENT")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === "PRESENT"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-emerald-700"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, "LATE")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === "LATE"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-600 hover:text-amber-700"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, "ABSENT")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === "ABSENT"
                            ? "bg-red-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-red-700"
                        }`}
                      >
                        Absent
                      </button>
                    </div>

                    {/* Remarks Input */}
                    <input
                      type="text"
                      placeholder="Add note (e.g. transit delay)..."
                      value={remarks}
                      onChange={(e) => handleRemarksChange(s.id, e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-navy-900 bg-slate-50 w-44"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ATTENDANCE HISTORY VIEW */}
      {(viewMode === "history" || userRole === "STUDENT") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Class</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No historical attendance records recorded for this selection.
                  </td>
                </tr>
              ) : (
                historyRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-medium text-navy-900">
                      {new Date(rec.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy-950 block">
                        {rec.student?.fullName || "Student"}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {rec.student?.studentId}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{rec.class?.name || "Class"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : rec.status === "LATE"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{rec.remarks || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
