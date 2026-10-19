"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  UtensilsCrossed,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  ChefHat,
  ShieldCheck,
  CalendarCheck,
  Clock,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservations", label: "Reservations" },
    { href: "/orders", label: "My Orders" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-forest-800 text-amberGold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-forest-900">
                  Dine<span className="text-amberGold-600">Desk</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-forest-50 text-forest-700 px-1.5 py-0.5 rounded border border-forest-200">
                  Bistrot
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Fresh Flavours & Artisanal Dining
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-forest-800 text-white shadow-sm"
                      : "text-stone-700 hover:text-forest-800 hover:bg-stone-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Role-Specific Direct Navigation */}
            {user?.role === "STAFF" && (
              <Link
                href="/kitchen"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  pathname.startsWith("/kitchen")
                    ? "bg-amberGold-600 text-white"
                    : "bg-amberGold-50 text-amberGold-700 border border-amberGold-200 hover:bg-amberGold-100"
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                Kitchen Display
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <div className="flex items-center gap-1 ml-1">
                <Link
                  href="/kitchen"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100"
                  title="Kitchen View"
                >
                  <ChefHat className="w-3.5 h-3.5 text-stone-500" />
                  Kitchen
                </Link>
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-forest-800 text-white"
                      : "bg-forest-50 text-forest-800 border border-forest-200 hover:bg-forest-100"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Admin
                </Link>
              </div>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-stone-100 text-forest-800 hover:bg-stone-200 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amberGold-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow animate-pulse-subtle">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 hover:bg-forest-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-forest-900 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-amberGold-700 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <Clock className="w-4 h-4 text-stone-400" />
                        My Order History
                      </Link>
                      <Link
                        href="/reservations"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <CalendarCheck className="w-4 h-4 text-stone-400" />
                        My Reservations
                      </Link>

                      {(user.role === "STAFF" || user.role === "ADMIN") && (
                        <Link
                          href="/kitchen"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-amberGold-700 hover:bg-amberGold-50 font-medium"
                        >
                          <ChefHat className="w-4 h-4" />
                          Kitchen Dashboard
                        </Link>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-forest-800 hover:bg-forest-50 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Administrator Portal
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-forest-800 text-amberGold-400 hover:bg-forest-900 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.href)
                  ? "bg-forest-800 text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user?.role === "STAFF" && (
            <Link
              href="/kitchen"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-amberGold-800 bg-amberGold-50"
            >
              <ChefHat className="w-5 h-5 text-amberGold-600" />
              Kitchen Operations
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-amberGold-800 bg-amberGold-50"
              >
                <ChefHat className="w-5 h-5 text-amberGold-600" />
                Kitchen Operations
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold text-forest-900 bg-forest-50"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Administrator Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
