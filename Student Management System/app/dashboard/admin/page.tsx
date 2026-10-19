"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck2,
  DollarSign,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout
      userRole="ADMIN"
      userName="Dr. Robert Vance"
      userEmail="admin@edumanage.com"
    >
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Institutional Dashboard
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-700 border border-gold-500/30">
              Live Overview
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized academic, enrollment, attendance and financial metrics.
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/students?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>Add Student</span>
          </Link>
          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 text-xs font-semibold shadow-sm transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-navy-700" />
            <span>Add Teacher</span>
          </Link>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 text-xs font-semibold shadow-sm transition-all"
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-gold-600" />
            <span>Mark Attendance</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : stats?.totalStudents || 0}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% YoY
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active enrollments 2024-25</p>
        </div>

        {/* Total Faculty Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty Teachers
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : stats?.totalTeachers || 0}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Across 3 Depts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% assigned to classes</p>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : `${stats?.todayAttendancePercentage || 95}%`}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> High
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Institutional presence rate</p>
        </div>

        {/* Fee Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Collections
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-navy-950">
              {loading ? "..." : `$${(stats?.totalFeeCollections || 0).toLocaleString()}`}
            </span>
            <span className="text-[11px] font-medium text-amber-600">
              Dues: ${loading ? "..." : (stats?.outstandingFees || 0).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Paid invoices & receipts</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900">Attendance Velocity & Trends</h2>
              <p className="text-xs text-slate-400">Weekly student presence percentages</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg 95.2%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.attendanceTrend || []}>
                <defs>
                  <linearGradient id="attRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1f33",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Attendance %"
                  stroke="#d4af37"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#attRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Performance Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900">Academic Grading Spread</h2>
              <p className="text-xs text-slate-400">Current semester examination results</p>
            </div>
            <div className="p-1.5 rounded-lg bg-gold-50 text-gold-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.gradeDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1f33",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                  {(stats?.gradeDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#0b1f33"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Students & Recent Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students Added */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-900">Recently Enrolled Students</h2>
              <p className="text-xs text-slate-400">Latest additions to the student roster</p>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentStudents?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent students found.</p>
            ) : (
              stats?.recentStudents?.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                      {s.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-900">{s.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{s.studentId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                      {s.currentClass?.name || "Unassigned"}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Active</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Attendance Activity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-900">Recent Attendance Logs</h2>
              <p className="text-xs text-slate-400">Classroom verification timestamps</p>
            </div>
            <Link
              href="/attendance"
              className="text-xs font-semibold text-navy-700 hover:text-navy-950 flex items-center gap-1"
            >
              <span>Review Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentAttendance?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No attendance logged today.</p>
            ) : (
              stats?.recentAttendance?.map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 rounded-full ${
                        a.status === "PRESENT"
                          ? "bg-emerald-500"
                          : a.status === "LATE"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold text-navy-900">
                        {a.student?.fullName || "Student"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {a.class?.name || "Class"} • {new Date(a.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
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
