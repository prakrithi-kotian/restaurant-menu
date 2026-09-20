"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { ShoppingBag, Search, MapPin, Phone, Truck } from "lucide-react";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

export function CustomerHeader({ searchQuery = "", onSearchChange, showSearch = true }: HeaderProps) {
  const { itemCount, tableNumber } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-xs transition-all">
      {/* Free Delivery Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center gap-1.5 border-b border-emerald-800">
        <Truck className="w-3.5 h-3.5 text-emerald-300" />
        <span>FREE DELIVERY ON ORDERS ABOVE ₹500</span>
        <span className="hidden sm:inline text-emerald-400 font-normal">| Call: +91 83569 28612</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <Link href="/menu" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] shrink-0 rounded-xl overflow-hidden shadow-md shadow-red-900/10 group-hover:scale-105 transition-transform bg-white/5">
              <Image
                src="/images/logo.png"
                alt="Udupi Lunch Home"
                width={60}
                height={60}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground font-heading leading-tight">
                  UDUPI LUNCH HOME
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 shrink-0">
                  NON VEG
                </span>
                {tableNumber && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30 shrink-0">
                    <MapPin className="w-3 h-3 text-red-600" />
                    Table #{tableNumber}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-medium hidden xs:block sm:block">
                Authentic Mangalorean & Udupi Cuisine • Goregaon West, Mumbai
              </p>
            </div>
          </Link>

          {/* Phone & Cart Actions */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+918356928612"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-foreground text-xs font-bold border border-border/80 hover:bg-accent transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>+91 83569 28612</span>
            </a>

            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Cart</span>
              {itemCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-red-950 text-xs font-black shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Input */}
        {showSearch && onSearchChange && (
          <div className="mt-2.5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes, biryani, thali, kabab..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/70 border border-border/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-800/30 focus:border-red-800 transition-all placeholder:text-muted-foreground/70"
            />
          </div>
        )}
      </div>
    </header>
  );
}
