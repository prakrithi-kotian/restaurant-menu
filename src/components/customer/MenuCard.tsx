"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "@/types/database";
import { formatPrice, isItemOrderable } from "@/lib/utils";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { useCart } from "@/context/CartContext";
import { Flame, Clock, Plus, Minus, Check } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addToCart, updateQuantity, items } = useCart();
  const orderable = isItemOrderable(item);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!orderable) return;

    const success = addToCart(item, 1);
    if (success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1000);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!orderable) return;
    updateQuantity(item.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(item.id, quantityInCart - 1);
  };

  const defaultImage =
    item.image_url ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600";

  return (
    <div
      className={`group relative rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col ${
        !orderable ? "opacity-75 bg-muted/40" : ""
      }`}
    >
      {/* Image container & Badges */}
      <Link href={`/item/${item.id}`} className="block relative w-full aspect-[4/3] overflow-hidden bg-amber-950/10 rounded-t-2xl">
        <Image
          src={defaultImage}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            !orderable ? "grayscale-[30%]" : ""
          }`}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.is_trending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500 text-amber-950 shadow-md shadow-amber-500/30 tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 fill-current text-red-700" />
              Trending
            </span>
          )}
        </div>

        {/* Prep time badge */}
        {item.preparation_time && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-950/80 backdrop-blur-md text-amber-200 border border-amber-800/40">
            <Clock className="w-3 h-3 text-amber-400" />
            {item.preparation_time} min
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <Link href={`/item/${item.id}`} className="hover:text-red-800 transition-colors">
              <h3 className="font-extrabold text-base text-foreground leading-snug font-heading">
                {item.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {item.description || "Authentic Mangalorean preparation with fresh ingredients."}
          </p>

          <div className="mb-3">
            <AvailabilityBadge item={item} />
          </div>
        </div>

        {/* Price & Quantity Actions */}
        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Price</span>
            <span className="text-base font-black text-foreground">
              {formatPrice(item.price)}
            </span>
          </div>

          {!orderable ? (
            <button
              disabled
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-muted text-muted-foreground cursor-not-allowed border border-border/50"
            >
              Unavailable
            </button>
          ) : quantityInCart > 0 ? (
            <div className="inline-flex items-center rounded-xl bg-red-800 text-white p-0.5 shadow-md shadow-red-900/20">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-red-900 rounded-lg transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-black px-1">{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-red-900 rounded-lg transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
                addedAnimation
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                  : "bg-red-800 text-white hover:bg-red-900 shadow-md shadow-red-900/20"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
