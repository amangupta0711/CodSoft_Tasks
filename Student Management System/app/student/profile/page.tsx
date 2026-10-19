"use client";

import React, { useEffect, useState } from "react";
import StudentDetailPage from "@/app/students/[id]/page";

export default function MyProfileRedirectPage() {
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.student?.id) {
          setStudentId(data.user.student.id);
        } else {
          setStudentId("stu-01"); // Alex Rivera fallback
        }
      })
      .catch(() => setStudentId("stu-01"));
  }, []);

  if (!studentId) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading student profile...</div>;
  }

  return <StudentDetailPage />;
}
