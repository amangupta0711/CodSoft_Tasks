"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "JOB_SEEKER" | "RECRUITER" | "ADMIN";
  phone?: string | null;
  avatar?: string | null;
  company?: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
  } | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  quickLoginAs: (role: "admin" | "recruiter1" | "recruiter2" | "seeker1" | "seeker2") => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
  quickLoginAs: async () => {},
});

export const DEMO_CREDENTIALS = {
  admin: { email: "admin@careerhub.com", password: "Admin@123", label: "Admin (Eleanor)" },
  recruiter1: { email: "recruiter@techcorp.com", password: "Recruiter@123", label: "TechCorp Recruiter (Marcus)" },
  recruiter2: { email: "hr@innovatelabs.io", password: "Recruiter@123", label: "InnovateLabs Recruiter (Priya)" },
  seeker1: { email: "alex.rivera@example.com", password: "Seeker@123", label: "Candidate (Alex - Full Stack)" },
  seeker2: { email: "sarah.chen@example.com", password: "Seeker@123", label: "Candidate (Sarah - UX Designer)" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }

      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const quickLoginAs = async (roleKey: keyof typeof DEMO_CREDENTIALS) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (!creds) return;
    const res = await login(creds.email, creds.password);
    if (res.success) {
      if (roleKey === "admin") {
        router.push("/dashboard/admin");
      } else if (roleKey.startsWith("recruiter")) {
        router.push("/dashboard/recruiter");
      } else {
        router.push("/dashboard/candidate");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
