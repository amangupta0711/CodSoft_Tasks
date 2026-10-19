import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import FoodCard from "@/components/FoodCard";
import {
  UtensilsCrossed,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Flame,
  ChefHat,
  Truck,
  Wine,
} from "lucide-react";

export default async function HomePage() {
  const [categories, popularDishes] = await Promise.all([
    db.category.findMany(),
    db.menuItem.findMany({ sortBy: "popularity" }),
  ]);

  const featuredDishes = popularDishes.filter((d) => d.isPopular).slice(0, 4);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amberGold-600" />
                Artisanal Gastronomy & Express Table Dining
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest-950 leading-[1.15]">
                Fresh Flavours, <br className="hidden sm:inline" />
                <span className="text-forest-700 italic font-normal">Delivered to</span> Your Door.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Welcome to DineDesk — where heritage recipes meet modern culinary craft.
                Order exquisite wood-fired delicacies for direct delivery, or reserve your handcrafted table in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm hover:bg-forest-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <UtensilsCrossed className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  Browse Digital Menu
                </Link>
                <Link
                  href="/reservations"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-forest-900 font-bold text-sm border border-stone-300 hover:border-forest-700 hover:bg-stone-50 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-4 h-4 text-forest-700" />
                  Reserve a Table
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-serif text-2xl font-bold text-forest-900">4.9 ★</p>
                  <p className="text-xs text-stone-500">2,500+ Diner Reviews</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-forest-900">30 Min</p>
                  <p className="text-xs text-stone-500">Average Preparation</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-forest-900">100%</p>
                  <p className="text-xs text-stone-500">Fresh Local Produce</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                    alt="DineDesk Signature Gourmet Ribs and Grilled Feast"
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Floating Promo Card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amberGold-100 text-amberGold-700 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amberGold-700 uppercase tracking-wider">
                        Chef&apos;s Special Today
                      </p>
                      <p className="text-sm font-serif font-bold text-forest-900 leading-tight">
                        Truffle Arancini & Dal Makhani Grand Reserve
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amberGold-700 mb-1">
              <Flame className="w-4 h-4 fill-current" />
              Customer Favourites
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
              Popular Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 hover:text-amberGold-600 transition-colors"
          >
            Explore Complete Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              dish={{
                ...dish,
                isPopular: dish.isPopular ?? false,
              }}
              categoryName={dish.category?.name}
            />
          ))}
        </div>
      </section>

      {/* 3. FOOD CATEGORIES */}
      <section className="bg-forest-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amberGold-400">
              Gastronomic Variety
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Explore Our Food Categories
            </h2>
            <p className="text-sm text-stone-300 mt-2">
              From tantalizing street-style starters to hand-pulled artisan pasta and decadent sweets.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.id}`}
                className="group p-5 rounded-2xl bg-forest-800/80 border border-forest-700/60 hover:bg-forest-700/90 hover:border-amberGold-400 transition-all text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-forest-950 text-amberGold-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amberGold-500 group-hover:text-forest-950 transition-all">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amberGold-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 group-hover:text-stone-300">
                    Browse Selection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RESTAURANT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Why DineDesk
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Artisanal Dining Reimagined
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-900">
              Master Chefs & Fresh Produce
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every dish is freshly prepared to order using hand-selected organic greens, stone-ground spices, and slow-cooking techniques.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amberGold-50 text-amberGold-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-900">
              Hot & Insulated Express Delivery
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Temperature-controlled thermal packaging ensures that pizzas stay crisp and gravies stay steaming hot until they reach your dining table.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wine className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-900">
              Effortless Table Reservations
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Reserve your favourite private booth or garden courtyard view in real-time with instant booking references and guaranteed seating.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW ORDERING WORKS */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amberGold-700">
              Seamless Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
              How Ordering Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">Select Your Dishes</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Browse our categorized digital menu, filter by pure vegetarian choices, and add your favorite dishes to the cart.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">Fast & Safe Checkout</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Choose Delivery or Pickup, select Cash on Delivery or simulated card payment, and confirm your order in one click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-amberGold-400 font-bold text-sm flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-900">Live Kitchen Tracking</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Track your order in real-time as our chefs confirm, prepare and dispatch your meal directly to your location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION RESERVATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-forest-950 text-white p-8 sm:p-14 border border-forest-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amberGold-400">
              Celebrate With Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Planning a Birthday, Date Night, or Family Gathering?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Book a bespoke dining table with zero waiting time. Our concierge ensures your table is prepped with care.
            </p>
            <div className="pt-2">
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amberGold-500 text-forest-950 font-bold text-sm hover:bg-amberGold-400 transition-all shadow-lg"
              >
                <CalendarDays className="w-4 h-4" />
                Book Your Table Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
