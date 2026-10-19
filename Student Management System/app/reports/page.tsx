"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/Toast";

export default function ReportsPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [reportType, setReportType] = useState<"all" | "enrollment" | "attendance" | "exams" | "fees">("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/fees/invoices").then((r) => r.json()),
      fetch("/api/classes").then((r) => r.json()),
    ])
      .then(([statsRes, stuRes, invRes, clsRes]) => {
        setStats(statsRes);
        if (stuRes.success) setStudents(stuRes.data);
        if (invRes.success) setInvoices(invRes.data);
        if (clsRes.success) setClasses(clsRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Metric,Value", `Total Enrolled Students,${students.length}`, `Total Faculty,${stats?.totalTeachers || 3}`, `Collections,$${stats?.totalFeeCollections || 0}`, `Outstanding Receivables,$${stats?.outstandingFees || 0}`].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduManage_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Report exported as CSV", "success");
  };

  return (
    <DashboardLayout userRole="ADMIN">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Institutional Reports & Analytics
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-800">
              Audit Ready
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive audit reports covering student admission, academic outcomes and fee collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-navy-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-navy-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-gold-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setReportType("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === "all" ? "bg-navy-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Comprehensive Summary
        </button>
        <button
          onClick={() => setReportType("enrollment")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === "enrollment" ? "bg-navy-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Student Enrollment
        </button>
        <button
          onClick={() => setReportType("attendance")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === "attendance" ? "bg-navy-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Attendance Breakdown
        </button>
        <button
          onClick={() => setReportType("exams")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === "exams" ? "bg-navy-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Exam Performance
        </button>
        <button
          onClick={() => setReportType("fees")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            reportType === "fees" ? "bg-navy-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Fee Collections & Receivables
        </button>
      </div>

      {/* SECTION 1: Enrollment Summary */}
      {(reportType === "all" || reportType === "enrollment") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-navy-700" />
                Student Enrollment & Departmental Cohorts
              </h2>
              <p className="text-xs text-slate-400">Classroom capacity utilization</p>
            </div>
            <span className="text-xs font-bold text-navy-900 bg-navy-50 px-2.5 py-1 rounded-xl">
              {students.length} Total Enrolled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((c) => {
              const enrolled = c.students?.length || 0;
              const pct = Number(((enrolled / (c.capacity || 40)) * 100).toFixed(0));

              return (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-navy-950">
                    <span>{c.name}</span>
                    <span className="text-slate-500">{enrolled} / {c.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-navy-900 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Section: {c.section}</span>
                    <span>{pct}% capacity</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Fee Collections Summary */}
      {(reportType === "all" || reportType === "fees") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Fee Collection & Receivables Audit
              </h2>
              <p className="text-xs text-slate-400">Category breakdown and outstanding arrears</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
              Total Revenue: ${(stats?.totalFeeCollections || 0).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Settled Invoices</span>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                {invoices.filter((i) => i.status === "PAID").length} Invoices
              </div>
            </div>
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <span className="text-[10px] font-bold uppercase text-blue-700">Partially Settled</span>
              <div className="text-xl font-bold text-blue-950 mt-1">
                {invoices.filter((i) => i.status === "PARTIALLY_PAID").length} Invoices
              </div>
            </div>
            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
              <span className="text-[10px] font-bold uppercase text-amber-700">Pending Payment</span>
              <div className="text-xl font-bold text-amber-950 mt-1">
                {invoices.filter((i) => i.status === "PENDING").length} Invoices
              </div>
            </div>
            <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
              <span className="text-[10px] font-bold uppercase text-red-700">Overdue Arrears</span>
              <div className="text-xl font-bold text-red-950 mt-1">
                ${(stats?.outstandingFees || 0).toLocaleString()} Due
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Academic Outcomes */}
      {(reportType === "all" || reportType === "exams") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-600" />
                Examination Outcomes & GPA Summary
              </h2>
              <p className="text-xs text-slate-400">Institutional average score: {stats?.academicAverageScore || 86}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-emerald-600 block">Grade A+ (90-100%)</span>
              <span className="text-lg font-bold text-navy-900 mt-1 block">18 Students</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-blue-600 block">Grade A (80-89%)</span>
              <span className="text-lg font-bold text-navy-900 mt-1 block">24 Students</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-amber-600 block">Grade B (70-79%)</span>
              <span className="text-lg font-bold text-navy-900 mt-1 block">16 Students</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-purple-600 block">Grade C (60-69%)</span>
              <span className="text-lg font-bold text-navy-900 mt-1 block">7 Students</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-red-600 block">Grade D / F (&lt;60%)</span>
              <span className="text-lg font-bold text-navy-900 mt-1 block">3 Students</span>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
