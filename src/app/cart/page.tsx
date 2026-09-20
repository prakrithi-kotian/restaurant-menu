"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { CustomerHeader } from "@/components/customer/Header";
import { CustomerFooter } from "@/components/customer/Footer";
import { ArrowLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, Truck } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, total, tableNumber, setTableNumber } =
    useCart();

  const freeDeliveryThreshold = 500;
  const isFreeDeliveryEligible = subtotal >= freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <CustomerHeader showSearch={false} />

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Top Header */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Udupi Lunch Home Menu
            </Link>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          <h1 className="text-2xl font-black text-foreground font-heading mb-4 uppercase">
            Your Order Cart
          </h1>

          {items.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-card border border-border/70 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto border border-amber-500/20">
                <ShoppingBag className="w-8 h-8 text-red-800" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Your cart is currently empty</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse our authentic Udupi & Mangalorean dishes to add items.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-black text-xs shadow-md shadow-red-900/20"
              >
                Browse Restaurant Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Free Delivery Progress Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/80 text-emerald-100 border border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    {isFreeDeliveryEligible
                      ? "🎉 You qualify for FREE Delivery!"
                      : `Add ${formatPrice(amountNeededForFreeDelivery)} more for FREE Delivery!`}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Target: ₹500
                  </span>
                </div>
                <div className="w-full bg-emerald-900/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Table Number Prompt Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <MapPin className="w-4 h-4 shrink-0 text-red-700" />
                  <span className="text-xs font-black">
                    {tableNumber ? `Dining at Table #${tableNumber}` : "Takeaway / Home Delivery"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const val = prompt("Enter Table Number (leave empty for takeaway/delivery):", tableNumber || "");
                    if (val !== null) setTableNumber(val.trim() || null);
                  }}
                  className="text-xs font-bold text-red-800 dark:text-red-300 underline"
                >
                  {tableNumber ? "Change Table" : "Add Table Number"}
                </button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3">
                {items.map(({ menuItem, quantity }) => {
                  const defaultImg =
                    menuItem.image_url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";

                  return (
                    <div
                      key={menuItem.id}
                      className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                          <Image src={defaultImg} alt={menuItem.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{menuItem.name}</h4>
                          <span className="text-xs text-muted-foreground block font-medium">
                            {formatPrice(menuItem.price)} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-muted border border-border p-1 rounded-xl">
                          <button
                            onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-black text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-black text-sm text-foreground w-16 text-right font-mono">
                          {formatPrice(menuItem.price * quantity)}
                        </span>

                        <button
                          onClick={() => removeFromCart(menuItem.id)}
                          className="p-2 text-muted-foreground hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations & Checkout CTA */}
              <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-600">
                    {isFreeDeliveryEligible ? "FREE" : "Standard"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taxes & GST</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>

                <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                  <span className="text-base font-black text-foreground font-heading uppercase">
                    Order Total
                  </span>
                  <span className="text-2xl font-black text-red-800 font-heading">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-2xl bg-red-800 hover:bg-red-900 text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Proceed to Checkout ({items.length} {items.length === 1 ? "item" : "items"})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      <CustomerFooter />
    </div>
  );
}
