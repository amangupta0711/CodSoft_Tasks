"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Truck,
  Store,
  CreditCard,
  Banknote,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    orderType,
    setOrderType,
    subtotal,
    taxAmount,
    deliveryFee,
    totalAmount,
    clearCart,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "PAY_AT_RESTAURANT" | "SIMULATED_ONLINE">("CASH_ON_DELIVERY");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Prepopulate logged-in user profile
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
      setContactNumber(user.phone || "");
      setCustomerEmail(user.email || "");
    }
  }, [user]);

  // Handle empty cart
  if (!authLoading && items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-stone-200 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-forest-900">Your cart is empty</h2>
          <p className="text-xs text-stone-500">Add dishes before proceeding to checkout.</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  // If not logged in, prompt sign in
  if (!authLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-stone-200 space-y-5 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-amberGold-50 text-amberGold-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-forest-900">
            Sign In Required to Place Order
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Please sign in to your DineDesk account (or use our instant 1-click Demo Customer login) to complete your order checkout.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/checkout"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow"
            >
              Sign In with Demo Customer
            </Link>
            <Link
              href="/cart"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200 transition-all"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const payload = {
        customerName,
        contactNumber,
        customerEmail,
        orderType,
        paymentMethod,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        specialInstructions: specialInstructions || undefined,
        items: items.map((i) => ({
          menuItemId: i.dish.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Success: clear cart and redirect to confirmation
      clearCart();
      router.push(`/orders/confirmation/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
          Checkout & Place Order
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Complete your contact information, delivery instructions and payment method.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Order placement error</p>
            <p className="text-xs">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Dining Mode */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              1. Delivery or Takeaway
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition-all ${
                  orderType === "DELIVERY"
                    ? "border-forest-800 bg-forest-50/50 shadow-xs"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  value="DELIVERY"
                  checked={orderType === "DELIVERY"}
                  onChange={() => {
                    setOrderType("DELIVERY");
                    if (paymentMethod === "PAY_AT_RESTAURANT") {
                      setPaymentMethod("CASH_ON_DELIVERY");
                    }
                  }}
                  className="w-4 h-4 text-forest-800 focus:ring-forest-700"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-forest-950">
                    <Truck className="w-4 h-4 text-forest-700" />
                    Express Home Delivery
                  </div>
                  <p className="text-xs text-stone-500">Delivered hot to your doorstep (₹40)</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition-all ${
                  orderType === "PICKUP"
                    ? "border-forest-800 bg-forest-50/50 shadow-xs"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  value="PICKUP"
                  checked={orderType === "PICKUP"}
                  onChange={() => {
                    setOrderType("PICKUP");
                    setPaymentMethod("PAY_AT_RESTAURANT");
                  }}
                  className="w-4 h-4 text-forest-800 focus:ring-forest-700"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-forest-950">
                    <Store className="w-4 h-4 text-forest-700" />
                    Restaurant Pickup / Takeaway
                  </div>
                  <p className="text-xs text-stone-500">Self pickup from DineDesk (Free)</p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Customer Contact Details */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              2. Contact & Recipient Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Phone Number (for delivery updates) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address (order receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@dinedesk.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
                />
              </div>

              {orderType === "DELIVERY" && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Complete Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="House/Flat number, Building, Street, Landmark, City & PIN code..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Kitchen / Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra mint dip, medium spice, ring bell twice..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-forest-900">
              3. Payment Method
            </h2>
            <div className="space-y-3">
              {orderType === "DELIVERY" ? (
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-forest-800 bg-forest-50/50 shadow-xs"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="w-4 h-4 text-forest-800 focus:ring-forest-700"
                    />
                    <div>
                      <p className="font-bold text-sm text-forest-950 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-forest-700" />
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-stone-500">Pay cash or UPI upon delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    Standard
                  </span>
                </label>
              ) : (
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === "PAY_AT_RESTAURANT"
                      ? "border-forest-800 bg-forest-50/50 shadow-xs"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAY_AT_RESTAURANT"
                      checked={paymentMethod === "PAY_AT_RESTAURANT"}
                      onChange={() => setPaymentMethod("PAY_AT_RESTAURANT")}
                      className="w-4 h-4 text-forest-800 focus:ring-forest-700"
                    />
                    <div>
                      <p className="font-bold text-sm text-forest-950 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-forest-700" />
                        Pay at Restaurant
                      </p>
                      <p className="text-xs text-stone-500">Pay at counter during pickup</p>
                    </div>
                  </div>
                </label>
              )}

              {/* Simulated Card / UPI Option */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "SIMULATED_ONLINE"
                    ? "border-forest-800 bg-forest-50/50 shadow-xs"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SIMULATED_ONLINE"
                    checked={paymentMethod === "SIMULATED_ONLINE"}
                    onChange={() => setPaymentMethod("SIMULATED_ONLINE")}
                    className="w-4 h-4 text-forest-800 focus:ring-forest-700"
                  />
                  <div>
                    <p className="font-bold text-sm text-forest-950 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-forest-700" />
                      Simulated Online Payment (Instant Demo)
                    </p>
                    <p className="text-xs text-stone-500">
                      Simulates instantaneous payment confirmation for evaluation and video demo
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amberGold-100 text-amberGold-800">
                  Instant Demo
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Checkout Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-6">
          <h2 className="font-serif text-xl font-bold text-forest-900 border-b border-stone-100 pb-4">
            Items in Order ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-sm divide-y divide-stone-100">
            {items.map(({ dish, quantity }) => (
              <div key={dish.id} className="pt-2 first:pt-0 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-900 text-xs sm:text-sm">{dish.name}</p>
                  <p className="text-[11px] text-stone-400">
                    {quantity} × ₹{dish.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-bold text-forest-900 text-xs sm:text-sm">
                  ₹{(dish.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600 text-xs">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600 text-xs">
              <span>GST Tax (5%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600 text-xs">
              <span>{orderType === "DELIVERY" ? "Delivery Fee" : "Pickup Fee"}</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-forest-900">Total</span>
              <span className="font-serif text-2xl font-bold text-forest-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {submitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                Confirm & Place Order
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-forest-50 text-[11px] text-forest-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Authoritative server transaction with tamper-proof pricing.</span>
          </div>
        </div>
      </form>
    </div>
  );
}
