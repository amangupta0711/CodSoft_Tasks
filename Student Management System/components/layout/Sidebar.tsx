"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck2,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  BookMarked,
  User,
} from "lucide-react";
import { Role } from "@/lib/types";

interface SidebarProps {
  userRole?: Role;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userRole = "ADMIN", userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  // Define links based on user role
  const getNavLinks = () => {
    if (userRole === "TEACHER") {
      return [
        { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
        { href: "/teacher/classes", label: "My Classes", icon: BookOpen },
        { href: "/attendance", label: "Mark Attendance", icon: CalendarCheck2 },
        { href: "/examinations", label: "Enter Marks", icon: FileSpreadsheet },
      ];
    }

    if (userRole === "STUDENT") {
      return [
        { href: "/dashboard/student", label: "Student Portal", icon: LayoutDashboard },
        { href: "/student/profile", label: "My Profile", icon: User },
        { href: "/attendance", label: "My Attendance", icon: CalendarCheck2 },
        { href: "/examinations", label: "Academic Results", icon: Award },
        { href: "/fees", label: "My Fee Dues", icon: Receipt },
      ];
    }

    // Default: ADMIN
    return [
      { href: "/dashboard/admin", label: "Admin Dashboard", icon: LayoutDashboard },
      { href: "/students", label: "Students", icon: Users },
      { href: "/teachers", label: "Teachers", icon: UserCheck },
      { href: "/classes", label: "Classes & Subjects", icon: BookOpen },
      { href: "/attendance", label: "Attendance", icon: CalendarCheck2 },
      { href: "/examinations", label: "Exams & Results", icon: FileSpreadsheet },
      { href: "/fees", label: "Fee Management", icon: Receipt },
      { href: "/reports", label: "Reports & Analytics", icon: BarChart3 },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-navy-950 text-slate-300 border-r border-navy-800 transition-all duration-300 ease-in-out z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-navy-800/80">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-md flex-shrink-0">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
                EduManage
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded border border-gold-500/30">
                  Pro
                </span>
              </span>
              <span className="text-[11px] text-slate-400 tracking-wide font-normal">Education SaaS</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Banner */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-navy-900/90 border border-navy-800/60 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-navy-800 text-gold-400">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Access Level</span>
            <span className="text-xs font-semibold text-white truncate">
              {userRole === "ADMIN" ? "Administrator" : userRole === "TEACHER" ? "Faculty Teacher" : "Enrolled Student"}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-navy-800 text-gold-400 font-semibold shadow-sm border border-navy-700/60"
                  : "text-slate-300 hover:bg-navy-900/80 hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gold-400" : "text-slate-400"}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-900/40">
        <div className="flex items-center justify-between gap-2">
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">{userName || "Demo User"}</span>
              <span className="text-[11px] text-slate-400 truncate">{userEmail || "user@edumanage.com"}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors flex-shrink-0"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
