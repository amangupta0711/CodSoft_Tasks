"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Building2,
  User,
  ArrowRight,
} from "lucide-react";
import { useAuth, DEMO_CREDENTIALS } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const { login, quickLoginAs } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast("Welcome back to CareerHub!", "success");
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Redirection based on role handled in state or default
        router.push("/jobs");
      }
    } else {
      setError(res.error || "Invalid credentials");
      toast(res.error || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to CareerHub
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Select an account role or enter your credentials below
          </p>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>1-Click Demo Account Login</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => quickLoginAs("admin")}
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/80 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Admin (Eleanor)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs("recruiter1")}
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/80 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Recruiter (TechCorp)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs("seeker1")}
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/80 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Alex (Full-Stack)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs("seeker2")}
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/80 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Sarah (UX Lead)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link href="/register" className="font-bold text-amber-600 hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
