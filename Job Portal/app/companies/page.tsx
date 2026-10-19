"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, MapPin, Users, Globe, Briefcase } from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => {
        // Group by company
        const compMap: Record<string, any> = {};
        (data.jobs || []).forEach((job: any) => {
          if (job.company) {
            const id = job.companyId;
            if (!compMap[id]) {
              compMap[id] = { ...job.company, jobCount: 0 };
            }
            compMap[id].jobCount++;
          }
        });
        setCompanies(Object.values(compMap));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Featured Companies</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore enterprise employers actively hiring on CareerHub.
          <span className="ml-2 text-amber-600 font-medium">(Demo organizations for internship demonstration)</span>
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-52 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/60 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.industry}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{c.description}</p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  {c.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location}
                    </span>
                  )}
                  {c.size && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {c.size}
                    </span>
                  )}
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-amber-600 hover:underline truncate">
                      <Globe className="w-3.5 h-3.5" /> {c.website}
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700">{c.jobCount} open position{c.jobCount !== 1 ? "s" : ""}</span>
                <Link
                  href={`/jobs?q=${encodeURIComponent(c.name)}`}
                  className="text-xs font-bold text-slate-900 hover:text-amber-600"
                >
                  View Roles →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
