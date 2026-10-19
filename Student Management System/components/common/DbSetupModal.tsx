"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Database, CheckCircle, AlertTriangle, Copy, Terminal, ShieldCheck } from "lucide-react";

interface DbStatus {
  provider: string;
  isLivePostgres: boolean;
  mode: string;
  url: string;
}

export function DbSetupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/database/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PostgreSQL Database Integration & Status"
      subtitle="EduManage Enterprise PostgreSQL Configuration"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Status Card */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-4 ${
            status?.isLivePostgres
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}
        >
          {status?.isLivePostgres ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-semibold text-sm">
              {status?.isLivePostgres
                ? "PostgreSQL Database Engine: Connected & Active"
                : "PostgreSQL Configured — Standby Local Persistence Active"}
            </h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {status?.isLivePostgres
                ? "Prisma ORM is executing real-time SQL queries against your live PostgreSQL database instance."
                : "The system is fully designed with Prisma & PostgreSQL. Because a local PostgreSQL server was not yet running on port 5432, EduManage seamlessly activated its file-backed persistence store (.data/edumanage-db.json) so all your CRUD operations, sessions, and screen-recordings work without crashing!"}
            </p>
          </div>
        </div>

        {/* Database URL & Schema Info */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500">
            <span>DATABASE_URL (prisma/schema.prisma)</span>
            <span className="text-navy-700 font-mono">provider = &quot;postgresql&quot;</span>
          </div>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 overflow-x-auto">
            <span>{status?.url || "postgresql://postgres:postgres@localhost:5432/edumanage?schema=public"}</span>
            <button
              onClick={() =>
                copyToClipboard(
                  status?.url || "postgresql://postgres:postgres@localhost:5432/edumanage?schema=public",
                  "db_url"
                )
              }
              className="text-slate-400 hover:text-navy-900 ml-2"
              title="Copy Database URL"
            >
              {copied === "db_url" ? <span className="text-emerald-600 font-sans">Copied!</span> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Setup Options */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gold-500" />
            Quick Setup Options for PostgreSQL
          </h5>

          {/* Option A: Docker */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-navy-900">
              <span>Option A: Start PostgreSQL via Docker (Fastest)</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    "docker run --name edumanage-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edumanage -p 5432:5432 -d postgres:16-alpine",
                    "docker"
                  )
                }
                className="text-xs text-navy-600 hover:text-navy-900 font-normal flex items-center gap-1"
              >
                {copied === "docker" ? "Copied!" : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <code className="block bg-slate-900 text-emerald-400 p-2 rounded text-[11px] overflow-x-auto font-mono">
              docker run --name edumanage-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edumanage -p 5432:5432 -d postgres:16-alpine
            </code>
          </div>

          {/* Option B: Windows Native Installer */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="font-semibold text-navy-900 block">Option B: Windows PostgreSQL Installer / Supabase / Neon</span>
            <p className="text-slate-600 text-[11px]">
              Install PostgreSQL from <span className="font-mono text-navy-700">postgresql.org/download/windows</span> or paste your remote PostgreSQL connection string into <span className="font-mono text-navy-700">.env</span>.
            </p>
          </div>

          {/* Migration & Seed Commands */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <span className="font-semibold text-navy-900 block">Run Prisma Migrations & Seed Script:</span>
            <code className="block bg-slate-900 text-slate-200 p-2 rounded text-[11px] overflow-x-auto font-mono">
              npx prisma db push && npm run prisma:seed
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ACID compliant relational schema</span>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors"
          >
            {loading ? "Re-checking..." : "Re-check PostgreSQL"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
