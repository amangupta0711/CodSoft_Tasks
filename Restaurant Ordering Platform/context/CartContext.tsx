"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  categoryId: string;
}

export interface CartItem {
  dish: CartMenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  orderType: "DELIVERY" | "PICKUP";
  setOrderType: (type: "DELIVERY" | "PICKUP") => void;
  addItem: (dish: CartMenuItem, quantity?: number) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  removeItem: (dishId: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "dinedesk_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [items, isInitialized]);

  const addItem = (dish: CartMenuItem, quantity: number = 1) => {
    if (!dish.isAvailable) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.dish.id === dish.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { dish, quantity }];
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {}
  };

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0);
  const taxRate = 0.05; // 5% GST
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const deliveryFee = orderType === "DELIVERY" && items.length > 0 ? 40 : 0;
  const totalAmount = Math.round((subtotal + taxAmount + deliveryFee) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        setOrderType,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItemCount,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
