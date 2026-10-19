"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Database,
  Calendar,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  GraduationCap,
  Shield,
  Layers,
} from "lucide-react";
import { DbSetupModal } from "@/components/common/DbSetupModal";
import { Role } from "@/lib/types";

interface NavbarProps {
  userRole?: Role;
  userName?: string;
  userEmail?: string;
  onMobileMenuToggle?: () => void;
}

export function Navbar({
  userRole = "ADMIN",
  userName = "Dr. Robert Vance",
  userEmail = "admin@edumanage.com",
}: NavbarProps) {
  const router = useRouter();
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ isLivePostgres: boolean; mode: string } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/database/status")
      .then((r) => r.json())
      .then((data) => setDbStatus(data))
      .catch(() => {});
  }, []);

  const handleQuickSwitch = async (role: Role) => {
    let email = "admin@edumanage.com";
    let password = "AdminPassword123!";

    if (role === "TEACHER") {
      email = "teacher@edumanage.com";
      password = "TeacherPassword123!";
    } else if (role === "STUDENT") {
      email = "student@edumanage.com";
      password = "StudentPassword123!";
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.redirect) {
        setProfileDropdownOpen(false);
        router.push(data.redirect);
        router.refresh();
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        {/* Left side: Mobile toggle & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200/60 text-slate-500 focus-within:border-navy-400 focus-within:bg-white transition-all w-64 lg:w-80">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search students, teachers, courses..."
              className="bg-transparent text-xs text-navy-900 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Right side: Term pill, DB status, Demo Quick Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Academic Term */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-navy-50 text-navy-800 rounded-xl border border-navy-100 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-navy-600" />
            <span>Academic Year 2024-2025</span>
          </div>

          {/* Database Status Button */}
          <button
            onClick={() => setDbModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              dbStatus?.isLivePostgres
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70"
                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70"
            }`}
            title="Click for PostgreSQL setup guide & configuration"
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                dbStatus?.isLivePostgres ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <Database className="w-3.5 h-3.5 opacity-80" />
            <span className="hidden sm:inline">
              {dbStatus?.isLivePostgres ? "PostgreSQL Active" : "PostgreSQL (Standby)"}
            </span>
          </button>

          {/* Demo Account Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-xs shadow-sm">
                {userName ? userName.charAt(0) : "U"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-navy-900 leading-tight truncate max-w-[120px]">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {userRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile & Switcher Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-dropdown border border-slate-200 p-2 z-40 animate-fade-in"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="p-3 border-b border-slate-100 bg-slate-50/60 rounded-xl mb-2">
                  <p className="text-xs font-bold text-navy-900">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-navy-900 text-gold-400">
                    {userRole} Role
                  </span>
                </div>

                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  Quick Demo Switcher
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => handleQuickSwitch("ADMIN")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      userRole === "ADMIN" ? "bg-navy-50 text-navy-900 font-semibold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-navy-700" />
                      Switch to Administrator
                    </span>
                    {userRole === "ADMIN" && <span className="w-1.5 h-1.5 rounded-full bg-navy-900" />}
                  </button>

                  <button
                    onClick={() => handleQuickSwitch("TEACHER")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      userRole === "TEACHER" ? "bg-navy-50 text-navy-900 font-semibold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gold-600" />
                      Switch to Teacher (Marcus)
                    </span>
                    {userRole === "TEACHER" && <span className="w-1.5 h-1.5 rounded-full bg-navy-900" />}
                  </button>

                  <button
                    onClick={() => handleQuickSwitch("STUDENT")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      userRole === "STUDENT" ? "bg-navy-50 text-navy-900 font-semibold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      Switch to Student (Alex)
                    </span>
                    {userRole === "STUDENT" && <span className="w-1.5 h-1.5 rounded-full bg-navy-900" />}
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm">
          <div className="w-4/5 max-w-xs h-full bg-navy-950 p-5 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 flex items-center justify-center font-bold">
                    E
                  </div>
                  <span className="font-bold text-base">EduManage Pro</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(
                      userRole === "ADMIN"
                        ? "/dashboard/admin"
                        : userRole === "TEACHER"
                        ? "/dashboard/teacher"
                        : "/dashboard/student"
                    );
                  }}
                  className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                >
                  Dashboard
                </button>
                {userRole === "ADMIN" && (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/students");
                      }}
                      className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                    >
                      Students
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/teachers");
                      }}
                      className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                    >
                      Teachers
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/classes");
                      }}
                      className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                    >
                      Classes & Subjects
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/attendance");
                  }}
                  className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                >
                  Attendance
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/examinations");
                  }}
                  className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                >
                  Exams & Results
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/fees");
                  }}
                  className="w-full text-left p-2.5 rounded-lg text-xs font-medium hover:bg-navy-900 text-slate-200"
                >
                  Fees Management
                </button>
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full p-2.5 rounded-xl bg-red-600/20 text-red-400 font-medium text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* PostgreSQL Info Modal */}
      <DbSetupModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </>
  );
}
