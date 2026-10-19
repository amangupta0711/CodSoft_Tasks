"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "GRADUATED";
  enrollmentDate: string;
  currentClassId?: string | null;
  currentClass?: { id: string; name: string; section: string } | null;
}

function StudentsListContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<"fullName" | "studentId" | "enrollmentDate">("fullName");
  const [sortAsc, setSortAsc] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "2004-01-15",
    address: "",
    classId: "",
    status: "ACTIVE",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchClasses();

    if (searchParams.get("action") === "new") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch {
      toast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
        if (data.data.length > 0 && !formData.classId) {
          setFormData((prev) => ({ ...prev, classId: data.data[0].id }));
        }
      }
    } catch {
      // ignore
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      studentId: `STU-2024-00${students.length + 1}`,
      fullName: "",
      email: "",
      phone: "+1 (555) 000-0000",
      gender: "Male",
      dateOfBirth: "2004-05-15",
      address: "Campus Residential Hall A",
      classId: classes[0]?.id || "",
      status: "ACTIVE",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone || "",
      gender: student.gender || "Male",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "2004-05-15",
      address: student.address || "",
      classId: student.currentClassId || classes[0]?.id || "",
      status: student.status,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : "/api/students";
      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save student profile");
      }

      toast(
        editingStudent ? "Student updated successfully!" : "Student registered successfully!",
        "success"
      );
      setIsAddModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast(err.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      toast("Student deleted successfully", "success");
      setDeletingStudent(null);
      fetchStudents();
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  // Filtered & Sorted list
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = selectedClass === "ALL" || s.currentClassId === selectedClass;
        const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;

        return matchesSearch && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField] || "";
        const valB = b[sortField] || "";
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, selectedClass, selectedStatus, sortField, sortAsc]);

  const toggleSort = (field: "fullName" | "studentId" | "enrollmentDate") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <DashboardLayout userRole="ADMIN">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Student Management
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-800">
              {filteredStudents.length} Students
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain official student records, class enrollments, and status tracking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, ID (e.g. STU-2024-001) or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          />
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          >
            <option value="ALL">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.section})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
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
            <option value="SUSPENDED">Suspended</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:text-navy-900" onClick={() => toggleSort("studentId")}>
                  <div className="flex items-center gap-1.5">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-navy-900" onClick={() => toggleSort("fullName")}>
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-navy-900" onClick={() => toggleSort("enrollmentDate")}>
                  <div className="flex items-center gap-1.5">
                    <span>Enrolled</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading student records from database...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {s.studentId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-navy-900 block">{s.fullName}</span>
                          <span className="text-[11px] text-slate-400">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-navy-50 text-navy-800 border border-navy-100">
                        {s.currentClass ? `${s.currentClass.name}` : "Not Assigned"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="space-y-0.5 text-[11px]">
                        <div>{s.phone || "No phone"}</div>
                        <div className="text-slate-400">{s.gender || "Not specified"}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(s.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.status === "INACTIVE"
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : s.status === "SUSPENDED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/students/${s.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingStudent ? "Edit Student Information" : "Register New Student"}
        subtitle="Ensure student ID and institutional email are unique"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50 disabled:opacity-60"
                placeholder="STU-2024-009"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="Eleanor Vance"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="eleanor.vance@edumanage.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Class Assignment
              </label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
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
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="GRADUATED">Graduated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              placeholder="123 Academic Way, Seattle, WA"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? "Saving..." : editingStudent ? "Save Changes" : "Register Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Confirm Student Record Deletion"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete student{" "}
            <strong className="text-navy-950">{deletingStudent?.fullName}</strong> (
            {deletingStudent?.studentId})? All related attendance, grades, and fee records will be
            removed according to database cascade rules.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeletingStudent(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading student directory...</div>}>
      <StudentsListContent />
    </Suspense>
  );
}

