"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem, Category, AvailabilityStatus } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { AvailabilityBadge } from "../customer/AvailabilityBadge";
import { AvailabilityControl } from "./AvailabilityControl";
import { MenuForm } from "./MenuForm";
import { Flame, Edit2, Trash2, Plus, Search } from "lucide-react";

interface MenuTableProps {
  items: MenuItem[];
  categories: Category[];
  onRefresh: () => void;
  onUpdateAvailability: (id: string, status: AvailabilityStatus, minutes?: number, note?: string) => Promise<void>;
  onToggleTrending: (id: string, isTrending: boolean) => Promise<void>;
  onSaveItem: (itemData: Partial<MenuItem>, itemId?: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export function MenuTable({
  items,
  categories,
  onRefresh,
  onUpdateAvailability,
  onToggleTrending,
  onSaveItem,
  onDeleteItem,
}: MenuTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [availabilityItem, setAvailabilityItem] = useState<MenuItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      await onDeleteItem(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/60 shadow-xs">
        {/* Search & Filter */}
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/60 border border-border text-xs font-medium focus:ring-2 focus:ring-orange-500/30"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Item Button */}
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>

      {/* Table / List Container */}
      <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border/60 font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Trending</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No menu items found. Click &quot;Add Menu Item&quot; to get started.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const defaultImg =
                    item.image_url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      {/* Image & Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0">
                            <Image src={defaultImg} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-sm block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground line-clamp-1">
                              {item.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-muted-foreground font-semibold">
                        {item.category?.name || "Uncategorized"}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-extrabold text-foreground text-sm">
                        {formatPrice(item.price)}
                      </td>

                      {/* Availability (Clickable) */}
                      <td className="p-4">
                        <button
                          onClick={() => setAvailabilityItem(item)}
                          className="hover:scale-105 transition-transform text-left"
                          title="Click to change availability"
                        >
                          <AvailabilityBadge item={item} />
                        </button>
                      </td>

                      {/* Trending toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => onToggleTrending(item.id, !item.is_trending)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                            item.is_trending
                              ? "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <Flame className={`w-3.5 h-3.5 ${item.is_trending ? "fill-current" : ""}`} />
                          {item.is_trending ? "Trending" : "Off"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsFormOpen(true);
                            }}
                            className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-all"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-all"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Availability Control Modal */}
      {availabilityItem && (
        <AvailabilityControl
          item={availabilityItem}
          isOpen={!!availabilityItem}
          onClose={() => setAvailabilityItem(null)}
          onSave={async (status, minutes, note) => {
            await onUpdateAvailability(availabilityItem.id, status, minutes, note);
            onRefresh();
          }}
        />
      )}

      {/* Add / Edit Item Form Modal */}
      {isFormOpen && (
        <MenuForm
          item={editingItem}
          categories={categories}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={async (data) => {
            await onSaveItem(data, editingItem?.id);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
