"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  AlertCircle,
  Database,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@edumanage.com");
  const [password, setPassword] = useState("AdminPassword123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(data.redirect || "/dashboard/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "admin" | "teacher" | "student") => {
    setError(null);
    if (role === "admin") {
      setEmail("admin@edumanage.com");
      setPassword("AdminPassword123!");
    } else if (role === "teacher") {
      setEmail("teacher@edumanage.com");
      setPassword("TeacherPassword123!");
    } else {
      setEmail("student@edumanage.com");
      setPassword("StudentPassword123!");
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-navy-800/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-dropdown border border-slate-200 overflow-hidden z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="bg-navy-900 px-8 py-7 text-center border-b border-navy-800 relative">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center text-navy-950 shadow-lg mb-3">
            <GraduationCap className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">EduManage</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Student Management System</p>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-800 border border-navy-700 text-[10px] text-slate-300">
            <Database className="w-3 h-3 text-gold-400" />
            <span>PostgreSQL</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edumanage.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy-900">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo enabled</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login Quick Fillers */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Internship Demo Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="p-2 rounded-xl border border-slate-200 hover:border-navy-800 hover:bg-navy-50/50 text-[11px] font-medium text-navy-900 flex flex-col items-center gap-1 transition-all"
              >
                <Shield className="w-4 h-4 text-navy-700" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("teacher")}
                className="p-2 rounded-xl border border-slate-200 hover:border-gold-500 hover:bg-gold-50/50 text-[11px] font-medium text-navy-900 flex flex-col items-center gap-1 transition-all"
              >
                <Layers className="w-4 h-4 text-gold-600" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-[11px] font-medium text-navy-900 flex flex-col items-center gap-1 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            CodSoft Full-Stack Web Development Internship Project
          </p>
        </div>
      </div>
    </div>
  );
}
