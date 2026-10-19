import React from "react";
import Link from "next/link";
import { Briefcase, Heart, ShieldCheck, Database, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Career<span className="text-amber-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              CareerHub is a centralized full-stack recruitment platform connecting skilled candidates with forward-thinking enterprise teams. Built with Next.js, TypeScript, PostgreSQL, and Prisma for CodSoft Full-Stack Web Development Task 3.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-amber-300">
                <Database className="w-3.5 h-3.5 text-amber-400" /> PostgreSQL & Prisma
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Role-Based Auth
              </span>
            </div>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs?category=Engineering" className="hover:text-amber-400 transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Design" className="hover:text-amber-400 transition-colors">
                  Product & UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=DevOps" className="hover:text-amber-400 transition-colors">
                  DevOps & Cloud SRE
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Data%20%26%20AI" className="hover:text-amber-400 transition-colors">
                  Data Science & GenAI
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Product" className="hover:text-amber-400 transition-colors">
                  Product Management
                </Link>
              </li>
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-amber-400 transition-colors">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/candidate?tab=applications" className="hover:text-amber-400 transition-colors">
                  Track Applications
                </Link>
              </li>
              <li>
                <Link href="/dashboard/candidate?tab=resume" className="hover:text-amber-400 transition-colors">
                  Upload PDF Resume
                </Link>
              </li>
              <li>
                <Link href="/dashboard/candidate?tab=saved" className="hover:text-amber-400 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              For Recruiters
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard/recruiter?tab=jobs" className="hover:text-amber-400 transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter?tab=applicants" className="hover:text-amber-400 transition-colors">
                  Recruitment Pipeline
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter?tab=company" className="hover:text-amber-400 transition-colors">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Recruiter Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerHub Recruitment Platform. CodSoft Internship Task 3.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              CodSoft Full-Stack Web Development Task 3
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Session JWT & Role Guard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
