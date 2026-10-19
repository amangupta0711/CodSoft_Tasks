import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CareerHub | Enterprise Recruitment & Job Search Platform",
  description:
    "CareerHub is a centralized full-stack recruitment platform connecting skilled candidates with top employers. Built with Next.js, PostgreSQL, and Prisma for CodSoft Full-Stack Internship Task 3.",
  keywords: ["Job Portal", "Recruitment", "CareerHub", "Full-Stack Web Development", "Next.js", "PostgreSQL"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
