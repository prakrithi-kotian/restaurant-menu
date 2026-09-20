"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getOrderById } from "@/lib/queries/orders";
import { OrderWithItems } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { CustomerHeader } from "@/components/customer/Header";
import { CustomerFooter } from "@/components/customer/Footer";
import { StatusTimeline } from "@/components/customer/StatusTimeline";
import { ArrowLeft, MapPin, Clock, RefreshCw, Phone } from "lucide-react";

export default function CustomerOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const supabase = createClient();

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    const data = await getOrderById(supabase, resolvedParams.id);
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await getOrderById(supabase, resolvedParams.id);
      if (isMounted) {
        setOrder(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [supabase, resolvedParams.id]);

  // Supabase Realtime Subscription for this specific order
  useEffect(() => {
    const channel = supabase
      .channel(`public:orders:${resolvedParams.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${resolvedParams.id}`,
        },
        (payload) => {
          if (payload.new) {
            setOrder((prev) => (prev ? { ...prev, status: payload.new.status } : null));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader showSearch={false} />
        <div className="max-w-xl mx-auto px-4 py-8 animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <CustomerHeader showSearch={false} />
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold font-heading text-foreground">Order Not Found</h2>
          <p className="text-xs text-muted-foreground">
            We couldn&apos;t locate this order ticket. Please ask staff or call us for assistance.
          </p>
          <Link
            href="/menu"
            className="px-4 py-2.5 rounded-xl bg-red-800 text-white font-bold text-xs inline-block"
          >
            Return to Menu
          </Link>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <CustomerHeader showSearch={false} />

        <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Order More Dishes
            </Link>

            <button
              onClick={fetchOrder}
              className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
            </button>
          </div>

          {/* Order Header Ticket */}
          <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">
                  Kitchen Order Ticket
                </span>
                <h1 className="text-xl font-black text-foreground font-mono">
                  #{order.id.slice(0, 8)}
                </h1>
              </div>

              {order.table_number ? (
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center gap-1.5 border border-amber-500/30">
                  <MapPin className="w-3.5 h-3.5 text-red-700" />
                  Table #{order.table_number}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                  Takeaway / Delivery
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Placed: {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <a href="tel:+918356928612" className="flex items-center gap-1 font-bold text-red-800 hover:underline">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Kitchen
              </a>
            </div>
          </div>

          {/* Live Status Progress Timeline */}
          <StatusTimeline status={order.status} />

          {/* Ordered Items Breakdown */}
          <div className="p-6 rounded-3xl bg-card border border-border/70 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider border-b border-border/50 pb-2">
              Dishes in this Order
            </h3>

            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="text-foreground">
                    <span className="font-black text-red-800 mr-2">
                      {item.quantity}x
                    </span>
                    {item.menu_item?.name || "Ordered Dish"}
                  </span>
                  <span className="font-black text-foreground font-mono">
                    {formatPrice((item.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/50 flex justify-between items-center text-sm font-extrabold">
              <span className="uppercase">Total Amount</span>
              <span className="text-red-800 font-black text-lg">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </main>
      </div>

      <CustomerFooter />
    </div>
  );
}
