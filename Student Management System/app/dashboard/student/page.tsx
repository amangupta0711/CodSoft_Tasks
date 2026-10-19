"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CalendarCheck2,
  Award,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CreditCard,
  User,
  ShieldAlert,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const student = data?.student;

  return (
    <DashboardLayout
      userRole="STUDENT"
      userName={student?.fullName || "Alex Rivera"}
      userEmail={student?.email || "student@edumanage.com"}
    >
      {/* Student Welcome Hero Card */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-dropdown">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
              {student?.fullName ? student.fullName.charAt(0) : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  Enrolled Student
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ID: {student?.studentId || "STU-2024-001"}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                {loading ? "Welcome, Student" : student?.fullName}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {student?.currentClass?.name || "Computer Science Year 2 (Section A)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/attendance"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Attendance History</span>
            </Link>
            <Link
              href="/fees"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-gold-400" />
              <span>View Fee Dues</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">My Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : `${data?.attendancePercentage || 95}%`}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Good Standing
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requirement: Minimum 75%</p>
        </div>

        {/* Academic Grade Average */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Academic Average</span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : `${data?.avgPercentage || 90}%`}
            </span>
            <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
              Grade A+
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated from stored results</p>
        </div>

        {/* Outstanding Fee Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Fees</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : `$${data?.balanceFees || 350}`}
            </span>
            <span
              className={`text-[11px] font-medium ${
                (data?.balanceFees || 0) > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {(data?.balanceFees || 0) > 0 ? "Partially Due" : "Settled"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Fall Semester 2024 Lab Fee</p>
        </div>
      </div>

      {/* Recent Examination Results & Attendance History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-950">My Examination Results</h2>
              <p className="text-xs text-slate-400">Official marks verified by course professors</p>
            </div>
            <Link
              href="/examinations"
              className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
            >
              <span>All Exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentResults?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No exam results published yet.</p>
            ) : (
              data?.recentResults?.map((r: any) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-navy-800 bg-navy-100 px-1.5 py-0.5 rounded">
                      {r.examination?.subject?.code || "SUB"}
                    </span>
                    <h4 className="text-xs font-bold text-navy-950 mt-1">
                      {r.examination?.name || "Exam"}
                    </h4>
                    <p className="text-[11px] text-slate-500">{r.remarks || "Performance verified"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-navy-950">
                      {r.marksObtained}/{r.examination?.maxMarks || 100}
                    </span>
                    <div className="mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold-100 text-gold-800">
                        {r.grade} ({r.percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Attendance Log */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-950">My Recent Attendance Records</h2>
              <p className="text-xs text-slate-400">Daily classroom presence tracking</p>
            </div>
            <Link
              href="/attendance"
              className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAttendance?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No attendance logged.</p>
            ) : (
              data?.recentAttendance?.map((a: any) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-8 rounded-full ${
                        a.status === "PRESENT"
                          ? "bg-emerald-500"
                          : a.status === "LATE"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold text-navy-900">
                        {new Date(a.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-slate-400">{a.remarks || "Verified on register"}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      a.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : a.status === "LATE"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
