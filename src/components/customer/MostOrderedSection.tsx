"use client";

import React from "react";
import { MostOrderedItem } from "@/types/database";
import { MenuCard } from "./MenuCard";
import { Star } from "lucide-react";

interface MostOrderedSectionProps {
  items: MostOrderedItem[];
}

export function MostOrderedSection({ items }: MostOrderedSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="my-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight font-heading text-foreground uppercase">
            ⭐ MOST ORDERED
          </h2>
          <p className="text-xs text-muted-foreground font-medium">Calculated live from actual customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          if (!item.menuItem) return null;
          return <MenuCard key={item.menu_item_id} item={item.menuItem} />;
        })}
      </div>
    </section>
  );
}
