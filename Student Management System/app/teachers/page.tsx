"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Edit2,
  Trash2,
  Layers,
  GraduationCap,
  Award,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  department: string;
  qualification?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  joiningDate: string;
  headOfClasses?: any[];
  assignments?: any[];
}

export default function TeachersPage() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    teacherId: "",
    fullName: "",
    email: "",
    phone: "",
    department: "Computer Science",
    qualification: "",
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data);
      }
    } catch {
      toast("Failed to load teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      teacherId: `TCH-2024-00${teachers.length + 1}`,
      fullName: "",
      email: "",
      phone: "+1 (555) 400-0000",
      department: "Computer Science",
      qualification: "M.S. in Computer Science",
      status: "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      teacherId: t.teacherId,
      fullName: t.fullName,
      email: t.email,
      phone: t.phone || "",
      department: t.department,
      qualification: t.qualification || "",
      status: t.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : "/api/teachers";
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save teacher profile");

      toast(
        editingTeacher ? "Teacher profile updated" : "Teacher added successfully",
        "success"
      );
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      toast(err.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      const res = await fetch(`/api/teachers/${deletingTeacher.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete teacher");

      toast("Teacher profile removed", "success");
      setDeletingTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        t.fullName.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q);

      const matchesDept = selectedDept === "ALL" || t.department === selectedDept;
      const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [teachers, searchTerm, selectedDept, selectedStatus]);

  const departments = Array.from(new Set(teachers.map((t) => t.department)));

  return (
    <DashboardLayout userRole="ADMIN">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Faculty & Teachers
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-800">
              {filteredTeachers.length} Faculty Members
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic departments, professor credentials and assigned classrooms.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by teacher name, ID (e.g. TCH-2024-001) or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading faculty profiles from PostgreSQL...
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No faculty members match your search criteria.
          </div>
        ) : (
          filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      {t.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-950">{t.fullName}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{t.teacherId}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      t.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-navy-900">{t.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Qualification:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[170px]" title={t.qualification || ""}>
                      {t.qualification || "Ph.D."}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-[11px] text-slate-700">{t.email}</span>
                  </div>
                </div>

                {/* Assigned Courses Badge */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Assigned Classes & Subjects ({t.assignments?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.assignments?.length === 0 ? (
                      <span className="text-[11px] text-slate-400">None assigned yet</span>
                    ) : (
                      t.assignments?.map((a: any) => (
                        <span
                          key={a.id}
                          className="px-2 py-0.5 bg-navy-50 text-navy-800 text-[10px] font-semibold rounded border border-navy-100"
                        >
                          {a.subject?.code || "SUB"} ({a.class?.name || "Class"})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setDeletingTeacher(t)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "Edit Teacher Record" : "Add Faculty Member"}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Teacher ID *</label>
              <input
                type="text"
                required
                disabled={!!editingTeacher}
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="Dr. Gregory House"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Qualifications & Credentials
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              placeholder="Ph.D. in Computer Science, MIT"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingTeacher ? "Save Changes" : "Create Teacher"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTeacher}
        onClose={() => setDeletingTeacher(null)}
        title="Confirm Teacher Deletion"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to remove{" "}
            <strong className="text-navy-950">{deletingTeacher?.fullName}</strong> from faculty
            records? Any classroom teacher assignments will be unlinked.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingTeacher(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
