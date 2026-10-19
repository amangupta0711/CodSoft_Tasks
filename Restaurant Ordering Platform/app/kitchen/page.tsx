"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChefHat,
  Clock,
  Truck,
  Store,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Flame,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface OrderItem {
  id: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  contactNumber: string;
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "READY_FOR_PICKUP"
    | "COMPLETED"
    | "CANCELLED";
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress?: string | null;
  specialInstructions?: string | null;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function KitchenDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTab, setFilterTab] = useState<"ACTIVE" | "PENDING" | "PREPARING" | "READY" | "COMPLETED">("ACTIVE");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchKitchenOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load kitchen orders", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=/kitchen");
        return;
      }
      if (user.role !== "STAFF" && user.role !== "ADMIN") {
        return;
      }
      fetchKitchenOrders();
      // Auto-poll orders every 8 seconds for real-time kitchen operations
      const timer = setInterval(() => fetchKitchenOrders(true), 8000);
      return () => clearInterval(timer);
    }
  }, [user, authLoading, router, fetchKitchenOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order status");
      }
      fetchKitchenOrders(true);
    } catch (err: any) {
      alert(err.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-amberGold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-500">Connecting to Kitchen Display System (KDS)...</p>
      </div>
    );
  }

  // Access check
  if (user && user.role !== "STAFF" && user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-stone-200 space-y-4 shadow-soft">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-forest-900">Access Restricted</h2>
          <p className="text-xs text-stone-500">
            This dashboard is reserved for kitchen staff and restaurant management.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
          >
            Switch to Staff Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filterTab === "ACTIVE") {
      return !["COMPLETED", "CANCELLED"].includes(o.status);
    }
    if (filterTab === "PENDING") {
      return o.status === "PENDING";
    }
    if (filterTab === "PREPARING") {
      return o.status === "PREPARING" || o.status === "CONFIRMED";
    }
    if (filterTab === "READY") {
      return o.status === "READY" || o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY";
    }
    if (filterTab === "COMPLETED") {
      return o.status === "COMPLETED";
    }
    return true;
  });

  const getMinutesAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    return Math.max(1, Math.floor(diffMs / (60 * 1000)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-forest-950 text-white p-6 sm:p-8 rounded-3xl border border-forest-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amberGold-500 text-forest-950 flex items-center justify-center font-bold">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Kitchen Display System (KDS)
              </h1>
              <span className="text-[10px] uppercase font-bold bg-amberGold-400/20 text-amberGold-300 px-2 py-0.5 rounded-md border border-amberGold-400/30">
                Live Station
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Logged in as: <strong className="text-stone-200">{user?.name}</strong> • Live synchronization every 8s
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchKitchenOrders()}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-800 text-stone-200 text-xs font-bold hover:bg-forest-700 transition-all border border-forest-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh KDS"}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ACTIVE", label: "Active Orders", count: orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status)).length },
            { id: "PENDING", label: "Incoming / New", count: orders.filter((o) => o.status === "PENDING").length },
            { id: "PREPARING", label: "In Kitchen Cook", count: orders.filter((o) => ["CONFIRMED", "PREPARING"].includes(o.status)).length },
            { id: "READY", label: "Ready / Dispatched", count: orders.filter((o) => ["READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"].includes(o.status)).length },
            { id: "COMPLETED", label: "Done History", count: orders.filter((o) => o.status === "COMPLETED").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                filterTab === tab.id
                  ? "bg-forest-800 text-amberGold-400 shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filterTab === tab.id
                    ? "bg-amberGold-400 text-forest-950"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredOrders.length} ticket{filteredOrders.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Orders Grid / Kanban Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 space-y-3">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-forest-900">
            No orders in this station
          </h3>
          <p className="text-xs text-stone-500">
            Kitchen queue is currently clear for the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((ord) => {
            const minutesAgo = getMinutesAgo(ord.createdAt);
            const isDelayed = minutesAgo > 25 && !["COMPLETED", "CANCELLED"].includes(ord.status);
            const isUpdating = updatingId === ord.id;

            return (
              <div
                key={ord.id}
                className={`bg-white rounded-3xl border shadow-soft flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isDelayed
                    ? "border-red-300 ring-2 ring-red-200"
                    : ord.status === "PENDING"
                    ? "border-amberGold-300 ring-2 ring-amberGold-200"
                    : "border-stone-200/80"
                }`}
              >
                {/* Order Card Top Bar */}
                <div className="p-5 border-b border-stone-100 bg-stone-50/70">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-base font-extrabold text-forest-900">
                      #{ord.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        ord.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "PENDING"
                          ? "bg-amberGold-100 text-amberGold-900 animate-pulse-subtle"
                          : ord.status === "PREPARING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-stone-800">
                      {ord.orderType === "DELIVERY" ? (
                        <>
                          <Truck className="w-3.5 h-3.5 text-forest-700" /> Delivery
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-forest-700" /> Pickup
                        </>
                      )}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        isDelayed ? "text-red-600 font-bold" : "text-stone-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {minutesAgo} min ago {isDelayed && "⚠️ Delayed"}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Preparation Items ({ord.items.reduce((s, i) => s + i.quantity, 0)})
                    </p>
                    <div className="divide-y divide-stone-100 text-sm">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-2 first:pt-0 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-forest-800 text-amberGold-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {item.quantity}×
                            </span>
                            <span className="font-bold text-stone-900">{item.itemName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions Alert */}
                  {ord.specialInstructions && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Flame className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase tracking-wider">
                          Diner Special Note:
                        </strong>
                        <span>{ord.specialInstructions}</span>
                      </div>
                    </div>
                  )}

                  {/* Customer details info */}
                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <p>
                      <strong>Diner:</strong> {ord.customerName} ({ord.contactNumber})
                    </p>
                    {ord.deliveryAddress && (
                      <p className="truncate text-stone-400 mt-0.5">
                        <strong>Address:</strong> {ord.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Stepper Buttons */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex flex-wrap gap-2">
                  {ord.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "CONFIRMED")}
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-xl bg-forest-800 text-amberGold-400 font-bold text-xs hover:bg-forest-900 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept & Confirm Order
                    </button>
                  )}

                  {ord.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "PREPARING")}
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-xl bg-amberGold-500 text-forest-950 font-bold text-xs hover:bg-amberGold-400 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <ChefHat className="w-4 h-4" />
                      Start Cooking / Preparation
                    </button>
                  )}

                  {ord.status === "PREPARING" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          ord.id,
                          ord.orderType === "DELIVERY" ? "READY" : "READY_FOR_PICKUP"
                        )
                      }
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Ready & Packed
                    </button>
                  )}

                  {ord.status === "READY" && ord.orderType === "DELIVERY" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "OUT_FOR_DELIVERY")}
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Truck className="w-4 h-4" />
                      Dispatch for Delivery
                    </button>
                  )}

                  {(ord.status === "OUT_FOR_DELIVERY" || ord.status === "READY_FOR_PICKUP") && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "COMPLETED")}
                      disabled={isUpdating}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Order Completed
                    </button>
                  )}

                  {ord.status === "COMPLETED" && (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Completed & Closed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
