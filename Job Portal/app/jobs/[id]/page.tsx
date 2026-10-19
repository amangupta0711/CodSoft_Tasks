"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  IndianRupee,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  FileText,
  Upload,
  Globe,
  Users,
  ShieldAlert,
} from "lucide-react";
import { StatusBadge, EmploymentBadge, ArrangementBadge } from "@/components/Badge";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);

  // Application modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data.job);
          setIsSaved(data.job.isSaved || false);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Load job detail error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadJob();
    }
  }, [params.id]);

  useEffect(() => {
    if (user && user.role === "JOB_SEEKER") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) setCandidateProfile(data.profile);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleToggleSave = async () => {
    if (!user) {
      toast("Please log in to save this job", "info");
      router.push("/login");
      return;
    }
    if (user.role !== "JOB_SEEKER") {
      toast("Only candidates can bookmark jobs", "error");
      return;
    }
    try {
      const res = await fetch(`/api/jobs/${params.id}/save`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.isSaved);
        toast(data.message, "success");
      }
    } catch {
      toast("Failed to update bookmark", "error");
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/jobs/${params.id}`);
      return;
    }

    if (!candidateProfile?.resumePath) {
      toast("Please upload a PDF resume before submitting your application.", "error");
      router.push("/dashboard/candidate?tab=resume");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${params.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Failed to submit application", "error");
      } else {
        toast("Application submitted successfully!", "success");
        setApplyModalOpen(false);
        // Refresh job details
        setJob((prev: any) => ({
          ...prev,
          hasApplied: true,
          userApplication: data.application,
        }));
      }
    } catch {
      toast("An error occurred submitting application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Job Listing Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested job position does not exist or has been removed by the employer.
        </p>
        <Link
          href="/jobs"
          className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Jobs Directory
        </Link>
      </div>
    );
  }

  const isClosed = job.status !== "PUBLISHED";
  const isDeadlinePassed = job.deadline ? new Date(job.deadline) < new Date() : false;
  const canApply = !isClosed && !isDeadlinePassed && !job.hasApplied;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to all jobs</span>
      </Link>

      {/* Expiration Banner if closed */}
      {(isClosed || isDeadlinePassed) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs sm:text-sm">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Notice:</strong> This job posting is currently closed and no longer accepting applications.
          </div>
        </div>
      )}

      {/* Job Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-900 font-semibold">{job.company?.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-2xl border transition-colors ${
                isSaved
                  ? "bg-amber-50 border-amber-300 text-amber-600"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
              }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
            </button>

            {job.hasApplied ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted</span>
              </div>
            ) : user && user.role === "RECRUITER" ? (
              <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 text-xs font-semibold">
                Recruiter View
              </div>
            ) : canApply ? (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                Apply Now
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed"
              >
                Applications Closed
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Work Arrangement</span>
            <div className="mt-1">
              <ArrangementBadge arrangement={job.workArrangement} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Employment Type</span>
            <div className="mt-1">
              <EmploymentBadge type={job.employmentType} />
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Experience Level</span>
            <p className="mt-1 font-semibold text-slate-800">{job.experienceLevel.replace("_", " ")}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Salary Range</span>
            <p className="mt-1 font-bold text-amber-700">
              {job.salaryMin && job.salaryMax
                ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L / year`
                : "Not disclosed"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Description + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About the Role */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About the Position
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            {/* Responsibilities */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Responsibilities
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {job.responsibilities}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Candidate Requirements
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {job.requirements}
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Target Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(",").map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Company Card & Deadline info */}
        <div className="space-y-6">
          {/* Company Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              About the Company
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{job.company?.name}</h4>
                <p className="text-xs text-slate-500">{job.company?.industry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {job.company?.description}
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              {job.company?.size && (
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company Size: {job.company.size}</span>
                </div>
              )}
              {job.company?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 hover:underline truncate"
                  >
                    {job.company.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Hiring Timeline card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Application Deadline
            </h3>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Open until filled"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Applications are reviewed on a rolling basis. Early submissions are prioritized for interview rounds.
            </p>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Apply for Position</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {job.title} at {job.company?.name}
                </p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Candidate Resume check */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Attached Resume
              </span>
              {candidateProfile?.resumePath ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>{candidateProfile.resumeOriginalName || "Candidate_Resume.pdf"}</span>
                  </div>
                  <Link
                    href="/dashboard/candidate?tab=resume"
                    className="text-[11px] font-bold text-amber-600 hover:underline"
                  >
                    Change Resume
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-rose-600 font-medium">
                    No resume found in your profile. A PDF resume is required to apply.
                  </p>
                  <Link
                    href="/dashboard/candidate?tab=resume"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Resume Now</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Optional Cover Letter */}
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Cover Letter / Note to Recruiter (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself and explain why your technical experience makes you an excellent fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !candidateProfile?.resumePath}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
