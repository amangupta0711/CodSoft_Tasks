"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Users,
  UserCheck,
  Layers,
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function ClassesPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Class Form
  const [classForm, setClassForm] = useState({
    name: "",
    section: "Section A",
    room: "Room 301",
    academicYear: "2024-2025",
    capacity: 40,
    classTeacherId: "",
  });

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({
    code: "",
    name: "",
    description: "",
    credits: 3,
    department: "Computer Science",
  });

  // Assignment Form
  const [assignForm, setAssignForm] = useState({
    teacherId: "",
    classId: "",
    subjectId: "",
    academicYear: "2024-2025",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resS, resT] = await Promise.all([
        fetch("/api/classes").then((r) => r.json()),
        fetch("/api/subjects").then((r) => r.json()),
        fetch("/api/teachers").then((r) => r.json()),
      ]);

      if (resC.success) setClasses(resC.data);
      if (resS.success) setSubjects(resS.data);
      if (resT.success) setTeachers(resT.data);
    } catch {
      toast("Failed to load academic records", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create class");

      toast("Class created successfully", "success");
      setIsAddClassModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subject");

      toast("Subject created successfully", "success");
      setIsAddSubjectModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create assignment");

      toast("Subject assigned to teacher and class", "success");
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout userRole="ADMIN">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight">
            Classes, Subjects & Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize institutional grades, courses, credit weights, and faculty classroom assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setClassForm({
                name: "Computer Science Year 3",
                section: "Section A",
                room: "Lab 502",
                academicYear: "2024-2025",
                capacity: 40,
                classTeacherId: teachers[0]?.id || "",
              });
              setIsAddClassModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-gold-400" />
            <span>Create Class</span>
          </button>
          <button
            onClick={() => {
              setSubjectForm({
                code: "CS-301",
                name: "Operating Systems & Concurrency",
                description: "Kernel concepts, scheduling, memory paging and file systems.",
                credits: 4,
                department: "Computer Science",
              });
              setIsAddSubjectModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-navy-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-navy-700" />
            <span>New Subject</span>
          </button>
          <button
            onClick={() => {
              setAssignForm({
                classId: classes[0]?.id || "",
                teacherId: teachers[0]?.id || "",
                subjectId: subjects[0]?.id || "",
                academicYear: "2024-2025",
              });
              setIsAssignModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Assign Teacher</span>
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gold-500" />
          <span>Active Institutional Classes ({classes.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
                      {c.section}
                    </span>
                    <h3 className="font-bold text-sm text-navy-950 mt-1.5">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.room || "Room Unassigned"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-navy-900 block">
                      {c.students?.length || 0} / {c.capacity}
                    </span>
                    <span className="text-[10px] text-slate-400">Students</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Class Mentor:</span>
                    <span className="font-semibold text-navy-900">
                      {c.classTeacher?.fullName || "Not designated"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Subjects & Assigned Faculty:
                    </span>
                    <div className="space-y-1">
                      {c.assignments?.map((a: any) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-100"
                        >
                          <span className="font-bold text-navy-900">
                            {a.subject?.code}: {a.subject?.name}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {a.teacher?.fullName || "TBD"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{c.academicYear}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Term
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Catalog */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-navy-700" />
          <span>Curriculum Subject Catalog ({subjects.length})</span>
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Subject Name & Description</th>
                <th className="p-4">Department</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Active Classroom Taught</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-navy-900">{sub.code}</td>
                  <td className="p-4">
                    <span className="font-bold text-navy-950 block">{sub.name}</span>
                    <span className="text-[11px] text-slate-400">{sub.description || "—"}</span>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">{sub.department}</td>
                  <td className="p-4 font-bold text-navy-900">{sub.credits} Credits</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {sub.assignments?.map((a: any) => (
                        <span
                          key={a.id}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-navy-50 text-navy-800"
                        >
                          {a.class?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Class */}
      <Modal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        title="Create New Institutional Class"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Class Name *</label>
              <input
                type="text"
                required
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="Computer Science Year 3"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Section *</label>
              <input
                type="text"
                required
                value={classForm.section}
                onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="Section A"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Room</label>
              <input
                type="text"
                value={classForm.room}
                onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Capacity</label>
              <input
                type="number"
                min={1}
                value={classForm.capacity}
                onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Academic Year</label>
              <input
                type="text"
                value={classForm.academicYear}
                onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Class Teacher (Mentor)</label>
            <select
              value={classForm.classTeacherId}
              onChange={(e) => setClassForm({ ...classForm, classTeacherId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            >
              <option value="">Select Faculty Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddClassModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm"
            >
              {submitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Subject */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title="Add Subject to Curriculum"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="CS-301"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Subject Name *</label>
              <input
                type="text"
                required
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Department *</label>
              <input
                type="text"
                required
                value={subjectForm.department}
                onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={10}
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Syllabus Description</label>
            <textarea
              rows={3}
              value={subjectForm.description}
              onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm"
            >
              {submitting ? "Saving..." : "Add Subject"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Teacher to Class and Subject */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Faculty to Class & Subject"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Select Class *</label>
            <select
              required
              value={assignForm.classId}
              onChange={(e) => setAssignForm({ ...assignForm, classId: e.target.value })}
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
            <label className="block text-xs font-semibold text-navy-900 mb-1">Select Subject *</label>
            <select
              required
              value={assignForm.subjectId}
              onChange={(e) => setAssignForm({ ...assignForm, subjectId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Select Faculty Teacher *
            </label>
            <select
              required
              value={assignForm.teacherId}
              onChange={(e) => setAssignForm({ ...assignForm, teacherId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gold-600 hover:bg-gold-700 shadow-sm"
            >
              {submitting ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
