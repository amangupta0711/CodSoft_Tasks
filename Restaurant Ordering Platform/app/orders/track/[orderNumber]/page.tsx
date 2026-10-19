"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  Store,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

interface OrderItem {
  id: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
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
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderTrackingPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const fetchOrder = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/track/${params.orderNumber}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found");
      }
      setOrder(data.order);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.orderNumber]);

  useEffect(() => {
    fetchOrder();
    // Auto poll every 10 seconds for real-time status updates from kitchen
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setCancelLoading(true);
    setCancelMessage("");
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order");
      }
      setCancelMessage(data.message || "Order cancelled successfully");
      fetchOrder();
    } catch (err: any) {
      alert(err.message || "Could not cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500">Connecting to restaurant live tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-forest-900">Order Not Found</h2>
          <p className="text-xs text-stone-500">{error || "Please verify your order number."}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Delivery vs Pickup Status Sequence
  const deliverySteps = [
    { key: "PENDING", label: "Order Received", desc: "Awaiting kitchen confirmation" },
    { key: "CONFIRMED", label: "Confirmed", desc: "Accepted by kitchen staff" },
    { key: "PREPARING", label: "In Preparation", desc: "Chef is crafting your meal" },
    { key: "READY", label: "Ready & Packed", desc: "Food packed in thermal containers" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider on the way" },
    { key: "COMPLETED", label: "Delivered", desc: "Bon Appetit!" },
  ];

  const pickupSteps = [
    { key: "PENDING", label: "Order Received", desc: "Awaiting kitchen confirmation" },
    { key: "CONFIRMED", label: "Confirmed", desc: "Accepted by kitchen staff" },
    { key: "PREPARING", label: "In Preparation", desc: "Chef is cooking your order" },
    { key: "READY_FOR_PICKUP", label: "Ready for Pickup", desc: "Waiting for you at counter" },
    { key: "COMPLETED", label: "Picked Up", desc: "Collected by customer" },
  ];

  const activeSteps = order.orderType === "DELIVERY" ? deliverySteps : pickupSteps;
  const currentStepIndex = activeSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";
  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <button
          onClick={() => fetchOrder()}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 bg-white border border-stone-200 px-3 py-1.5 rounded-full hover:bg-stone-50 transition-all shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Updating..." : "Refresh Status"}
        </button>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {/* Main Status Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm sm:text-base font-bold text-forest-900">
                #{order.orderNumber}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  isCancelled
                    ? "bg-red-100 text-red-700"
                    : order.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amberGold-100 text-amberGold-800 animate-pulse-subtle"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>

        {/* Visual Step Timeline */}
        {isCancelled ? (
          <div className="my-8 p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2">
            <XCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-red-900">
              This order has been cancelled
            </h3>
            <p className="text-xs text-red-700">
              Cancelled before preparation. If paid online, a demo refund is automatically recorded.
            </p>
          </div>
        ) : (
          <div className="my-8">
            <div className="relative">
              {/* Desktop Progress Tracker */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {activeSteps.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? "bg-forest-800 text-amberGold-400 ring-4 ring-forest-100 shadow-sm"
                            : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-amberGold-400" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? "text-forest-900 font-extrabold"
                              : isDone
                              ? "text-stone-800"
                              : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5 hidden md:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block font-medium">Customer</span>
            <p className="font-bold text-stone-800">{order.customerName}</p>
            <p className="text-stone-500">{order.contactNumber}</p>
          </div>

          <div>
            <span className="text-stone-400 block font-medium">Delivery Type</span>
            <p className="font-bold text-stone-800 flex items-center gap-1">
              {order.orderType === "DELIVERY" ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-forest-700" /> Doorstep Delivery
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-forest-700" /> Takeaway Pickup
                </>
              )}
            </p>
            {order.deliveryAddress && (
              <p className="text-stone-500 truncate max-w-xs">{order.deliveryAddress}</p>
            )}
          </div>

          <div>
            <span className="text-stone-400 block font-medium">Payment Info</span>
            <p className="font-bold text-stone-800">{order.paymentMethod.replace(/_/g, " ")}</p>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                order.paymentStatus === "PAID"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Dishes Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest-900 border-b border-stone-100 pb-3">
          Dishes in This Order
        </h3>
        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold text-stone-900">{item.itemName}</p>
                <p className="text-xs text-stone-400">
                  {item.quantity} × ₹{item.itemPrice.toFixed(2)}
                </p>
              </div>
              <span className="font-bold text-forest-900">
                ₹{item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST Tax (5%)</span>
            <span>₹{order.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-forest-900">
            <span>Total Amount</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
