"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, MenuItem } from "@/types/database";
import { isItemOrderable } from "@/lib/utils";

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "restaurant_cart_v1";
const TABLE_NUMBER_KEY = "restaurant_table_number";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tableNumber, setTableNumberState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(TABLE_NUMBER_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const setTableNumber = (table: string | null) => {
    setTableNumberState(table);
    if (table) {
      localStorage.setItem(TABLE_NUMBER_KEY, table);
    } else {
      localStorage.removeItem(TABLE_NUMBER_KEY);
    }
  };

  const addToCart = (menuItem: MenuItem, quantity: number = 1): boolean => {
    if (!isItemOrderable(menuItem)) {
      return false;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { menuItem, quantity }];
    });
    return true;
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.menuItem.price) || 0) * item.quantity,
    0
  );
  const total = subtotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        itemCount,
        tableNumber,
        setTableNumber,
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
