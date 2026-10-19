"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FoodCard from "@/components/FoodCard";
import { Search, SlidersHorizontal, UtensilsCrossed, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  isPopular: boolean;
  categoryId: string;
  category?: Category;
}

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.append("category", selectedCategory);
        if (vegOnly) params.append("vegetarian", "true");
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        if (sortBy) params.append("sortBy", sortBy);

        const res = await fetch(`/api/menu?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
          setItems(data.items);
        }
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [selectedCategory, vegOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Authentic Culinary Creations
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900">
          Our Digital Menu
        </h1>
        <p className="text-sm text-stone-600">
          Select from our curated specialties crafted with the finest ingredients.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Butter Chicken, Pizza, Lava Cake)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all"
            />
          </div>

          {/* Vegetarian Toggle Button */}
          <div className="md:col-span-3 flex items-center">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                vegOnly
                  ? "bg-green-50 text-green-700 border-green-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border flex items-center justify-center p-[2px] rounded-[3px] ${
                  vegOnly ? "border-green-600" : "border-stone-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    vegOnly ? "bg-green-600" : "bg-transparent"
                  }`}
                />
              </div>
              Pure Vegetarian Only
            </button>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort dishes by"
              className="w-full py-2.5 px-3 rounded-full bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-forest-700 transition-all font-medium"
            >
              <option value="popularity">Sort: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-forest-800 text-amberGold-400 shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Dishes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-forest-800 text-amberGold-400 shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-80 border border-stone-200/60 p-4 animate-pulse space-y-4"
            >
              <div className="h-44 bg-stone-200 rounded-xl" />
              <div className="h-4 bg-stone-200 rounded w-2/3" />
              <div className="h-3 bg-stone-100 rounded w-full" />
              <div className="h-8 bg-stone-200 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest-900">No dishes found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            We couldn&apos;t find any dishes matching your current filter criteria. Try resetting the search or category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setVegOnly(false);
            }}
            className="px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 text-xs font-bold hover:bg-forest-900 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
            <span>Showing {items.length} dishes</span>
            <span>All prices in Indian Rupee (INR ₹)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((dish) => (
              <FoodCard
                key={dish.id}
                dish={dish}
                categoryName={dish.category?.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading digital menu...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
