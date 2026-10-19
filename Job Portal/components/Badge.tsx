import React from "react";

export type ApplicationStatusType =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export function StatusBadge({ status }: { status: ApplicationStatusType | string }) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    APPLIED: {
      label: "Applied",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    UNDER_REVIEW: {
      label: "Under Review",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    SHORTLISTED: {
      label: "Shortlisted",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    INTERVIEW: {
      label: "Interview",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    HIRED: {
      label: "Hired",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      label: "Not Selected",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    WITHDRAWN: {
      label: "Withdrawn",
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const current = configs[status] || {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

export function EmploymentBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {map[type] || type}
    </span>
  );
}

export function ArrangementBadge({ arrangement }: { arrangement: string }) {
  const colors: Record<string, string> = {
    REMOTE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    HYBRID: "bg-blue-50 text-blue-700 border-blue-200",
    ON_SITE: "bg-slate-50 text-slate-700 border-slate-200",
  };
  const labels: Record<string, string> = {
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    ON_SITE: "On-site",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        colors[arrangement] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {labels[arrangement] || arrangement}
    </span>
  );
}
