"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Plus,
  Award,
  BookOpen,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  User,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Role } from "@/lib/types";

export default function ExaminationsPage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<Role>("ADMIN");
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(true);

  // Mark entry state
  const [markEntries, setMarkEntries] = useState<Record<string, { marks: number; remarks: string }>>({});
  const [savingMarks, setSavingMarks] = useState(false);

  // Create exam modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    name: "Semester 1 Midterm Evaluation",
    term: "Semester 1",
    academicYear: "2024-2025",
    examDate: "2026-10-25",
    maxMarks: 100,
    passingMarks: 40,
    classId: "",
    subjectId: "",
  });
  const [submittingExam, setSubmittingExam] = useState(false);

  useEffect(() => {
    // Auth role check
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role) setUserRole(d.user.role);
      })
      .catch(() => {});

    // Load classes & subjects
    Promise.all([
      fetch("/api/classes").then((r) => r.json()),
      fetch("/api/subjects").then((r) => r.json()),
      fetch("/api/examinations").then((r) => r.json()),
    ])
      .then(([cRes, sRes, eRes]) => {
        if (cRes.success) setClasses(cRes.data);
        if (sRes.success) setSubjects(sRes.data);
        if (eRes.success) {
          setExams(eRes.data);
          if (eRes.data.length > 0) {
            setSelectedExamId(eRes.data[0].id);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // Synchronize markEntries when selectedExam changes
  useEffect(() => {
    if (!selectedExam) return;

    const classInfo = classes.find((c) => c.id === selectedExam.classId);
    const students = classInfo?.students || [];

    const map: Record<string, any> = {};
    students.forEach((s: any) => {
      const existing = selectedExam.results?.find((r: any) => r.studentId === s.id);
      if (existing) {
        map[s.id] = { marks: existing.marksObtained, remarks: existing.remarks || "" };
      } else {
        map[s.id] = { marks: 80, remarks: "" };
      }
    });

    setMarkEntries(map);
  }, [selectedExam, classes]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingExam(true);

    try {
      const res = await fetch("/api/examinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create examination");

      toast("Examination registered successfully", "success");
      setIsCreateModalOpen(false);

      // Refresh exams
      const eRes = await fetch("/api/examinations").then((r) => r.json());
      if (eRes.success) {
        setExams(eRes.data);
        setSelectedExamId(data.data.id);
      }
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmittingExam(false);
    }
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;
    setSavingMarks(true);

    try {
      const entries = Object.entries(markEntries).map(([studentId, val]) => ({
        studentId,
        marksObtained: Number(val.marks),
        remarks: val.remarks || null,
      }));

      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examinationId: selectedExam.id,
          entries,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save marks");

      toast("Marks & academic grades computed and saved!", "success");

      // Refresh exams to show updated results
      const eRes = await fetch("/api/examinations").then((r) => r.json());
      if (eRes.success) setExams(eRes.data);
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSavingMarks(false);
    }
  };

  // Helper grade calculator
  const calculateGrade = (pct: number) => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    if (pct >= 50) return "D";
    return "F";
  };

  // Class performance stats for the selected exam
  const examResults = selectedExam?.results || [];
  const totalGraded = examResults.length;
  const avgMarks =
    totalGraded > 0
      ? Number((examResults.reduce((acc: number, r: any) => acc + r.marksObtained, 0) / totalGraded).toFixed(1))
      : 0;
  const highestMarks =
    totalGraded > 0 ? Math.max(...examResults.map((r: any) => r.marksObtained)) : 0;
  const lowestMarks =
    totalGraded > 0 ? Math.min(...examResults.map((r: any) => r.marksObtained)) : 0;
  const passCount = examResults.filter(
    (r: any) => r.marksObtained >= (selectedExam?.passingMarks || 40)
  ).length;
  const passRate = totalGraded > 0 ? Number(((passCount / totalGraded) * 100).toFixed(1)) : 100;

  return (
    <DashboardLayout userRole={userRole}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Examinations & Academic Grading
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">
              GPA Scale
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer evaluations, enter student scores, and calculate automated letter grades.
          </p>
        </div>

        {userRole !== "STUDENT" && (
          <button
            onClick={() => {
              setExamForm({
                name: "Semester 1 Midterm Evaluation",
                term: "Semester 1",
                academicYear: "2024-2025",
                examDate: "2026-10-25",
                maxMarks: 100,
                passingMarks: 40,
                classId: classes[0]?.id || "",
                subjectId: subjects[0]?.id || "",
              });
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Create Examination</span>
          </button>
        )}
      </div>

      {/* Exam Selector & Details Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Examination
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full md:w-96 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 bg-slate-50 focus:border-navy-900 outline-none"
            >
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} — {e.subject?.code} ({e.class?.name})
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject:</span>
                <span className="font-semibold text-navy-950">
                  {selectedExam.subject?.name} ({selectedExam.subject?.code})
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Marks:</span>
                <span className="font-bold text-navy-950">{selectedExam.maxMarks}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing:</span>
                <span className="font-bold text-emerald-700">{selectedExam.passingMarks}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Exam Date:</span>
                <span className="font-semibold text-slate-700">
                  {new Date(selectedExam.examDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Class Performance Metrics Strip */}
        {selectedExam && totalGraded > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Average</span>
              <span className="text-lg font-bold text-navy-950">{avgMarks} / {selectedExam.maxMarks}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Highest Score</span>
              <span className="text-lg font-bold text-emerald-700">{highestMarks}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Lowest Score</span>
              <span className="text-lg font-bold text-slate-700">{lowestMarks}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing Rate</span>
              <span className="text-lg font-bold text-navy-950">{passRate}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Grade Entry Table / Results View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs">
            <h3 className="font-bold text-navy-950">Student Marks Roster</h3>
            <p className="text-[11px] text-slate-400">
              Validates mark bounds (0 to {selectedExam?.maxMarks || 100}) with instant percentage and letter grade mapping.
            </p>
          </div>

          {userRole !== "STUDENT" && (
            <button
              onClick={handleSaveMarks}
              disabled={savingMarks}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5 text-gold-400" />
              <span>{savingMarks ? "Calculating & Saving..." : "Save Marks & Grades"}</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Marks Obtained (Max {selectedExam?.maxMarks || 100})</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes
                .find((c) => c.id === selectedExam?.classId)
                ?.students?.map((s: any) => {
                  const entry = markEntries[s.id] || { marks: 0, remarks: "" };
                  const maxM = selectedExam?.maxMarks || 100;
                  const pct = Number(((entry.marks / maxM) * 100).toFixed(1));
                  const grade = calculateGrade(pct);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-navy-950 block">{s.fullName}</span>
                            <span className="text-[11px] font-mono text-slate-400">{s.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {userRole === "STUDENT" ? (
                          <span className="font-extrabold text-navy-950 text-sm">
                            {entry.marks}
                          </span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            max={maxM}
                            value={entry.marks}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 0 && val <= maxM) {
                                setMarkEntries((prev) => ({
                                  ...prev,
                                  [s.id]: { ...prev[s.id], marks: val },
                                }));
                              }
                            }}
                            className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 bg-slate-50 focus:border-navy-900 outline-none"
                          />
                        )}
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{pct}%</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold-100 text-gold-800 border border-gold-200">
                          {grade}
                        </span>
                      </td>
                      <td className="p-4">
                        {userRole === "STUDENT" ? (
                          <span className="text-slate-600">{entry.remarks || "—"}</span>
                        ) : (
                          <input
                            type="text"
                            placeholder="Add evaluation remarks..."
                            value={entry.remarks}
                            onChange={(e) =>
                              setMarkEntries((prev) => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], remarks: e.target.value },
                              }))
                            }
                            className="w-full max-w-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50 focus:border-navy-900 outline-none"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Examination */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Examination"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              required
              value={examForm.name}
              onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              placeholder="Midterm Examination 2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Term *</label>
              <input
                type="text"
                required
                value={examForm.term}
                onChange={(e) => setExamForm({ ...examForm, term: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Exam Date *</label>
              <input
                type="date"
                required
                value={examForm.examDate}
                onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Class *</label>
              <select
                required
                value={examForm.classId}
                onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.section})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Subject *</label>
              <select
                required
                value={examForm.subjectId}
                onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}: {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Maximum Total Marks *
              </label>
              <input
                type="number"
                min={1}
                required
                value={examForm.maxMarks}
                onChange={(e) => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Passing Marks Threshold *
              </label>
              <input
                type="number"
                min={1}
                required
                value={examForm.passingMarks}
                onChange={(e) => setExamForm({ ...examForm, passingMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingExam}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm"
            >
              {submittingExam ? "Creating..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
