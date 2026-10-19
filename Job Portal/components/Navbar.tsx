"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, DEMO_CREDENTIALS } from "./AuthContext";
import {
  Briefcase,
  Search,
  Building2,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Layers,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, quickLoginAs } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "RECRUITER") return "/dashboard/recruiter";
    return "/dashboard/candidate";
  };

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.role === "ADMIN") return "Administrator";
    if (user.role === "RECRUITER") return "Recruiter";
    return "Job Seeker";
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Career<span className="text-amber-400">Hub</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
                  Recruitment SaaS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/jobs"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith("/jobs")
                    ? "bg-slate-800 text-amber-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/companies"
                    ? "bg-slate-800 text-amber-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Companies
              </Link>
              <Link
                href={user?.role === "RECRUITER" ? "/dashboard/recruiter" : "/register?role=recruiter"}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                For Employers
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Instant 1-Click Role Switcher for Demonstration"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 text-xs z-50 divide-y divide-slate-800"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Sign-In
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        quickLoginAs("admin");
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="font-semibold text-white">Administrator</p>
                          <p className="text-[10px] text-slate-400">admin@careerhub.com</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded">Admin</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs("recruiter1");
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="font-semibold text-white">TechCorp Recruiter</p>
                          <p className="text-[10px] text-slate-400">recruiter@techcorp.com</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">Recruiter</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs("seeker1");
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-semibold text-white">Alex Rivera (Candidate)</p>
                          <p className="text-[10px] text-slate-400">alex.rivera@example.com</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">Seeker</span>
                    </button>

                    <button
                      onClick={() => {
                        quickLoginAs("seeker2");
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="font-semibold text-white">Sarah Chen (Designer)</p>
                          <p className="text-[10px] text-slate-400">sarah.chen@example.com</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">Seeker</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated vs Guest State */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardLink()}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Dashboard</span>
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                      <p className="text-[10px] text-amber-400 leading-tight">{getRoleLabel()}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-sm z-50 divide-y divide-slate-800"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2.5">
                        <p className="font-semibold text-white text-xs">{user.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>My Dashboard</span>
                        </Link>
                        {user.role === "JOB_SEEKER" && (
                          <Link
                            href="/dashboard/candidate?tab=profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:shadow-amber-500/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Companies
          </Link>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 bg-slate-800"
              >
                Go to Dashboard ({getRoleLabel()})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-rose-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg bg-slate-800 text-white font-medium"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold"
              >
                Create Free Account
              </Link>
            </div>
          )}

          {/* Quick Demo Switcher inside mobile */}
          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs uppercase font-semibold text-slate-400 px-3 mb-2">Instant Demo Sign-in</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  quickLoginAs("admin");
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 text-left bg-slate-800 rounded-lg text-xs text-purple-300"
              >
                Admin (Eleanor)
              </button>
              <button
                onClick={() => {
                  quickLoginAs("recruiter1");
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 text-left bg-slate-800 rounded-lg text-xs text-blue-300"
              >
                Recruiter (TechCorp)
              </button>
              <button
                onClick={() => {
                  quickLoginAs("seeker1");
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 text-left bg-slate-800 rounded-lg text-xs text-emerald-300"
              >
                Seeker (Alex)
              </button>
              <button
                onClick={() => {
                  quickLoginAs("seeker2");
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 text-left bg-slate-800 rounded-lg text-xs text-amber-300"
              >
                Seeker (Sarah)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
