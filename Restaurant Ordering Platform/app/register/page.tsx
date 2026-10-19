"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UtensilsCrossed, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register({ name, email, phone, password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create account");
      return;
    }

    router.push("/menu");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-forest-800 text-amberGold-400 flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-forest-900">
          Create Customer Account
        </h1>
        <p className="text-xs text-stone-500">
          Join DineDesk to order dishes, save delivery locations, and reserve tables.
        </p>
      </div>

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
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? "Creating Account..." : "Register & Start Dining"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-forest-800 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
