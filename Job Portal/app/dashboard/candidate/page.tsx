"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Briefcase,
  FileText,
  Bookmark,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Building2,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  History,
  ShieldCheck,
} from "lucide-react";
import { StatusBadge, EmploymentBadge } from "@/components/Badge";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function CandidateDashboardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Resume upload state
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Status timeline modal
  const [timelineModalApp, setTimelineModalApp] = useState<any | null>(null);

  // Profile edit form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    skills: "",
    portfolioUrl: "",
    linkedInUrl: "",
    gitHubUrl: "",
    education: [] as any[],
    experience: [] as any[],
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Profile
      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData.profile);
        setFormData({
          name: profData.profile.name || "",
          phone: profData.profile.phone || "",
          headline: profData.profile.headline || "",
          bio: profData.profile.bio || "",
          location: profData.profile.location || "",
          skills: profData.profile.skills || "",
          portfolioUrl: profData.profile.portfolioUrl || "",
          linkedInUrl: profData.profile.linkedInUrl || "",
          gitHubUrl: profData.profile.gitHubUrl || "",
          education: profData.profile.education || [],
          experience: profData.profile.experience || [],
        });
      }

      // 2. Load Applications
      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }

      // 3. Load Saved Jobs
      const savedRes = await fetch("/api/saved-jobs");
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedJobs(savedData.savedJobs || []);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeFile) {
      toast("Please select a PDF file to upload", "error");
      return;
    }

    if (!selectedResumeFile.name.toLowerCase().endsWith(".pdf")) {
      toast("Only PDF files are supported", "error");
      return;
    }

    setUploadingResume(true);
    try {
      const data = new FormData();
      data.append("file", selectedResumeFile);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (!res.ok) {
        toast(result.error || "Upload failed", "error");
      } else {
        toast("Resume uploaded successfully!", "success");
        setSelectedResumeFile(null);
        await loadData();
      }
    } catch {
      toast("Error uploading resume", "error");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Failed to save profile", "error");
      } else {
        toast("Candidate profile updated successfully!", "success");
        await loadData();
        await refreshUser();
      }
    } catch {
      toast("Error saving profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleWithdrawApplication = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/applications/${appId}/withdraw`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to withdraw application", "error");
      } else {
        toast("Application withdrawn successfully", "success");
        await loadData();
      }
    } catch {
      toast("Failed to withdraw application", "error");
    }
  };

  // Metrics calculation
  const totalApps = applications.length;
  const underReviewCount = applications.filter((a) => a.status === "UNDER_REVIEW").length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const interviewCount = applications.filter((a) => a.status === "INTERVIEW").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Candidate Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 overflow-hidden shrink-0">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              (profile?.name || user?.name || "C").charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{profile?.name || user?.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Job Seeker
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-1">
              {profile?.headline || "Add your professional headline in the profile tab"}
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile?.location || "Location not set"}</span>
              <span>•</span>
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Browse New Jobs
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
        {[
          { id: "overview", label: "Dashboard Overview", icon: Layers },
          { id: "applications", label: `My Applications (${applications.length})`, icon: Briefcase },
          { id: "profile", label: "Candidate Profile", icon: User },
          { id: "resume", label: "Resume Vault", icon: FileText },
          { id: "saved", label: `Saved Jobs (${savedJobs.length})`, icon: Bookmark },
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
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applied</p>
              <p className="text-2xl font-black text-slate-900 mt-2">{totalApps}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Under Review</p>
              <p className="text-2xl font-black text-amber-700 mt-2">{underReviewCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Shortlisted</p>
              <p className="text-2xl font-black text-purple-700 mt-2">{shortlistedCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Interview</p>
              <p className="text-2xl font-black text-indigo-700 mt-2">{interviewCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Offers / Hired</p>
              <p className="text-2xl font-black text-emerald-700 mt-2">{hiredCount}</p>
            </div>
          </div>

          {/* Active Applications Quick Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Recent Applications</h2>
              <button
                onClick={() => setActiveTab("applications")}
                className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-3">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p>You haven't submitted any job applications yet.</p>
                <Link
                  href="/jobs"
                  className="inline-block px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Explore Open Jobs
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900">
                        <Link href={`/jobs/${app.jobId}`} className="hover:text-amber-600">
                          {app.job?.title || "Position Title"}
                        </Link>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {app.job?.company?.name || "Company"} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <button
                        onClick={() => setTimelineModalApp(app)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                        title="View Status Timeline"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Timeline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Job Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track the progress, status changes, and recruiter updates for all your submitted applications.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p>No applications submitted yet.</p>
              <Link href="/jobs" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">
                Browse Jobs Directory
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Job Title & Company</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <Link href={`/jobs/${app.jobId}`} className="font-bold text-slate-900 hover:text-amber-600">
                          {app.job?.title || "Job Listing"}
                        </Link>
                        <p className="text-[11px] text-slate-500">{app.job?.company?.name || "Company"}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setTimelineModalApp(app)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                          >
                            <History className="w-3.5 h-3.5 text-amber-500" />
                            <span>Timeline</span>
                          </button>
                          {app.status !== "HIRED" && app.status !== "WITHDRAWN" && (
                            <button
                              onClick={() => handleWithdrawApplication(app.id)}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold"
                            >
                              Withdraw
                            </button>
                          )}
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

      {/* Tab 3: Candidate Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Personal & Professional Info</h2>
              <p className="text-xs text-slate-500">
                This information is presented to recruiters when you apply for positions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer | React & Node.js"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="React, Next.js, TypeScript, PostgreSQL, Docker, AWS"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio & Career Summary
              </label>
              <textarea
                rows={4}
                placeholder="Write a concise overview of your background, architectural focus, and career goals..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Social & Portfolio URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  placeholder="https://yourname.dev"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.gitHubUrl}
                  onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Resume Vault */}
      {activeTab === "resume" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">PDF Resume Management</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your verified PDF resume. Resumes are kept private and only accessible to recruiters whose jobs you apply for.
            </p>
          </div>

          {/* Current Active Resume Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {profile?.resumeOriginalName || "No Resume Uploaded Yet"}
                </h3>
                <p className="text-xs text-slate-500">
                  {profile?.resumeUploadedAt
                    ? `Uploaded on ${new Date(profile.resumeUploadedAt).toLocaleDateString()}`
                    : "Upload a PDF document below to activate 1-click applications"}
                </p>
              </div>
            </div>

            {profile?.resumePath && (
              <div className="flex items-center gap-3">
                <a
                  href={`/api/resumes/${encodeURIComponent(profile.resumePath)}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>

          {/* Upload / Replace Form */}
          <form onSubmit={handleResumeUpload} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {profile?.resumePath ? "Upload New Resume (Replaces Existing)" : "Upload Resume (PDF Only, Max 5MB)"}
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-amber-500 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setSelectedResumeFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Supported format: Standard Adobe PDF document (.pdf). Max file size: 5 MB.
              </p>
            </div>

            {selectedResumeFile && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <span className="font-semibold text-amber-900 truncate">
                  Ready to upload: {selectedResumeFile.name} ({(selectedResumeFile.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="submit"
                  disabled={uploadingResume}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shrink-0 disabled:opacity-50"
                >
                  {uploadingResume ? "Uploading..." : "Save Resume"}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 5: Saved Jobs */}
      {activeTab === "saved" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Saved Job Bookmarks</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Positions you have bookmarked for future review or application.
            </p>
          </div>

          {savedJobs.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p>You haven't bookmarked any jobs yet.</p>
              <Link href="/jobs" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">
                Browse Jobs Directory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400/80 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 hover:text-amber-600">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {job.company?.name} • {job.location}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <EmploymentBadge type={job.employmentType} />
                      {job.salaryMin && job.salaryMax && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Saved {new Date(job.savedAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status History Timeline Modal */}
      {timelineModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Application Status Timeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {timelineModalApp.job?.title} ({timelineModalApp.job?.company?.name})
                </p>
              </div>
              <button onClick={() => setTimelineModalApp(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {timelineModalApp.history && timelineModalApp.history.length > 0 ? (
                timelineModalApp.history.map((hist: any, index: number) => (
                  <div key={hist.id} className="flex items-start gap-3 relative">
                    {index !== timelineModalApp.history.length - 1 && (
                      <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200" />
                    )}
                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow flex items-center justify-center text-slate-950 shrink-0 z-10 text-[9px] font-bold">
                      ✓
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={hist.toStatus} />
                        <span className="text-[10px] text-slate-400">
                          {new Date(hist.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {hist.note && <p className="text-xs text-slate-600 pt-1">{hist.note}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No status changes logged yet.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setTimelineModalApp(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
