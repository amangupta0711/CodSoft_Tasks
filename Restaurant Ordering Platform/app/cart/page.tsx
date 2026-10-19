"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    orderType,
    setOrderType,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    taxAmount,
    deliveryFee,
    totalAmount,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-soft space-y-5">
          <div className="w-20 h-20 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-forest-900">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Looks like you haven&apos;t added any delicacies to your cart yet. Explore our freshly prepared menu to get started!
          </p>
          <div className="pt-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md"
            >
              Explore Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
          Your Dining Cart
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Review your chosen dishes, specify delivery or pickup, and proceed to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Order Type Toggle Header */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Select Dining Mode:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setOrderType("DELIVERY")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  orderType === "DELIVERY"
                    ? "bg-forest-800 text-amberGold-400 shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Truck className="w-4 h-4" />
                Home Delivery
              </button>
              <button
                onClick={() => setOrderType("PICKUP")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  orderType === "PICKUP"
                    ? "bg-forest-800 text-amberGold-400 shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Store className="w-4 h-4" />
                DineDesk Takeaway / Pickup
              </button>
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-soft">
            {items.map(({ dish, quantity }) => (
              <div
                key={dish.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Dish info & image */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 border flex items-center justify-center p-[1px] rounded-[2px] ${
                          dish.isVegetarian ? "border-green-600" : "border-red-600"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            dish.isVegetarian ? "bg-green-600" : "bg-red-600"
                          }`}
                        />
                      </div>
                      <h3 className="font-serif text-base font-bold text-forest-900 leading-snug">
                        {dish.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-400 font-medium">
                      ₹{dish.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center gap-2 bg-stone-100 rounded-full p-1 border border-stone-200">
                    <button
                      onClick={() => updateQuantity(dish.id, quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-forest-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(dish.id, quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-bold text-forest-900">
                      ₹{(dish.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(dish.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-2">
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-stone-400 hover:text-red-600 transition-colors"
            >
              Clear Entire Cart
            </button>
            <Link
              href="/menu"
              className="text-xs font-bold text-forest-800 hover:text-amberGold-600 transition-colors"
            >
              + Add More Dishes
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-6">
          <h2 className="font-serif text-xl font-bold text-forest-900 border-b border-stone-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Item Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span className="flex items-center gap-1">
                GST / Restaurant Tax (5%)
                <span title="Government GST on restaurant food" className="cursor-help">
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                </span>
              </span>
              <span className="font-semibold text-stone-900">₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>
                {orderType === "DELIVERY" ? "Delivery Fee" : "Takeaway / Pickup Fee"}
              </span>
              <span className="font-semibold text-stone-900">
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-lg font-bold text-forest-900 block">
                  Total Payable
                </span>
                <span className="text-[11px] text-stone-400">Inclusive of all taxes</span>
              </div>
              <span className="font-serif text-2xl font-bold text-forest-900 text-right">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-100 flex items-start gap-2.5 text-xs text-forest-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>
              Authoritative server validation applied during checkout. Your prices and dishes are protected.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
