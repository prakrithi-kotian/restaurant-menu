"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { createOrder } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/utils";
import { CustomerHeader } from "@/components/customer/Header";
import { CustomerFooter } from "@/components/customer/Footer";
import { ArrowLeft, MapPin, User, Phone, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { items, total, tableNumber, setTableNumber, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [table, setTable] = useState(tableNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <CustomerHeader showSearch={false} />
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold font-heading text-foreground">Your Cart is Empty</h2>
          <p className="text-xs text-muted-foreground">
            Please add dishes to your cart before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl bg-red-800 text-white font-bold text-xs inline-block"
          >
            Go to Menu
          </Link>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    setIsSubmitting(true);
    try {
      // Update table context if provided
      if (table.trim()) {
        setTableNumber(table.trim());
      }

      // Submit order to Supabase
      const result = await createOrder(supabase, {
        table_number: table.trim() || null,
        customer_name: customerName.trim() || null,
        customer_phone: customerPhone.trim() || null,
        items: items.map((i) => ({
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
        })),
      });

      if (!result.success || !result.orderId) {
        setErrorMessage(result.error || "Failed to place order.");
        return;
      }

      // Clear local cart and navigate to live tracking
      clearCart();
      router.push(`/order/${result.orderId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <CustomerHeader showSearch={false} />

        <main className="max-w-xl mx-auto px-4 py-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <h1 className="text-2xl font-black text-foreground font-heading mb-4 uppercase">
            Order Checkout
          </h1>

          {errorMessage && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Table & Customer Details Form */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                Table & Customer Information
              </h3>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Table Number (Optional for Takeaway/Delivery)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
                  <input
                    type="text"
                    placeholder="e.g. 01, 05, or leave blank for takeaway"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold focus:ring-2 focus:ring-red-800/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-medium focus:ring-2 focus:ring-red-800/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-medium focus:ring-2 focus:ring-red-800/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Confirmation */}
            <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </h3>

              <div className="space-y-2">
                {items.map(({ menuItem, quantity }) => (
                  <div key={menuItem.id} className="flex justify-between text-xs">
                    <span className="text-foreground">
                      <span className="font-black text-red-800 mr-2">
                        {quantity}x
                      </span>
                      {menuItem.name}
                    </span>
                    <span className="font-black text-foreground font-mono">
                      {formatPrice(menuItem.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border/50 flex justify-between items-center text-sm font-extrabold">
                <span className="uppercase">Total Payable</span>
                <span className="text-red-800 text-xl font-black font-heading">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Direct kitchen order sending via Supabase Realtime architecture.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-red-800 hover:bg-red-900 text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  "Sending Order to Kitchen..."
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Confirm & Place Order ({formatPrice(total)})
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>

      <CustomerFooter />
    </div>
  );
}
