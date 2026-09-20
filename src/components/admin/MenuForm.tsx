"use client";

import React, { useState } from "react";
import { Category, MenuItem } from "@/types/database";
import { X } from "lucide-react";

interface MenuFormProps {
  item?: MenuItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => Promise<void>;
}

export function MenuForm({ item, categories, isOpen, onClose, onSave }: MenuFormProps) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price ? item.price.toString() : "");
  const [categoryId, setCategoryId] = useState(item?.category_id || (categories[0]?.id || ""));
  const [imageUrl, setImageUrl] = useState(item?.image_url || "");
  const [prepTime, setPrepTime] = useState(item?.preparation_time ? item.preparation_time.toString() : "15");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a dish name.");
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        price: numericPrice,
        category_id: categoryId,
        image_url: imageUrl.trim() || null,
        preparation_time: prepTime ? parseInt(prepTime) : null,
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save menu item.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-heading text-foreground mb-1">
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Fill in dish details below to publish to the digital menu.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artisanal Truffle Pizza"
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249"
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ingredients, taste profile, dietary flags..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Prep Time (mins)</label>
              <input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15"
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
            >
              {isSubmitting ? "Saving..." : item ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
