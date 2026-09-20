"use client";

import React, { useState } from "react";
import { AvailabilityStatus, MenuItem } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { Clock, CheckCircle2, AlertTriangle, X } from "lucide-react";

interface AvailabilityControlProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: AvailabilityStatus, minutes?: number, statusNote?: string) => Promise<void>;
}

export function AvailabilityControl({ item, isOpen, onClose, onSave }: AvailabilityControlProps) {
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>(item.availability_status);
  const [minutes, setMinutes] = useState<number>(15);
  const [statusNote, setStatusNote] = useState<string>(item.status_note || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(selectedStatus, selectedStatus === "temporary_unavailable" ? minutes : undefined, statusNote);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-heading text-foreground mb-1">
          Set Availability
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Updating status for <span className="font-semibold text-foreground">{item.name}</span> ({formatPrice(item.price)})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Availability Status</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus("available")}
                className={`p-3 rounded-xl text-left border flex items-center gap-3 transition-all ${
                  selectedStatus === "available"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold">1. Available</div>
                  <div className="text-[11px] opacity-80">Customers can freely order this item</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("temporary_unavailable")}
                className={`p-3 rounded-xl text-left border flex items-center gap-3 transition-all ${
                  selectedStatus === "temporary_unavailable"
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold">2. Temporarily Unavailable</div>
                  <div className="text-[11px] opacity-80">Show live countdown to customers</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("out_of_stock")}
                className={`p-3 rounded-xl text-left border flex items-center gap-3 transition-all ${
                  selectedStatus === "out_of_stock"
                    ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold"
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold">3. Out of Stock</div>
                  <div className="text-[11px] opacity-80">Disabled until manually enabled</div>
                </div>
              </button>
            </div>
          </div>

          {selectedStatus === "temporary_unavailable" && (
            <div className="space-y-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div>
                <label className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  Ready in (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-amber-500/30"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  Optional Status Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Preparing fresh batch..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
            >
              {isSubmitting ? "Saving..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
