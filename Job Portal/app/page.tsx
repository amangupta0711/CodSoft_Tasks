"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code,
  Palette,
  Server,
  Cpu,
  BarChart3,
  Megaphone,
  Sparkles,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { StatusBadge, EmploymentBadge, ArrangementBadge } from "@/components/Badge";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setFeaturedJobs(data.jobs.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load featured jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  const categories = [
    { name: "Engineering", icon: Code, count: "6 Active Roles", desc: "Full-Stack, Backend, Distributed Systems" },
    { name: "Design", icon: Palette, count: "2 Active Roles", desc: "Product Design, UI/UX, Design Systems" },
    { name: "DevOps", icon: Server, count: "3 Active Roles", desc: "Kubernetes, Cloud Infrastructure, CI/CD" },
    { name: "Data & AI", icon: Cpu, count: "2 Active Roles", desc: "GenAI, LLMs, Machine Learning, Analytics" },
    { name: "Product", icon: BarChart3, count: "2 Active Roles", desc: "Technical PM, Strategy, Agile Growth" },
    { name: "Marketing", icon: Megaphone, count: "1 Active Role", desc: "Growth Marketing, Developer Relations" },
  ];

  const featuredCompanies = [
    {
      name: "TechCorp Global",
      industry: "Enterprise Cloud & AI",
      location: "Bengaluru, India",
      jobs: "3 Openings",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "InnovateLabs AI",
      industry: "Multimodal AI Products",
      location: "Mumbai, India",
      jobs: "2 Openings",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "CloudScale Systems",
      industry: "Kubernetes & Telemetry",
      location: "Hyderabad / Remote",
      jobs: "2 Openings",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "NexaFin Solutions",
      industry: "Fintech & High-Volume Rails",
      location: "Bengaluru, India",
      jobs: "2 Openings",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CodSoft Full-Stack Web Development • Task 3</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
              Find the Role That Moves Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Career Forward
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              A centralized recruitment workflow connecting ambitious job seekers with leading technology employers. Featuring verified listings, secure resume vaults, and live application pipeline tracking.
            </p>

            {/* Interactive Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-2.5 sm:p-3 bg-slate-950/90 rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto backdrop-blur"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <Search className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or skills (e.g. Next.js, UX, DevOps)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </button>
            </form>

            {/* Quick Metrics Bar */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60">
                <p className="text-xl sm:text-2xl font-black text-amber-400">100%</p>
                <p className="text-xs text-slate-400">PostgreSQL Relational DB</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60">
                <p className="text-xl sm:text-2xl font-black text-white">3 Roles</p>
                <p className="text-xs text-slate-400">Seeker, Recruiter, Admin</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60">
                <p className="text-xl sm:text-2xl font-black text-amber-400">PDF Storage</p>
                <p className="text-xs text-slate-400">Secure Resume Uploads</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60">
                <p className="text-xl sm:text-2xl font-black text-white">Live Pipeline</p>
                <p className="text-xs text-slate-400">Status History Audit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Recommended Openings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Hand-picked verified positions from top technology companies hiring right now.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-amber-600 transition-colors"
          >
            <span>View all 10+ listings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-amber-500/40 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
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
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{job.company?.name}</p>
                      </div>
                    </div>
                    <ArrangementBadge arrangement={job.workArrangement} />
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    <EmploymentBadge type={job.employmentType} />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Posted recently</span>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-amber-600"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Job Category
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse opportunities mapped to high-demand technical specializations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span className="text-amber-700">{cat.count}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Fictional Demonstration Employers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Top Hiring Organizations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sample technology employers configured for the CodSoft internship platform demo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCompanies.map((c) => (
            <div
              key={c.name}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-50">
                  <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.industry}</p>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {c.location}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">{c.jobs}</span>
                <Link
                  href={`/jobs?q=${encodeURIComponent(c.name)}`}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View Roles →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How CareerHub Works */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Frictionless Recruitment
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A transparent, two-sided workflow keeping applicants informed while empowering recruiters with pipeline oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Candidates */}
            <div className="bg-slate-950/70 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">For Job Seekers</h3>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Build a Comprehensive Profile:</strong> Add skills, education, work experience, and upload a verified PDF resume.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">1-Click Fast Apply:</strong> Apply directly with attached resume and optional cover letter. Duplicate applications are prevented.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Real-Time Status Timeline:</strong> Track stages from Applied to Under Review, Shortlisted, Interview, and Hired with timestamps.
                  </div>
                </li>
              </ul>
              <Link
                href="/register?role=seeker"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                <span>Create Candidate Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Recruiters */}
            <div className="bg-slate-950/70 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">For Recruiters</h3>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Publish Structured Jobs:</strong> Specify requirements, responsibilities, salary ranges, deadlines, and work arrangements.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Recruitment Pipeline Board:</strong> View applicants, search by skills, review profiles, and securely download private resumes.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Stage Progression & Notes:</strong> Advance candidates through interview stages, schedule interviews, and log notes with strict privacy.
                  </div>
                </li>
              </ul>
              <Link
                href="/register?role=recruiter"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs"
              >
                <span>Register as Recruiter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-800 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Accelerate Your Hiring or Job Search?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore open roles, create your candidate profile, or publish new tech positions with instant demonstration accounts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/jobs"
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 text-center shadow-lg shadow-amber-500/20"
            >
              Browse All Jobs
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-center"
            >
              Instant Demo Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
