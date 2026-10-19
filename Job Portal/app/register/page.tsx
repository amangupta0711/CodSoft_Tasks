"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "recruiter" ? "RECRUITER" : "JOB_SEEKER";

  const { register } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState<"JOB_SEEKER" | "RECRUITER">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("Software & Cloud Computing");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      role,
      companyName: role === "RECRUITER" ? companyName : undefined,
      companyIndustry: role === "RECRUITER" ? companyIndustry : undefined,
    });
    setLoading(false);

    if (res.success) {
      toast("Account registered successfully! Welcome aboard.", "success");
      if (role === "RECRUITER") {
        router.push("/dashboard/recruiter");
      } else {
        router.push("/dashboard/candidate");
      }
    } else {
      setError(res.error || "Registration failed");
      toast(res.error || "Registration failed", "error");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create CareerHub Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join thousands of professionals and verified hiring teams
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-slate-200 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRole("JOB_SEEKER")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === "JOB_SEEKER"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>I'm a Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("RECRUITER")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === "RECRUITER"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>I'm an Employer</span>
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={role === "JOB_SEEKER" ? "e.g. Alex Rivera" : "e.g. Marcus Thorne"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <Phone className="w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Recruiter specific inputs */}
            {role === "RECRUITER" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Industry Domain
                  </label>
                  <select
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Software & Cloud Computing">Software & Cloud Computing</option>
                    <option value="Fintech & Banking">Fintech & Banking</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="HealthTech & Biotech">HealthTech & Biotech</option>
                    <option value="E-Commerce & Logistics">E-Commerce & Logistics</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500">
                <Lock className="w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min 6 characters"
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
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Registering Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-amber-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
