"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Briefcase,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { StatusBadge, EmploymentBadge, ArrangementBadge } from "@/components/Badge";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter state for applicants
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [applicantSearch, setApplicantSearch] = useState("");

  // Modals
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [statusModalApp, setStatusModalApp] = useState<any | null>(null);
  const [candidateProfileModal, setCandidateProfileModal] = useState<any | null>(null);

  // Status update modal form state
  const [newStatus, setNewStatus] = useState<string>("UNDER_REVIEW");
  const [statusNote, setStatusNote] = useState<string>("");
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Create job form state
  const [jobFormData, setJobFormData] = useState({
    title: "",
    category: "Engineering",
    employmentType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    workArrangement: "REMOTE",
    location: "Bengaluru, Karnataka, India",
    salaryMin: 2000000,
    salaryMax: 3000000,
    deadline: "2026-12-31",
    skills: "React, Node.js, TypeScript, PostgreSQL",
    description: "",
    responsibilities: "",
    requirements: "",
    featured: false,
  });
  const [creatingJob, setCreatingJob] = useState(false);

  // Company edit form state
  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    industry: "",
    website: "",
    location: "",
    size: "",
    description: "",
    logo: "",
  });
  const [savingCompany, setSavingCompany] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Recruiter stats
      const statsRes = await fetch("/api/recruiter/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // 2. Recruiter's jobs
      const jobsRes = await fetch(`/api/jobs?recruiterId=${user?.id || ""}`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      // 3. Applications for this recruiter's jobs
      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }

      // 4. Company profile
      const compRes = await fetch("/api/recruiter/company");
      if (compRes.ok) {
        const compData = await compRes.json();
        setCompany(compData.company);
        if (compData.company) {
          setCompanyFormData({
            name: compData.company.name || "",
            industry: compData.company.industry || "",
            website: compData.company.website || "",
            location: compData.company.location || "",
            size: compData.company.size || "",
            description: compData.company.description || "",
            logo: compData.company.logo || "",
          });
        }
      }
    } catch (err) {
      console.error("Recruiter dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobFormData,
          salaryMin: Number(jobFormData.salaryMin) || null,
          salaryMax: Number(jobFormData.salaryMax) || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to publish job", "error");
      } else {
        toast("Job listing published successfully!", "success");
        setCreateJobModalOpen(false);
        await loadData();
      }
    } catch {
      toast("Error publishing job", "error");
    } finally {
      setCreatingJob(false);
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast(`Job status updated to ${nextStatus}`, "success");
        await loadData();
      }
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job listing? Applications will be preserved.")) {
      return;
    }
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        toast("Job removed successfully", "success");
        await loadData();
      }
    } catch {
      toast("Failed to delete job", "error");
    }
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/applications/${statusModalApp.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNote,
          interviewDate: interviewDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Status update failed", "error");
      } else {
        toast(data.message || "Candidate moved successfully", "success");
        setStatusModalApp(null);
        await loadData();
      }
    } catch {
      toast("Error updating candidate status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCompany(true);
    try {
      const res = await fetch("/api/recruiter/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to save company profile", "error");
      } else {
        toast("Company profile saved!", "success");
        await loadData();
      }
    } catch {
      toast("Error saving company profile", "error");
    } finally {
      setSavingCompany(false);
    }
  };

  // Pipeline Chart Data
  const pipelineChartData = [
    { name: "Applied", count: stats?.pipeline?.APPLIED || 0, color: "#3B82F6" },
    { name: "Under Review", count: stats?.pipeline?.UNDER_REVIEW || 0, color: "#F59E0B" },
    { name: "Shortlisted", count: stats?.pipeline?.SHORTLISTED || 0, color: "#8B5CF6" },
    { name: "Interview", count: stats?.pipeline?.INTERVIEW || 0, color: "#6366F1" },
    { name: "Hired", count: stats?.pipeline?.HIRED || 0, color: "#10B981" },
  ];

  // Filtered applicants
  const filteredApplicants = applications.filter((app) => {
    if (selectedJobFilter !== "all" && app.jobId !== selectedJobFilter) return false;
    if (selectedStatusFilter !== "all" && app.status !== selectedStatusFilter) return false;
    if (applicantSearch.trim()) {
      const q = applicantSearch.toLowerCase();
      const matchName = app.applicant?.name?.toLowerCase().includes(q);
      const matchSkill = app.applicant?.skills?.toLowerCase().includes(q);
      const matchJob = app.job?.title?.toLowerCase().includes(q);
      if (!matchName && !matchSkill && !matchJob) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden shrink-0">
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              (company?.name || "T").charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user?.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Recruiter Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
              {company?.name || "Managing Enterprise Recruitment"} • {company?.industry}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateJobModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {[
          { id: "overview", label: "Pipeline Overview", icon: Layers },
          { id: "jobs", label: `My Job Listings (${jobs.length})`, icon: Briefcase },
          { id: "applicants", label: `Applicants (${applications.length})`, icon: Users },
          { id: "company", label: "Company Profile", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Jobs</p>
              <p className="text-2xl font-black text-slate-900 mt-2">{stats?.activeJobs || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-black text-blue-700 mt-2">{stats?.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Shortlisted</p>
              <p className="text-2xl font-black text-amber-700 mt-2">{stats?.shortlisted || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Interviews Scheduled</p>
              <p className="text-2xl font-black text-emerald-700 mt-2">{stats?.interview || 0}</p>
            </div>
          </div>

          {/* Recharts Pipeline Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Application Pipeline Funnel</h3>
                <span className="text-xs text-slate-500">Live Stage Distribution</span>
              </div>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineChartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {pipelineChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Recruiter Action Hub
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast-track candidate reviews, update interview stages, or publish new job opportunities to our talent network.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCreateJobModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Job Listing</span>
                </button>
                <button
                  onClick={() => setActiveTab("applicants")}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Review Incoming Applicants</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Job Management */}
      {activeTab === "jobs" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Published Positions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage requirements, open/close listings, and view candidate response rates.
              </p>
            </div>
            <button
              onClick={() => setCreateJobModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p>You haven't posted any jobs yet.</p>
              <button
                onClick={() => setCreateJobModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold"
              >
                Create Your First Job Listing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Arrangement</th>
                    <th className="py-3 px-4">Applicants</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <Link href={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-amber-600">
                          {job.title}
                        </Link>
                        <p className="text-[11px] text-slate-500">{job.location} • {job.category}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            job.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <ArrangementBadge arrangement={job.workArrangement} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedJobFilter(job.id);
                            setActiveTab("applicants");
                          }}
                          className="font-bold text-amber-600 hover:underline"
                        >
                          {job.applicationCount || 0} candidates
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleJobStatus(job.id, job.status)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                          >
                            {job.status === "PUBLISHED" ? "Close" : "Re-open"}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
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
          )}
        </div>
      )}

      {/* Tab 3: Applicant Pipeline Management */}
      {activeTab === "applicants" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Applicant Pipeline Board</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate credentials, inspect secure PDF resumes, and advance stages with interview scheduling.
              </p>
            </div>
          </div>

          {/* Search and Filters for Applicants */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Search */}
            <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name or skills..."
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
              />
            </div>

            {/* Job Filter */}
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Pipeline Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Applicants Table */}
          {filteredApplicants.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p>No candidates match the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role Applied For</th>
                    <th className="py-3 px-4">Key Skills</th>
                    <th className="py-3 px-4">Stage Status</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                            {app.applicant?.name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <button
                              onClick={() => setCandidateProfileModal(app)}
                              className="font-bold text-slate-900 hover:text-amber-600 text-left block"
                            >
                              {app.applicant?.name}
                            </button>
                            <span className="text-[11px] text-slate-500">{app.applicant?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap font-semibold text-slate-900">
                        {app.job?.title}
                      </td>
                      <td className="py-4 px-4 max-w-[200px] truncate text-[11px] text-slate-500">
                        {app.applicant?.skills || "Skills not specified"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Resume download */}
                          <a
                            href={`/api/resumes/${encodeURIComponent(app.resumePath)}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                            title="Download Candidate Resume"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Resume</span>
                          </a>

                          {/* Profile review */}
                          <button
                            onClick={() => setCandidateProfileModal(app)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                            <span>Profile</span>
                          </button>

                          {/* Move stage */}
                          <button
                            onClick={() => {
                              setStatusModalApp(app);
                              setNewStatus(app.status);
                              setStatusNote(app.notes || "");
                              setInterviewDate(app.interviewDate ? app.interviewDate.substring(0, 10) : "");
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm"
                          >
                            Advance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Company Profile */}
      {activeTab === "company" && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Company Brand & Organization Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are publicly showcased across all your job postings and company directory pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyFormData.name}
                onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Industry Domain
              </label>
              <input
                type="text"
                value={companyFormData.industry}
                onChange={(e) => setCompanyFormData({ ...companyFormData, industry: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Website
              </label>
              <input
                type="url"
                value={companyFormData.website}
                onChange={(e) => setCompanyFormData({ ...companyFormData, website: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headquarters Location
              </label>
              <input
                type="text"
                value={companyFormData.location}
                onChange={(e) => setCompanyFormData({ ...companyFormData, location: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Size
              </label>
              <input
                type="text"
                placeholder="e.g. 500 - 1,000 employees"
                value={companyFormData.size}
                onChange={(e) => setCompanyFormData({ ...companyFormData, size: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Logo Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={companyFormData.logo}
                onChange={(e) => setCompanyFormData({ ...companyFormData, logo: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Description & Mission
            </label>
            <textarea
              rows={4}
              value={companyFormData.description}
              onChange={(e) => setCompanyFormData({ ...companyFormData, description: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={savingCompany}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {savingCompany ? "Saving..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      )}

      {/* Modal 1: Post New Job */}
      {createJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish New Job Listing</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishing on behalf of {company?.name || "your organization"}
                </p>
              </div>
              <button onClick={() => setCreateJobModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job Category
                  </label>
                  <select
                    value={jobFormData.category}
                    onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Engineering">Software Engineering</option>
                    <option value="Design">Product & UI/UX Design</option>
                    <option value="DevOps">DevOps & Cloud SRE</option>
                    <option value="Data & AI">Data Science & AI</option>
                    <option value="Product">Product Management</option>
                    <option value="Marketing">Marketing & DevRel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={jobFormData.workArrangement}
                    onChange={(e) => setJobFormData({ ...jobFormData, workArrangement: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Employment Type
                  </label>
                  <select
                    value={jobFormData.employmentType}
                    onChange={(e) => setJobFormData({ ...jobFormData, employmentType: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience Level
                  </label>
                  <select
                    value={jobFormData.experienceLevel}
                    onChange={(e) => setJobFormData({ ...jobFormData, experienceLevel: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ENTRY_LEVEL">Entry Level</option>
                    <option value="MID_LEVEL">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD_EXECUTIVE">Lead / Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, India / Remote"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={jobFormData.deadline}
                    onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Salary Min (₹ / year)
                  </label>
                  <input
                    type="number"
                    value={jobFormData.salaryMin}
                    onChange={(e) => setJobFormData({ ...jobFormData, salaryMin: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Salary Max (₹ / year)
                  </label>
                  <input
                    type="number"
                    value={jobFormData.salaryMax}
                    onChange={(e) => setJobFormData({ ...jobFormData, salaryMax: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Next.js, Node.js, PostgreSQL"
                  value={jobFormData.skills}
                  onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Overview & Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide an overview of the role, product domain, and team..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="- Lead development of core microservices\n- Review code and design schemas"
                  value={jobFormData.responsibilities}
                  onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Candidate Qualifications & Requirements
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="- 4+ years software development experience\n- Strong background in SQL and relational design"
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateJobModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md disabled:opacity-50"
                >
                  {creatingJob ? "Publishing..." : "Publish Job Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Advance Stage Modal */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Advance Candidate Pipeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {statusModalApp.applicant?.name} • {statusModalApp.job?.title}
                </p>
              </div>
              <button onClick={() => setStatusModalApp(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Pipeline Stage
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview Round</option>
                  <option value="HIRED">Offer / Hired</option>
                  <option value="REJECTED">Not Selected (Rejected)</option>
                </select>
              </div>

              {newStatus === "INTERVIEW" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recruiter Internal Notes / Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Passed initial screen with flying colors. Panel system design interview scheduled..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Candidate Profile Detail View */}
      {candidateProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center">
                  {candidateProfileModal.applicant?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {candidateProfileModal.applicant?.name}
                  </h3>
                  <p className="text-xs text-slate-500">{candidateProfileModal.applicant?.email}</p>
                </div>
              </div>
              <button onClick={() => setCandidateProfileModal(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Professional Headline
                </span>
                <p className="text-slate-900 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {candidateProfileModal.applicant?.headline || "Not provided"}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Skills & Proficiencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {candidateProfileModal.applicant?.skills
                    ?.split(",")
                    .map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-amber-50 text-amber-900 border border-amber-200 font-semibold px-2 py-0.5 rounded"
                      >
                        {s.trim()}
                      </span>
                    )) || <span className="text-slate-500">No skills specified</span>}
                </div>
              </div>

              {candidateProfileModal.coverLetter && (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Submitted Cover Letter
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-line leading-relaxed">
                    {candidateProfileModal.coverLetter}
                  </div>
                </div>
              )}

              {/* Secure Resume Download inside modal */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold">{candidateProfileModal.resumeOriginalName || "Resume.pdf"}</span>
                </div>
                <a
                  href={`/api/resumes/${encodeURIComponent(candidateProfileModal.resumePath)}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setCandidateProfileModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
