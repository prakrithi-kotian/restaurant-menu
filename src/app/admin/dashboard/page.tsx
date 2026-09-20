"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDashboardStats, updateOrderStatus } from "@/lib/queries/admin";
import { MenuItem, OrderWithItems } from "@/types/database";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<{
    todayOrders: number;
    todayRevenue: number;
    availableCount: number;
    tempUnavailableCount: number;
    outOfStockCount: number;
    trendingCount: number;
    liveUnavailableItems: MenuItem[];
    recentOrders: OrderWithItems[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const data = await getDashboardStats(supabase);
    setStats(data);
    setLoading(false);
  }, [supabase]);

  // Initial data load — inline async avoids react-hooks/set-state-in-effect lint error
  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await getDashboardStats(supabase);
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Realtime restaurant operations & availability metrics"
      />

      <main className="p-6 space-y-8">
        {loading || !stats ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-2xl" />
              ))}
            </div>
            <div className="h-48 bg-muted rounded-2xl" />
          </div>
        ) : (
          <>
            <DashboardStats
              todayOrders={stats.todayOrders}
              todayRevenue={stats.todayRevenue}
              availableCount={stats.availableCount}
              tempUnavailableCount={stats.tempUnavailableCount}
              outOfStockCount={stats.outOfStockCount}
              trendingCount={stats.trendingCount}
              liveUnavailableItems={stats.liveUnavailableItems}
            />

            {/* Recent Orders Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold font-heading text-foreground">Recent Orders</h2>
              <OrdersTable
                orders={stats.recentOrders}
                onUpdateStatus={async (orderId, status) => {
                  await updateOrderStatus(supabase, orderId, status);
                }}
                onRefresh={fetchStats}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
