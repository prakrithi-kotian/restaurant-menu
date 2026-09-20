"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAdminOrders, updateOrderStatus } from "@/lib/queries/admin";
import { OrderWithItems } from "@/types/database";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const data = await getAdminOrders(supabase);
    setOrders(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await getAdminOrders(supabase);
      if (isMounted) {
        setOrders(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Supabase Realtime Subscription for incoming orders & status updates
  useEffect(() => {
    const channel = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchOrders]);

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Live Orders Console"
        subtitle="Manage incoming kitchen orders & update preparation statuses in real-time"
      />

      <main className="p-6 space-y-4">
        <div className="flex items-center justify-end">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold flex items-center gap-1.5 text-foreground hover:bg-muted"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Feed
          </button>
        </div>

        {loading ? (
          <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        ) : (
          <OrdersTable
            orders={orders}
            onUpdateStatus={async (orderId, status) => {
              await updateOrderStatus(supabase, orderId, status);
              fetchOrders();
            }}
            onRefresh={fetchOrders}
          />
        )}
      </main>
    </div>
  );
}
