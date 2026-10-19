"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Briefcase,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  Clock,
  Activity,
  ExternalLink,
  Building2,
} from "lucide-react";
import { StatusBadge, EmploymentBadge, ArrangementBadge } from "@/components/Badge";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "jobs" | "audit">("overview");
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // 2. Users
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData.users || []);
      }

      // 3. All Jobs
      const jobsRes = await fetch("/api/jobs?status=all");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobsList(jobsData.jobs || []);
      }
    } catch (err) {
      console.error("Admin data error:", err);
      toast("Failed to load administrative data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const handleToggleUserStatus = async (targetUser: any) => {
    const nextStatus = targetUser.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`Are you sure you want to set status of ${targetUser.name} to ${nextStatus}?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to update user", "error");
      } else {
        toast(data.message, "success");
        await loadAdminData();
      }
    } catch {
      toast("Error updating user status", "error");
    }
  };

  const handleModerateJob = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast(`Job status updated to ${nextStatus}`, "success");
        await loadAdminData();
      }
    } catch {
      toast("Failed to moderate job", "error");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to remove this job listing from the platform?")) {
      return;
    }
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        toast("Job removed", "success");
        await loadAdminData();
      }
    } catch {
      toast("Failed to delete job", "error");
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = jobsList.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 overflow-hidden shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user?.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Platform Administrator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Platform governance, moderation, user audits and recruitment metrics.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {[
          { id: "overview", label: "System Overview", icon: Activity },
          { id: "users", label: `Users Directory (${usersList.length})`, icon: Users },
          { id: "jobs", label: `Job Listings Moderation (${jobsList.length})`, icon: Briefcase },
          { id: "audit", label: "Audit Activity Log", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-black text-slate-900 mt-2">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Job Seekers</p>
              <p className="text-2xl font-black text-emerald-700 mt-2">{stats?.totalJobSeekers || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Recruiters</p>
              <p className="text-2xl font-black text-blue-700 mt-2">{stats?.totalRecruiters || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Active Jobs</p>
              <p className="text-2xl font-black text-amber-700 mt-2">{stats?.totalActiveJobs || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Applications</p>
              <p className="text-2xl font-black text-purple-700 mt-2">{stats?.totalApplications || 0}</p>
            </div>
          </div>

          {/* Platform Status Notice */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">System Integrity & Database Operational</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                PostgreSQL and Prisma models active with cascade delete constraints and isolated role authorization guards on every endpoint.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Accounts Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect registered seekers, recruiters, and platform administrators.
              </p>
            </div>

            <div className="w-full sm:w-72 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-500">{u.email}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : u.role === "RECRUITER"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">{u.phone || "—"}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            u.status === "ACTIVE"
                              ? "border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100"
                              : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "ACTIVE" ? "Suspend Account" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Job Listings Moderation */}
      {activeTab === "jobs" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Job Listing Moderation</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and moderate published job positions across all recruiting organizations.
              </p>
            </div>

            <div className="w-full sm:w-72 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search job or company name..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title & Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/jobs/${j.id}`} className="font-bold text-slate-900 hover:text-amber-600">
                        {j.title}
                      </Link>
                      <p className="text-[11px] text-slate-500">{j.company?.name || "Company"}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">{j.category}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">{j.location}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          j.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      {j.deadline ? new Date(j.deadline).toLocaleDateString() : "No deadline"}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleModerateJob(j.id, j.status)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                        >
                          {j.status === "PUBLISHED" ? "Close Listing" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Activity Log */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Platform Audit & Activity Trail</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of candidate applications, stage transitions, and recruiter actions.
            </p>
          </div>

          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((log: any) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Stage Shift:</span>
                      <StatusBadge status={log.toStatus} />
                      <span className="text-[11px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {log.note && <p className="text-xs text-slate-600">{log.note}</p>}
                    <p className="text-[10px] text-slate-400">Actor ID: {log.changedById}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No activity logged yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
