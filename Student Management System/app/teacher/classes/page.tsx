"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  CalendarCheck2,
  FileSpreadsheet,
  Award,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setClasses(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout userRole="TEACHER" userName="Prof. Marcus Thorne">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight">
          My Assigned Classes & Student Rosters
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your enrolled cohorts, manage attendance registers, and submit examination marks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading assigned classrooms...
          </div>
        ) : (
          classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                      {c.academicYear}
                    </span>
                    <h3 className="text-base font-bold text-navy-950 mt-1.5">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.section} • {c.room || "Lab 401"}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-navy-50 text-navy-800">
                    {c.students?.length || 0} Students Enrolled
                  </span>
                </div>

                {/* Subjects taught */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Curriculum Subjects
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {c.assignments?.map((a: any) => (
                      <span
                        key={a.id}
                        className="px-2.5 py-1 bg-slate-50 text-navy-900 text-xs font-medium rounded-lg border border-slate-200"
                      >
                        {a.subject?.code}: {a.subject?.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enrolled Students preview */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Enrolled Students ({c.students?.length || 0})
                  </h4>
                  <div className="space-y-1.5">
                    {c.students?.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between text-xs py-1">
                        <span className="font-semibold text-navy-900">{s.fullName}</span>
                        <span className="font-mono text-[11px] text-slate-400">{s.studentId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/attendance"
                  className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Mark Attendance</span>
                </Link>
                <Link
                  href="/examinations"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-navy-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gold-600" />
                  <span>Grade Examinations</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
