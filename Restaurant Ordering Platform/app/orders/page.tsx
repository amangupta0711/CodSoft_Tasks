"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  Truck,
  Store,
  RefreshCw,
  Search,
  Lock,
} from "lucide-react";

interface OrderItem {
  id: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [trackNumberQuery, setTrackNumberQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-stone-200 space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-800 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-900">
            Sign In to View Orders
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Please log in to your account to review active orders, receipts, and dining history.
          </p>
          <div className="pt-2">
            <Link
              href="/login?redirect=/orders"
              className="inline-block px-8 py-3 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs hover:bg-forest-900 transition-all shadow"
            >
              Sign In to DineDesk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : filterStatus === "ACTIVE"
      ? orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status))
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Lookup */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700">
            Dining History
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track active deliveries, inspect kitchen progress, and download receipts.
          </p>
        </div>

        {/* Quick Order Number Tracker Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track # (e.g. ORD-20261017-...)"
              value={trackNumberQuery}
              onChange={(e) => setTrackNumberQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-full bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-forest-700"
            />
          </div>
          {trackNumberQuery.trim() && (
            <Link
              href={`/orders/track/${trackNumberQuery.trim().toUpperCase()}`}
              className="px-4 py-2 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
            >
              Track
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "ACTIVE", label: "Active Orders" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? "bg-forest-800 text-amberGold-400 shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchOrders}
          className="p-1.5 rounded-full text-stone-500 hover:text-forest-900 transition-colors"
          title="Refresh orders list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-forest-900">No orders found</h3>
          <p className="text-xs text-stone-500">
            You don&apos;t have any orders matching the &ldquo;{filterStatus}&rdquo; filter.
          </p>
          <Link
            href="/menu"
            className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-forest-900">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      order.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.status === "CANCELLED"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amberGold-50 text-amberGold-800 border border-amberGold-200 animate-pulse-subtle"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded">
                    {order.orderType === "DELIVERY" ? (
                      <>
                        <Truck className="w-3 h-3 text-stone-600" /> Delivery
                      </>
                    ) : (
                      <>
                        <Store className="w-3 h-3 text-stone-600" /> Takeaway
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xs text-stone-500">
                  <p>
                    {order.items.map((i) => `${i.quantity}× ${i.itemName}`).join(", ")}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-stone-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-stone-400 block font-medium">Total</span>
                  <span className="font-bold text-base text-forest-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <Link
                  href={`/orders/track/${order.orderNumber}`}
                  className="px-5 py-2.5 rounded-full bg-forest-800 text-amberGold-400 hover:bg-forest-900 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Track Live <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
