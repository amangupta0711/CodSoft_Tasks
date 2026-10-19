"use client";

import React from "react";
import Image from "next/image";
import { useCart, CartMenuItem } from "@/context/CartContext";
import { Plus, Minus, Clock, Flame } from "lucide-react";

interface FoodCardProps {
  dish: CartMenuItem & { isPopular?: boolean };
  categoryName?: string;
}

export default function FoodCard({ dish, categoryName }: FoodCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.dish.id === dish.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Badges */}
      <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center p-[2px] rounded-[3px] ${
              dish.isVegetarian ? "border-green-600" : "border-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                dish.isVegetarian ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
            {dish.isVegetarian ? "Pure Veg" : "Non-Veg"}
          </span>
        </div>

        {/* Popular Tag */}
        {dish.isPopular && (
          <div className="absolute top-3 right-3 bg-amberGold-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            Chef Pick
          </div>
        )}

        {/* Prep Time */}
        <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-amberGold-400" />
          {dish.prepTimeMinutes} min
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {categoryName && (
            <p className="text-[11px] font-semibold text-amberGold-700 uppercase tracking-wider mb-1">
              {categoryName}
            </p>
          )}
          <h3 className="font-serif text-lg font-bold text-forest-900 leading-snug mb-2 group-hover:text-forest-700 transition-colors">
            {dish.name}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-4">
            {dish.description}
          </p>
        </div>

        {/* Price and Cart Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-forest-900 font-sans">
              ₹{dish.price.toFixed(2)}
            </span>
          </div>

          {!dish.isAvailable ? (
            <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          ) : currentQuantity > 0 ? (
            <div className="flex items-center gap-2 bg-forest-800 text-white rounded-full p-1 shadow-sm">
              <button
                onClick={() => updateQuantity(dish.id, currentQuantity - 1)}
                className="w-7 h-7 rounded-full bg-forest-700 hover:bg-forest-600 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold w-4 text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => addItem(dish, 1)}
                className="w-7 h-7 rounded-full bg-forest-700 hover:bg-forest-600 flex items-center justify-center transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(dish, 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-800 text-amberGold-400 text-xs font-bold hover:bg-forest-900 transition-all shadow-sm hover:shadow"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
