"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DollarSign,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface StatsData {
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  completedOrders: number;
  recordedSales: number;
  upcomingReservations: number;
  totalMenuItems: number;
  popularDishes: { name: string; count: number; revenue: number }[];
  salesChartData: { date: string; orders: number; revenue: number }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "MENU" | "ORDERS" | "RESERVATIONS">("OVERVIEW");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Menu Management State
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    description: "",
    price: 350,
    categoryId: "",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
    isVegetarian: true,
    isAvailable: true,
    prepTimeMinutes: 20,
    isPopular: false,
  });

  // Orders Management State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  // Reservations Management State
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [resStatusFilter, setResStatusFilter] = useState("ALL");

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch menu items
  const fetchMenu = async () => {
    setLoadingMenu(true);
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.items);
        setCategories(data.categories);
        if (data.categories.length > 0 && !menuFormData.categoryId) {
          setMenuFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch reservations
  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=/admin");
        return;
      }
      if (user.role !== "ADMIN") {
        return;
      }
      fetchStats();
      fetchMenu();
      fetchOrders();
      fetchReservations();
    }
  }, [user, authLoading, router, fetchStats]);

  // Authorization check
  if (user && user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-stone-200 space-y-4 shadow-soft">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-forest-900">Administrator Access Only</h2>
          <p className="text-xs text-stone-500">
            You must be logged in as an administrator to view this portal.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold text-xs"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  // Handle Save Menu Item
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save item");

      setMenuModalOpen(false);
      setEditingItem(null);
      fetchMenu();
      fetchStats();
    } catch (err: any) {
      alert(err.message || "Failed to save menu dish");
    }
  };

  // Handle Delete Menu Item
  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive "${name}"? Historical orders will remain preserved.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      fetchMenu();
      fetchStats();
    } catch (err: any) {
      alert(err.message || "Could not delete dish");
    }
  };

  // Handle Toggle Availability
  const handleToggleAvailability = async (item: any) => {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (res.ok) fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Update Reservation Status
  const handleReservationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchReservations();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-forest-950 text-white p-6 sm:p-8 rounded-3xl border border-forest-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                DineDesk Administrator Portal
              </h1>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Management Station
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Logged in as Admin: <strong className="text-stone-200">{user?.name}</strong> • Real-time DB Queries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchStats();
              fetchMenu();
              fetchOrders();
              fetchReservations();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-800 text-stone-200 text-xs font-bold hover:bg-forest-700 transition-all border border-forest-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh All Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        {[
          { id: "OVERVIEW", label: "Executive Overview" },
          { id: "MENU", label: "Menu Management" },
          { id: "ORDERS", label: "All Orders" },
          { id: "RESERVATIONS", label: "Table Reservations" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-forest-800 text-amberGold-400 shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>Recorded Sales</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                ₹{stats ? stats.recordedSales.toFixed(2) : "0.00"}
              </p>
              <p className="text-[11px] text-stone-400">Paid & completed transactions</p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>Total Orders</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                {stats ? stats.totalOrders : 0}
              </p>
              <p className="text-[11px] text-stone-400">
                {stats ? stats.ordersToday : 0} placed today
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>Kitchen In-Progress</span>
                <div className="w-8 h-8 rounded-full bg-amberGold-50 text-amberGold-700 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-amberGold-700">
                {stats ? stats.pendingOrders : 0}
              </p>
              <p className="text-[11px] text-stone-400">Pending & cooking tickets</p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>Upcoming Bookings</span>
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                {stats ? stats.upcomingReservations : 0}
              </p>
              <p className="text-[11px] text-stone-400">Reserved tables for this week</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Trend Chart */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-900">
                    Sales & Revenue Trend (Past 7 Days)
                  </h3>
                  <p className="text-xs text-stone-400">
                    Daily recorded revenue generated from customer orders
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="h-72 w-full pt-4">
                {stats && stats.salesChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesChartData}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B3B2B" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#1B3B2B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, "Sales"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1B3B2B"
                        strokeWidth={2.5}
                        fill="url(#salesGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-stone-400">
                    Loading sales data...
                  </div>
                )}
              </div>
            </div>

            {/* Popular Dishes Chart */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-soft space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-900">
                  Best-Selling Dishes
                </h3>
                <p className="text-xs text-stone-400">Top ordered items by quantity</p>
              </div>

              <div className="h-72 w-full pt-4">
                {stats && stats.popularDishes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.popularDishes}
                      layout="vertical"
                      margin={{ left: 10, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip formatter={(value: any) => [`${value} sold`, "Volume"]} />
                      <Bar dataKey="count" fill="#D97706" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-stone-400">
                    No order items recorded yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT */}
      {activeTab === "MENU" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest-900">
                Menu Management
              </h2>
              <p className="text-xs text-stone-500">
                Add, edit prices, descriptions, and toggle dish availability in real-time.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setMenuFormData({
                  name: "",
                  description: "",
                  price: 350,
                  categoryId: categories[0]?.id || "",
                  imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
                  isVegetarian: true,
                  isAvailable: true,
                  prepTimeMinutes: 20,
                  isPopular: false,
                });
                setMenuModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-forest-800 text-amberGold-400 hover:bg-forest-900 font-bold text-xs transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-white" /> Add New Dish
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price (INR)</th>
                    <th className="py-3 px-4">Prep Time</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{item.name}</p>
                            <p className="text-[11px] text-stone-400 truncate max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-700">
                        {item.category?.name || "Standard"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isVegetarian
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {item.isVegetarian ? "Pure Veg" : "Non-Veg"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-forest-900 text-sm">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-stone-500 font-medium">
                        {item.prepTimeMinutes} mins
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            item.isAvailable
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                        >
                          {item.isAvailable ? "In Stock" : "Sold Out"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setMenuFormData({
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                categoryId: item.categoryId,
                                imageUrl: item.imageUrl,
                                isVegetarian: item.isVegetarian,
                                isAvailable: item.isAvailable,
                                prepTimeMinutes: item.prepTimeMinutes,
                                isPopular: item.isPopular,
                              });
                              setMenuModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-forest-800 hover:bg-stone-100"
                            title="Edit Dish"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id, item.name)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Archive Dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest-900">
                Order Management
              </h2>
              <p className="text-xs text-stone-500">
                View customer orders, verify payments, and update lifecycle statuses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order #"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-full bg-white border border-stone-200 text-xs focus:outline-none focus:border-forest-700"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                aria-label="Filter orders by status"
                className="px-3 py-2 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders
                    .filter((o) => {
                      if (orderStatusFilter !== "ALL" && o.status !== orderStatusFilter) return false;
                      if (orderSearch && !o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) return false;
                      return true;
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-forest-900">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">{ord.customerName}</p>
                          <p className="text-[11px] text-stone-400">{ord.contactNumber}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-700">
                          {ord.orderType}
                        </td>
                        <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                          {ord.items.map((i: any) => `${i.quantity}× ${i.itemName}`).join(", ")}
                        </td>
                        <td className="py-3 px-4 font-bold text-forest-900 text-sm">
                          ₹{ord.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.status}
                            aria-label={`Update status for order ${ord.orderNumber}`}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              await fetch(`/api/orders/${ord.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: newStatus }),
                              });
                              fetchOrders();
                              fetchStats();
                            }}
                            className="px-2 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/orders/track/${ord.orderNumber}`}
                            target="_blank"
                            className="text-forest-800 hover:text-amberGold-600 font-bold text-xs"
                          >
                            Track View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESERVATION MANAGEMENT */}
      {activeTab === "RESERVATIONS" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest-900">
                Reservation Management
              </h2>
              <p className="text-xs text-stone-500">
                Confirm bookings, seat arriving diners, and manage table allocation.
              </p>
            </div>

            <select
              value={resStatusFilter}
              onChange={(e) => setResStatusFilter(e.target.value)}
              aria-label="Filter reservations by status"
              className="px-3 py-2 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="ALL">All Reservations</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SEATED">Seated</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Diner Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {reservations
                    .filter((r) => resStatusFilter === "ALL" || r.status === resStatusFilter)
                    .map((res) => (
                      <tr key={res.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-forest-900">
                          #{res.reservationNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {res.customerName}
                          {res.specialRequests && (
                            <span className="block text-[10px] text-amberGold-700 italic font-normal">
                              &ldquo;{res.specialRequests}&rdquo;
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-500">
                          <p>{res.customerPhone}</p>
                          <p className="text-[10px]">{res.customerEmail}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          {res.reservationDate} at {res.timeSlot}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {res.guestCount} Guests
                        </td>
                        <td className="py-3 px-4 text-stone-700 font-medium">
                          {res.table ? `${res.table.tableNumber} (${res.table.location})` : "Standard"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              res.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : res.status === "SEATED"
                                ? "bg-blue-100 text-blue-800"
                                : res.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status === "PENDING" && (
                              <button
                                onClick={() => handleReservationStatus(res.id, "CONFIRMED")}
                                className="px-2.5 py-1 rounded bg-forest-800 text-amberGold-400 font-bold text-[10px]"
                              >
                                Confirm
                              </button>
                            )}
                            {res.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleReservationStatus(res.id, "SEATED")}
                                className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[10px]"
                              >
                                Mark Seated
                              </button>
                            )}
                            {res.status === "SEATED" && (
                              <button
                                onClick={() => handleReservationStatus(res.id, "COMPLETED")}
                                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                              >
                                Complete
                              </button>
                            )}
                            {res.status !== "CANCELLED" && res.status !== "COMPLETED" && (
                              <button
                                onClick={() => handleReservationStatus(res.id, "CANCELLED")}
                                className="px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[10px]"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MENU ITEM MODAL */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl font-bold text-forest-900">
                {editingItem ? "Edit Menu Dish" : "Create New Menu Dish"}
              </h3>
              <button
                onClick={() => setMenuModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  placeholder="e.g. Artisanal Burrata Caprese"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                  placeholder="Culinary preparation details, ingredients, textures..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="1"
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData({ ...menuFormData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-forest-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={menuFormData.categoryId}
                    onChange={(e) => setMenuFormData({ ...menuFormData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-forest-700"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Food Image URL (Unsplash or direct asset) *
                </label>
                <input
                  type="url"
                  required
                  value={menuFormData.imageUrl}
                  onChange={(e) => setMenuFormData({ ...menuFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-forest-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={menuFormData.isVegetarian}
                    onChange={(e) => setMenuFormData({ ...menuFormData, isVegetarian: e.target.checked })}
                    className="w-4 h-4 rounded text-forest-800"
                  />
                  Pure Vegetarian
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={menuFormData.isPopular}
                    onChange={(e) => setMenuFormData({ ...menuFormData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-forest-800"
                  />
                  Featured Chef Pick
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-forest-800 text-amberGold-400 font-bold hover:bg-forest-900 transition-all shadow"
                >
                  {editingItem ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
