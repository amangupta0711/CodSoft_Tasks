"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Role } from "@/lib/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: Role;
  userName?: string;
  userEmail?: string;
}

export function DashboardLayout({
  children,
  userRole = "ADMIN",
  userName = "Dr. Robert Vance",
  userEmail = "admin@edumanage.com",
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar userRole={userRole} userName={userName} userEmail={userEmail} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar userRole={userRole} userName={userName} userEmail={userEmail} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
