"use client";

import React from "react";
import { Category } from "@/types/database";
import { Flame, Utensils, Drumstick, Fish, Beef, Soup, Wheat, Salad, Sparkles } from "lucide-react";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("thali")) return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
  if (lower.includes("chicken")) return <Drumstick className="w-3.5 h-3.5 text-red-600" />;
  if (lower.includes("fish")) return <Fish className="w-3.5 h-3.5 text-blue-600" />;
  if (lower.includes("mutton")) return <Beef className="w-3.5 h-3.5 text-red-700" />;
  if (lower.includes("rice") || lower.includes("biryani")) return <Soup className="w-3.5 h-3.5 text-amber-600" />;
  if (lower.includes("south") || lower.includes("dosa")) return <Wheat className="w-3.5 h-3.5 text-amber-700" />;
  if (lower.includes("veg")) return <Salad className="w-3.5 h-3.5 text-emerald-600" />;
  return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 my-1 sticky top-[95px] z-30 bg-background/90 backdrop-blur-sm border-b border-border/40">
      <div className="flex items-center gap-2 px-1 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
            selectedCategoryId === null
              ? "bg-red-800 text-white shadow-md shadow-red-900/20"
              : "bg-amber-100/60 dark:bg-amber-950/40 text-foreground hover:bg-amber-200/60 border border-amber-900/10"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>All Dishes</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                isSelected
                  ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                  : "bg-amber-100/60 dark:bg-amber-950/40 text-foreground hover:bg-amber-200/60 border border-amber-900/10"
              }`}
            >
              {getCategoryIcon(cat.name)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
