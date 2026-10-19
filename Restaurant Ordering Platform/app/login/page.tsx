"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to sign in");
      return;
    }

    // Role-based smart redirection
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (res.role === "ADMIN") {
      router.push("/admin");
    } else if (res.role === "STAFF") {
      router.push("/kitchen");
    } else {
      router.push("/menu");
    }
  };

  // 1-Click Demo Login
  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setLoading(true);

    const res = await login(demoEmail, demoPass);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Demo login failed");
      return;
    }

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (res.role === "ADMIN") {
      router.push("/admin");
    } else if (res.role === "STAFF") {
      router.push("/kitchen");
    } else {
      router.push("/menu");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-forest-800 text-amberGold-400 flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest-900">
          Welcome to DineDesk
        </h1>
        <p className="text-xs text-stone-500">
          Sign in to access your dining portal, track orders, or manage operations.
        </p>
      </div>

      {/* 1-CLICK DEMO ACCOUNTS BADGE */}
      <div className="bg-amberGold-50/70 border border-amberGold-200/80 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amberGold-800 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amberGold-600" />
          1-Click Demo Testing Accounts
        </div>
        <p className="text-[11px] text-stone-600">
          Tap any demo role below to sign in instantly with seeded credentials:
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemoLogin("customer@dinedesk.com", "Customer@123")}
            className="p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-forest-700 hover:bg-forest-50/50 transition-all text-center group shadow-2xs"
          >
            <User className="w-4 h-4 text-forest-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-bold text-forest-950">Customer</span>
            <span className="block text-[9px] text-stone-400">Ananya</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("kitchen@dinedesk.com", "Kitchen@123")}
            className="p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-amberGold-600 hover:bg-amberGold-50/50 transition-all text-center group shadow-2xs"
          >
            <ChefHat className="w-4 h-4 text-amberGold-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-bold text-amberGold-900">Kitchen</span>
            <span className="block text-[9px] text-stone-400">Chef Vikram</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("admin@dinedesk.com", "Admin@123")}
            className="p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 transition-all text-center group shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-bold text-emerald-950">Admin</span>
            <span className="block text-[9px] text-stone-400">Rajesh</span>
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. customer@dinedesk.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs sm:text-sm hover:bg-forest-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to DineDesk"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-forest-800 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading sign in...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
