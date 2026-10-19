"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Table as TableIcon,
  XCircle,
  Sparkles,
  Lock,
} from "lucide-react";

interface TableOption {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
}

interface Reservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  reservationDate: string;
  timeSlot: string;
  guestCount: number;
  specialRequests?: string | null;
  status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  table?: TableOption | null;
}

export default function ReservationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"BOOK" | "MY_RESERVATIONS">("BOOK");

  // Form inputs
  const todayStr = new Date().toISOString().split("T")[0];
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservationDate, setReservationDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState("19:00");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Live available tables
  const [availableTables, setAvailableTables] = useState<TableOption[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);

  // My reservations state
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Prepopulate if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
      setCustomerPhone(user.phone || "");
    }
  }, [user]);

  // Fetch available tables whenever date, timeSlot or guestCount changes
  const fetchAvailableTables = useCallback(async () => {
    setLoadingTables(true);
    setSelectedTableId("");
    try {
      const res = await fetch(
        `/api/tables?date=${reservationDate}&timeSlot=${timeSlot}&guests=${guestCount}`
      );
      const data = await res.json();
      if (data.success) {
        setAvailableTables(data.tables);
        if (data.tables.length > 0) {
          setSelectedTableId(data.tables[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch available tables", err);
    } finally {
      setLoadingTables(false);
    }
  }, [reservationDate, timeSlot, guestCount]);

  useEffect(() => {
    fetchAvailableTables();
  }, [fetchAvailableTables]);

  // Fetch my reservations
  const fetchMyReservations = async () => {
    if (!user) return;
    setLoadingReservations(true);
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (data.success) {
        setMyReservations(data.reservations);
      }
    } catch (err) {
      console.error("Failed to load personal reservations", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    if (activeTab === "MY_RESERVATIONS" && user) {
      fetchMyReservations();
    }
  }, [activeTab, user]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedTableId) {
      setFormError("Please choose an available dining table from the list below.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        tableId: selectedTableId,
        reservationDate,
        timeSlot,
        guestCount,
        specialRequests: specialRequests || undefined,
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete reservation");
      }

      setConfirmation(data.reservation);
      fetchAvailableTables();
    } catch (err: any) {
      setFormError(err.message || "Failed to book table");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this table booking?")) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel");
      alert("Reservation cancelled successfully");
      fetchMyReservations();
    } catch (err: any) {
      alert(err.message || "Could not cancel reservation");
    }
  };

  const timeSlots = [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Fine Dining Ambience
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900">
          Table Reservations
        </h1>
        <p className="text-sm text-stone-600">
          Reserve your table with guaranteed seating and real-time conflict checking.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("BOOK")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "BOOK"
              ? "bg-forest-800 text-amberGold-400 shadow-sm"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Book a Table
        </button>
        <button
          onClick={() => setActiveTab("MY_RESERVATIONS")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "MY_RESERVATIONS"
              ? "bg-forest-800 text-amberGold-400 shadow-sm"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          My Reservations {myReservations.length > 0 && `(${myReservations.length})`}
        </button>
      </div>

      {activeTab === "BOOK" ? (
        confirmation ? (
          /* Confirmation Success Card */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-soft text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700">
                Reservation Confirmed
              </span>
              <h2 className="font-serif text-3xl font-bold text-forest-900 mt-1">
                Table Reserved Successfully!
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                We look forward to welcoming you to DineDesk Bistrot.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Booking Reference</span>
                <span className="font-mono font-bold text-forest-900">
                  {confirmation.reservationNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guest Name</span>
                <span className="font-bold text-stone-800">{confirmation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time</span>
                <span className="font-bold text-stone-800">
                  {confirmation.reservationDate} at {confirmation.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Party Size</span>
                <span className="font-bold text-stone-800">{confirmation.guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Allocated Table</span>
                <span className="font-bold text-forest-900">
                  {confirmation.table ? `${confirmation.table.tableNumber} (${confirmation.table.location})` : "Standard Dining Table"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setConfirmation(null);
                  setActiveTab("MY_RESERVATIONS");
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 text-xs font-bold"
              >
                View in My Reservations
              </button>
              <button
                onClick={() => setConfirmation(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Booking Form */
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft space-y-8"
          >
            {formError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Step 1: Party Size, Date & Time Slot */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-forest-700" />
                1. Date, Time & Guests
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700 font-medium"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700 font-medium"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Live Available Table Selection */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-forest-700" />
                  2. Choose an Available Table
                </h2>
                <span className="text-xs text-stone-500">
                  {loadingTables
                    ? "Checking conflicts..."
                    : `${availableTables.length} tables available`}
                </span>
              </div>

              {loadingTables ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  <div className="w-6 h-6 border-2 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Verifying real-time table availability...
                </div>
              ) : availableTables.length === 0 ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                  <p className="text-sm font-bold text-amber-900">
                    No tables available for this time slot
                  </p>
                  <p className="text-xs text-amber-700">
                    All tables matching {guestCount} guests are currently booked for {reservationDate} at {timeSlot}. Please try an adjacent time slot (e.g. 30 mins before or after).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {availableTables.map((tbl) => {
                    const isSelected = selectedTableId === tbl.id;
                    return (
                      <div
                        key={tbl.id}
                        onClick={() => setSelectedTableId(tbl.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-forest-800 bg-forest-50/70 shadow-sm ring-2 ring-forest-800"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-forest-900 text-sm">
                            {tbl.tableNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                            Up to {tbl.capacity} guests
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">{tbl.location}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Contact & Special Requests */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="font-serif text-lg font-bold text-forest-900">
                3. Diner Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="customer@dinedesk.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Special Requests (Celebration, high-chair, quiet seating...)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anniversary dinner, window view preferred, high chair needed..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting || availableTables.length === 0}
                className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md disabled:opacity-50"
              >
                {submitting ? "Confirming Booking..." : "Confirm Table Reservation"}
              </button>
            </div>
          </form>
        )
      ) : (
        /* My Reservations Tab */
        <div className="space-y-4">
          {!user ? (
            <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-4">
              <Lock className="w-10 h-10 text-stone-400 mx-auto" />
              <h2 className="font-serif text-xl font-bold text-forest-900">
                Sign in to view your bookings
              </h2>
              <Link
                href="/login?redirect=/reservations"
                className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
              >
                Sign In
              </Link>
            </div>
          ) : loadingReservations ? (
            <div className="text-center py-16 text-xs text-stone-400">
              <div className="w-6 h-6 border-2 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading your reservations...
            </div>
          ) : myReservations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
              <CalendarDays className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-forest-900">
                No reservations found
              </h3>
              <p className="text-xs text-stone-500">
                You haven&apos;t booked any dining tables yet.
              </p>
              <button
                onClick={() => setActiveTab("BOOK")}
                className="px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 text-xs font-bold"
              >
                Book Your First Table
              </button>
            </div>
          ) : (
            myReservations.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-forest-900">
                      #{res.reservationNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        res.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : res.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    {res.reservationDate} at {res.timeSlot} • {res.guestCount} Guests
                  </p>
                  <p className="text-xs text-stone-400">
                    Table: {res.table ? `${res.table.tableNumber} (${res.table.location})` : "Standard Dining Table"}
                  </p>
                  {res.specialRequests && (
                    <p className="text-[11px] text-amberGold-800 italic">
                      Note: &ldquo;{res.specialRequests}&rdquo;
                    </p>
                  )}
                </div>

                {res.status !== "CANCELLED" && res.status !== "COMPLETED" && (
                  <button
                    onClick={() => handleCancelReservation(res.id)}
                    className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all self-start sm:self-auto"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
