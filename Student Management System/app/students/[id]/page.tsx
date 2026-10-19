"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  GraduationCap,
  CalendarCheck2,
  Award,
  Receipt,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "exams" | "fees">("overview");

  useEffect(() => {
    if (params.id) {
      fetch(`/api/students/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setStudent(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading student academic profile...
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="bg-white p-8 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h2 className="text-base font-bold text-navy-950">Student Profile Not Found</h2>
          <p className="text-xs text-slate-500">The requested student record does not exist.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Attendance metrics
  const totalAtt = student.attendance?.length || 0;
  const presentAtt =
    student.attendance?.filter((a: any) => a.status === "PRESENT" || a.status === "LATE").length || 0;
  const attendanceRate = totalAtt > 0 ? Number(((presentAtt / totalAtt) * 100).toFixed(1)) : 100;

  // Fee metrics
  const totalFees = student.feeInvoices?.reduce((acc: number, f: any) => acc + f.totalAmount, 0) || 0;
  const paidFees = student.feeInvoices?.reduce((acc: number, f: any) => acc + f.paidAmount, 0) || 0;
  const balanceFees = totalFees - paidFees;

  return (
    <DashboardLayout userRole="ADMIN">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
            Student Profile Card
          </span>
          <h1 className="text-xl font-bold text-navy-950">{student.fullName}</h1>
        </div>
      </div>

      {/* Hero Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-navy-950">{student.fullName}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {student.status}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {student.studentId}</p>
            <p className="text-xs text-navy-700 font-medium mt-1">
              {student.currentClass ? `${student.currentClass.name} (${student.currentClass.section})` : "No class assigned"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{student.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition-colors relative ${
            activeTab === "overview" ? "text-navy-900 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Academic Overview
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 transition-colors relative ${
            activeTab === "attendance" ? "text-navy-900 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Attendance Records ({student.attendance?.length || 0})
          {activeTab === "attendance" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("exams")}
          className={`pb-3 transition-colors relative ${
            activeTab === "exams" ? "text-navy-900 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Examination Results ({student.results?.length || 0})
          {activeTab === "exams" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`pb-3 transition-colors relative ${
            activeTab === "fees" ? "text-navy-900 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Fee Invoices & Payments ({student.feeInvoices?.length || 0})
          {activeTab === "fees" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900" />
          )}
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Metrics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attendance Standing
            </h3>
            <div className="text-3xl font-bold text-navy-950">{attendanceRate}%</div>
            <p className="text-xs text-slate-500">
              {presentAtt} out of {totalAtt} verified sessions present
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Financial Balance
            </h3>
            <div className="text-3xl font-bold text-navy-950">${balanceFees}</div>
            <p className="text-xs text-slate-500">
              ${paidFees} paid of ${totalFees} total assessed
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Class Mentor
            </h3>
            <div className="text-sm font-bold text-navy-950">
              {student.currentClass?.classTeacher?.fullName || "Prof. Marcus Thorne"}
            </div>
            <p className="text-xs text-slate-500">
              {student.currentClass?.classTeacher?.department || "Computer Science"}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Attendance */}
      {activeTab === "attendance" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {student.attendance?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-400">
                    No attendance records logged for this student.
                  </td>
                </tr>
              ) : (
                student.attendance?.map((a: any) => (
                  <tr key={a.id}>
                    <td className="p-4 font-medium text-navy-900">
                      {new Date(a.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700"
                            : a.status === "LATE"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{a.remarks || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Exams */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Examination</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Marks Obtained</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {student.results?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No examination results recorded for this student.
                  </td>
                </tr>
              ) : (
                student.results?.map((r: any) => (
                  <tr key={r.id}>
                    <td className="p-4 font-bold text-navy-900">
                      {r.examination?.name || "Exam"}
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {r.examination?.subject?.name || "Subject"} ({r.examination?.subject?.code})
                    </td>
                    <td className="p-4 font-bold text-navy-950">
                      {r.marksObtained} / {r.examination?.maxMarks || 100}
                    </td>
                    <td className="p-4 text-slate-700">{r.percentage}%</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-gold-800">
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{r.remarks || "Satisfactory"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Fees */}
      {activeTab === "fees" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Category & Title</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.feeInvoices?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No invoices issued for this student.
                    </td>
                  </tr>
                ) : (
                  student.feeInvoices?.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="p-4 font-mono font-bold text-navy-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-navy-900 block">{inv.title}</span>
                        <span className="text-[11px] text-slate-400">{inv.category}</span>
                      </td>
                      <td className="p-4 font-bold text-navy-950">${inv.totalAmount}</td>
                      <td className="p-4 text-emerald-700 font-semibold">${inv.paidAmount}</td>
                      <td className="p-4 text-red-600 font-semibold">${inv.balance}</td>
                      <td className="p-4 text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : inv.status === "PARTIALLY_PAID"
                              ? "bg-blue-50 text-blue-700"
                              : inv.status === "OVERDUE"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
