"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getMenuItemById, getMenuItems } from "@/lib/queries/menu";
import { MenuItem } from "@/types/database";
import { formatPrice, isItemOrderable } from "@/lib/utils";
import { CustomerHeader } from "@/components/customer/Header";
import { AvailabilityBadge } from "@/components/customer/AvailabilityBadge";
import { CustomerFooter } from "@/components/customer/Footer";
import { MenuCard } from "@/components/customer/MenuCard";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Clock, Flame, Plus, Minus, Check, ShoppingBag, Sparkles } from "lucide-react";

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const supabase = createClient();
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      const [data, allItems] = await Promise.all([
        getMenuItemById(supabase, resolvedParams.id),
        getMenuItems(supabase),
      ]);

      if (isMounted) {
        setItem(data);
        if (data) {
          const related = allItems.filter(
            (i) => i.id !== data.id && i.category_id === data.category_id
          ).slice(0, 3);
          setRelatedItems(related);
        }
        setLoading(false);
      }
    }
    loadItem();
    return () => {
      isMounted = false;
    };
  }, [supabase, resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader showSearch={false} />
        <div className="max-w-xl mx-auto px-4 py-8 animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-2xl w-full" />
          <div className="h-8 bg-muted rounded-xl w-3/4" />
          <div className="h-20 bg-muted rounded-xl w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <CustomerHeader showSearch={false} />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Item Not Found</h2>
          <p className="text-xs text-muted-foreground mb-6">
            The dish you are looking for may have been removed or updated.
          </p>
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl bg-red-800 text-white font-bold text-xs inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </Link>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  const orderable = isItemOrderable(item);
  const defaultImage =
    item.image_url ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";

  const handleAddToCart = () => {
    if (!orderable) return;
    const success = addToCart(item, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <CustomerHeader showSearch={false} />

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Back Link */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Udupi Lunch Home Menu
          </Link>

          <div className="rounded-3xl bg-card border border-border/70 overflow-hidden shadow-sm space-y-0">
            {/* Main Image */}
            <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
              <Image src={defaultImage} alt={item.name} fill className="object-cover" priority />
              {item.is_trending && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-amber-950 shadow-md uppercase">
                  <Flame className="w-4 h-4 fill-current text-red-700" />
                  Trending
                </span>
              )}
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider">
                    {item.category?.name || "Speciality"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading mt-0.5">
                    {item.name}
                  </h1>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-foreground font-heading">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AvailabilityBadge item={item} />
                {item.preparation_time && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-bold px-2.5 py-1 rounded-full bg-muted">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Prep time: {item.preparation_time} min
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {item.description || "Authentic coastal Udupi recipe prepared fresh to order."}
              </p>

              {/* Quantity Selector & Add Button */}
              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-foreground">Quantity:</span>
                  <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !orderable}
                      className="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-black text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!orderable}
                      className="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!orderable}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    !orderable
                      ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                      : added
                      ? "bg-emerald-700 text-white shadow-emerald-700/20"
                      : "bg-red-800 hover:bg-red-900 text-white shadow-red-900/20 active:scale-95"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Order
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Order ({formatPrice(item.price * quantity)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          {relatedItems.length > 0 && (
            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-lg font-black uppercase text-foreground">You May Also Like</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedItems.map((rel) => (
                  <MenuCard key={rel.id} item={rel} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <CustomerFooter />
    </div>
  );
}
