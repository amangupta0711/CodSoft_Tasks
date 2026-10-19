"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  Filter,
  X,
  Bookmark,
  BookmarkCheck,
  Calendar,
  IndianRupee,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { ArrangementBadge, EmploymentBadge } from "@/components/Badge";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [employmentType, setEmploymentType] = useState(searchParams.get("employmentType") || "all");
  const [workArrangement, setWorkArrangement] = useState(searchParams.get("workArrangement") || "all");
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experienceLevel") || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // If user is candidate, load their saved jobs
    if (user && user.role === "JOB_SEEKER") {
      fetch("/api/saved-jobs")
        .then((res) => res.json())
        .then((data) => {
          if (data.savedJobs) {
            setSavedJobIds(new Set(data.savedJobs.map((j: any) => j.id)));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (location.trim()) params.set("location", location.trim());
      if (category !== "all") params.set("category", category);
      if (employmentType !== "all") params.set("employmentType", employmentType);
      if (workArrangement !== "all") params.set("workArrangement", workArrangement);
      if (experienceLevel !== "all") params.set("experienceLevel", experienceLevel);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast("Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, employmentType, workArrangement, experienceLevel, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const resetFilters = () => {
    setQuery("");
    setLocation("");
    setCategory("all");
    setEmploymentType("all");
    setWorkArrangement("all");
    setExperienceLevel("all");
    setSortBy("newest");
  };

  const handleToggleSave = async (jobId: string) => {
    if (!user) {
      toast("Please log in to bookmark jobs", "info");
      router.push("/login");
      return;
    }
    if (user.role !== "JOB_SEEKER") {
      toast("Only job seekers can bookmark jobs", "error");
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (data.isSaved) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });
        toast(data.message, "success");
      }
    } catch {
      toast("Failed to update bookmark", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Top Search Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search title, skills or keywords (e.g. Next.js, Node.js, Designer)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="City, state, or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-500" />
                <span>Filters</span>
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="Engineering">Software Engineering</option>
                <option value="Design">Product & UI/UX Design</option>
                <option value="DevOps">DevOps & Cloud SRE</option>
                <option value="Data & AI">Data Science & AI</option>
                <option value="Product">Product Management</option>
                <option value="Marketing">Marketing & DevRel</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Employment Type
              </label>
              <div className="space-y-1.5 text-xs text-slate-700">
                {[
                  { id: "all", label: "All Types" },
                  { id: "FULL_TIME", label: "Full-time" },
                  { id: "PART_TIME", label: "Part-time" },
                  { id: "INTERNSHIP", label: "Internship" },
                  { id: "CONTRACT", label: "Contract" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="employmentType"
                      value={item.id}
                      checked={employmentType === item.id}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Arrangement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Work Arrangement
              </label>
              <div className="space-y-1.5 text-xs text-slate-700">
                {[
                  { id: "all", label: "All Arrangements" },
                  { id: "REMOTE", label: "Remote Only" },
                  { id: "HYBRID", label: "Hybrid" },
                  { id: "ON_SITE", label: "On-site" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="workArrangement"
                      value={item.id}
                      checked={workArrangement === item.id}
                      onChange={(e) => setWorkArrangement(e.target.value)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Experience Levels</option>
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (2-5 yrs)</option>
                <option value="SENIOR">Senior (5+ yrs)</option>
                <option value="LEAD_EXECUTIVE">Lead / Executive</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header bar with count and sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Explore Job Listings</h1>
              <p className="text-xs text-slate-500">
                Showing <strong className="text-slate-800">{jobs.length}</strong> available positions
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching jobs found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any job listings matching your specific criteria. Try clearing filters or searching for another title.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isSaved = savedJobIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/50 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {job.company?.logo ? (
                              <img
                                src={job.company.logo}
                                alt={job.company.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                              <span>{job.company?.name}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Save Bookmark button */}
                        <button
                          onClick={() => handleToggleSave(job.id)}
                          className={`p-2 rounded-xl border transition-colors shrink-0 ${
                            isSaved
                              ? "bg-amber-50 border-amber-300 text-amber-600"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700"
                          }`}
                          title={isSaved ? "Saved to bookmarks" : "Save job"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills
                          .split(",")
                          .slice(0, 5)
                          .map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & CTA */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <EmploymentBadge type={job.employmentType} />
                        <ArrangementBadge arrangement={job.workArrangement} />
                        {job.salaryMin && job.salaryMax && (
                          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
