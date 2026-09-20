"use client";

import React from "react";
import { MenuItem } from "@/types/database";
import { MenuCard } from "./MenuCard";
import { Flame } from "lucide-react";

interface TrendingSectionProps {
  items: MenuItem[];
}

export function TrendingSection({ items }: TrendingSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="my-6 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent p-4 sm:p-5 rounded-3xl border border-amber-500/20">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-red-800 text-white flex items-center justify-center shadow-md shadow-red-900/20">
          <Flame className="w-5 h-5 fill-current text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight font-heading text-foreground uppercase flex items-center gap-2">
            🔥 TRENDING NOW
          </h2>
          <p className="text-xs text-muted-foreground font-medium">Udupi Lunch Home Specials & Chef Picks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
