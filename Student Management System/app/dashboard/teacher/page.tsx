"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck2,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function TeacherDashboardPage() {
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

  const teacher = data?.teacher;

  return (
    <DashboardLayout
      userRole="TEACHER"
      userName={teacher?.fullName || "Prof. Marcus Thorne"}
      userEmail={teacher?.email || "teacher@edumanage.com"}
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-dropdown">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 inline-block mb-3">
            Faculty Teaching Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {loading ? "Professor" : teacher?.fullName || "Prof. Marcus Thorne"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {teacher?.department || "Computer Science"} Department • {teacher?.qualification || "Ph.D."}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/attendance"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Mark Today&apos;s Attendance</span>
            </Link>
            <Link
              href="/examinations"
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold transition-all border border-navy-700/80 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-gold-400" />
              <span>Enter Examination Marks</span>
            </Link>
          </div>
        </div>

        {/* Decorative background icons */}
        <BookOpen className="w-64 h-64 text-navy-800/40 absolute -right-10 -bottom-10 pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Classes</span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : data?.assignedClassesCount || 1}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Computer Science Year 2</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Enrolled Students Taught</span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : data?.totalStudentsTaught || 4}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Under direct mentorship</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Subjects</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : data?.assignedSubjectsCount || 2}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">CS-201 & CS-202</p>
        </div>
      </div>

      {/* Assigned Subjects & Quick Links */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <h2 className="text-sm font-bold text-navy-950 mb-1">My Classroom Subjects & Schedules</h2>
        <p className="text-xs text-slate-500 mb-4">Official semester curriculum assigned by administration</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-gold-400 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-100 px-2 py-0.5 rounded">
                CS-201
              </span>
              <span className="text-[11px] font-semibold text-slate-500">4 Credits</span>
            </div>
            <h4 className="text-sm font-bold text-navy-900">Data Structures & Algorithms</h4>
            <p className="text-xs text-slate-500 mt-1">
              Class: Computer Science Year 2 (Section A) • Room 401
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/attendance"
                className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
              >
                <span>Take Attendance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/examinations"
                className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1"
              >
                <span>Input Marks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-gold-400 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-100 px-2 py-0.5 rounded">
                CS-202
              </span>
              <span className="text-[11px] font-semibold text-slate-500">4 Credits</span>
            </div>
            <h4 className="text-sm font-bold text-navy-900">Database Systems & Design</h4>
            <p className="text-xs text-slate-500 mt-1">
              Class: Computer Science Year 2 (Section A) • Lab 302
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <Link
                href="/attendance"
                className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
              >
                <span>Take Attendance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/examinations"
                className="text-xs font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1"
              >
                <span>Input Marks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
