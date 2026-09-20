"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { AvailabilityBadge } from "../customer/AvailabilityBadge";
import { Flame, ArrowUp, ArrowDown, Check } from "lucide-react";

interface TrendingManagerProps {
  items: MenuItem[];
  onSaveTrendingOrder: (updates: { id: string; is_trending: boolean; trending_order: number }[]) => Promise<void>;
  onRefresh: () => void;
}

export function TrendingManager({ items, onSaveTrendingOrder, onRefresh }: TrendingManagerProps) {
  // Filter items into current trending and non-trending
  const [localItems, setLocalItems] = useState<MenuItem[]>(() => {
    return [...items].sort((a, b) => {
      if (a.is_trending && b.is_trending) {
        return (a.trending_order || 99) - (b.trending_order || 99);
      }
      if (a.is_trending) return -1;
      if (b.is_trending) return 1;
      return 0;
    });
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleItemTrending = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextIsTrending = !item.is_trending;
          return {
            ...item,
            is_trending: nextIsTrending,
            trending_order: nextIsTrending ? 1 : 99,
          };
        }
        return item;
      })
    );
  };

  const moveOrder = (index: number, direction: "up" | "down") => {
    const trendingItems = localItems.filter((i) => i.is_trending);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= trendingItems.length) return;

    const newTrending = [...trendingItems];
    const temp = newTrending[index];
    newTrending[index] = newTrending[targetIndex];
    newTrending[targetIndex] = temp;

    // Re-assign trending_order sequentially
    newTrending.forEach((item, idx) => {
      item.trending_order = idx + 1;
    });

    const nonTrending = localItems.filter((i) => !i.is_trending);
    setLocalItems([...newTrending, ...nonTrending]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      const updates = localItems.map((item, idx) => ({
        id: item.id,
        is_trending: item.is_trending,
        trending_order: item.is_trending ? item.trending_order || idx + 1 : 999,
      }));

      await onSaveTrendingOrder(updates);
      setSuccessMsg("Trending order updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const trendingList = localItems.filter((i) => i.is_trending);
  const availableList = localItems.filter((i) => !i.is_trending);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div>
          <h2 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-current" />
            Trending Dishes ({trendingList.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Items selected here will appear in the customer &quot;🔥 Trending Now&quot; section in exact sequence.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          {isSaving ? "Saving..." : "Save Sequence"}
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Active Trending List */}
      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground font-heading">
          Active Trending Sequence
        </h3>

        {trendingList.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl">
            No items are marked as trending. Select items below to add them to Trending.
          </div>
        ) : (
          <div className="space-y-2">
            {trendingList.map((item, index) => {
              const defaultImg =
                item.image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between gap-3 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      #{index + 1}
                    </span>

                    <div className="relative w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                      <Image src={defaultImg} alt={item.name} fill className="object-cover" />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-foreground">
                          {formatPrice(item.price)}
                        </span>
                        <AvailabilityBadge item={item} showCountdown={false} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveOrder(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted-foreground/20 disabled:opacity-30 text-foreground"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveOrder(index, "down")}
                      disabled={index === trendingList.length - 1}
                      className="p-1.5 rounded-lg bg-muted hover:bg-muted-foreground/20 disabled:opacity-30 text-foreground"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleItemTrending(item.id)}
                      className="ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available items to add to trending */}
      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground font-heading">
          All Other Menu Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableList.map((item) => {
            const defaultImg =
              item.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                    <Image src={defaultImg} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemTrending(item.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border border-orange-500/20 transition-all"
                >
                  + Add to Trending
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
