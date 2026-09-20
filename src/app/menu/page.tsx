"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { Category, MenuItem, MostOrderedItem } from "@/types/database";
import { getCategories } from "@/lib/queries/categories";
import { getMenuItems, getMostOrderedMenuItems } from "@/lib/queries/menu";
import { CustomerHeader } from "@/components/customer/Header";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { TrendingSection } from "@/components/customer/TrendingSection";
import { MostOrderedSection } from "@/components/customer/MostOrderedSection";
import { MenuCard } from "@/components/customer/MenuCard";
import { CustomerFooter } from "@/components/customer/Footer";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

function MenuContent() {
  const searchParams = useSearchParams();
  const { setTableNumber, itemCount, subtotal } = useCart();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mostOrdered, setMostOrdered] = useState<MostOrderedItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Capture table query param if present
  useEffect(() => {
    const tableParam = searchParams.get("table");
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams, setTableNumber]);

  // Realtime refetch callback (used only by the subscription, not called directly in an effect)
  const fetchData = useCallback(async () => {
    try {
      const [cats, items, popular] = await Promise.all([
        getCategories(supabase),
        getMenuItems(supabase),
        getMostOrderedMenuItems(supabase, 6),
      ]);
      setCategories(cats);
      setMenuItems(items);
      setMostOrdered(popular);
    } catch (err) {
      console.error("Error loading menu data:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial data load — inline async avoids react-hooks/set-state-in-effect lint error
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [cats, items, popular] = await Promise.all([
          getCategories(supabase),
          getMenuItems(supabase),
          getMostOrderedMenuItems(supabase, 6),
        ]);
        if (isMounted) {
          setCategories(cats);
          setMenuItems(items);
          setMostOrdered(popular);
        }
      } catch (err) {
        console.error("Error loading menu data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Supabase Realtime Subscription for menu_items updates
  useEffect(() => {
    const channel = supabase
      .channel("public:menu_items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData]);

  // Derived Trending items: is_trending = true, ordered by trending_order ascending
  const trendingItems = useMemo(() => {
    return menuItems
      .filter((item) => item.is_trending)
      .sort((a, b) => (a.trending_order || 99) - (b.trending_order || 99));
  }, [menuItems]);

  // Derived Filtered items by category & search query
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category?.name && item.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategoryId === null || item.category_id === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, selectedCategoryId, searchQuery]);

  // Group items by category for Full Menu view
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, { category: Category; items: MenuItem[] }>();

    categories.forEach((cat) => {
      map.set(cat.id, { category: cat, items: [] });
    });

    filteredMenuItems.forEach((item) => {
      const entry = map.get(item.category_id);
      if (entry) {
        entry.items.push(item);
      }
    });

    return Array.from(map.values()).filter((group) => group.items.length > 0);
  }, [categories, filteredMenuItems]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <CustomerHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={true}
        />

        <main className="max-w-5xl mx-auto px-4 py-4">
          {loading ? (
            <div className="space-y-6 animate-pulse py-8">
              <div className="h-8 bg-muted rounded-xl w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Category Filter Tabs */}
              <CategoryTabs
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              {/* 🔥 Trending Now Section (shows when no active category filter or search) */}
              {!selectedCategoryId && searchQuery === "" && (
                <TrendingSection items={trendingItems} />
              )}

              {/* ⭐ Most Ordered Section (shows when no active category filter or search) */}
              {!selectedCategoryId && searchQuery === "" && mostOrdered.length > 0 && (
                <MostOrderedSection items={mostOrdered} />
              )}

              {/* 📖 Full Menu Section (Grouped by Category or Filtered list) */}
              <section className="my-6">
                <div className="flex items-center justify-between gap-2 mb-4 border-b border-border/50 pb-2">
                  <h2 className="text-xl font-black tracking-tight font-heading text-foreground uppercase">
                    {selectedCategoryId
                      ? categories.find((c) => c.id === selectedCategoryId)?.name || "Category Items"
                      : searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : "Exploration Menu"}
                  </h2>
                  <span className="text-xs font-bold text-muted-foreground">
                    {filteredMenuItems.length} dishes available
                  </span>
                </div>

                {filteredMenuItems.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground rounded-2xl bg-card border border-border/60">
                    No dishes match your search or filter criteria.
                  </div>
                ) : selectedCategoryId || searchQuery !== "" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMenuItems.map((item) => (
                      <MenuCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {itemsByCategory.map(({ category, items }) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                          <h3 className="text-lg font-bold text-foreground font-heading uppercase">
                            {category.name}
                          </h3>
                          <span className="text-xs text-muted-foreground font-semibold">
                            ({items.length})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((item) => (
                            <MenuCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Sticky Bottom Cart Bar for Mobile & Desktop when items present */}
      {itemCount > 0 && (
        <div className="sticky bottom-4 z-40 px-4 max-w-lg mx-auto w-full my-4">
          <Link
            href="/cart"
            className="flex items-center justify-between p-4 rounded-2xl bg-red-800 text-white shadow-2xl shadow-red-950/40 hover:bg-red-900 transition-all border border-red-700 active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-200">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                </div>
                <div className="text-base font-black tracking-tight">{formatPrice(subtotal)}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-black text-sm text-amber-300">
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      {/* Customer Footer */}
      <CustomerFooter />
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background p-6 text-center">Loading Udupi Lunch Home menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
