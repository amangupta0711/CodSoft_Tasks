import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckCircle2, Clock, MapPin, ChefHat, ArrowRight, Home } from "lucide-react";

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await db.order.findByOrderNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-soft text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Thank You, {order.customerName.split(" ")[0]}!
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Your culinary order has been received by our kitchen brigade and is now being queued for preparation.
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
            <div>
              <span className="text-xs text-stone-400 block font-medium">Order Number</span>
              <span className="font-mono text-base font-bold text-forest-900">
                #{order.orderNumber}
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-stone-400 block font-medium">Payment Mode</span>
              <span className="text-xs font-bold text-stone-800 uppercase">
                {order.paymentMethod.replace(/_/g, " ")} ({order.paymentStatus})
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs sm:text-sm">
            <div className="flex items-start gap-2 text-stone-600">
              <ChefHat className="w-4 h-4 text-forest-700 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Mode:</strong> {order.orderType === "DELIVERY" ? "Doorstep Delivery" : "Restaurant Takeaway"}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex items-start gap-2 text-stone-600">
                <MapPin className="w-4 h-4 text-forest-700 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Destination:</strong> {order.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 text-stone-600">
              <Clock className="w-4 h-4 text-forest-700 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Est. Time:</strong> 30 - 45 minutes
              </span>
            </div>
          </div>

          {/* Ordered Dishes Summary */}
          <div className="pt-3 border-t border-stone-200">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Dishes Ordered
            </p>
            <div className="divide-y divide-stone-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-1.5 flex justify-between text-xs sm:text-sm">
                  <span className="text-stone-800">
                    {item.quantity}× {item.itemName}
                  </span>
                  <span className="font-semibold text-stone-900">
                    ₹{item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-forest-900">
              <span>Total Amount Paid / Due</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/orders/track/${order.orderNumber}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md flex items-center justify-center gap-2"
          >
            Track Order Status Live
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 text-stone-700 font-bold text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
