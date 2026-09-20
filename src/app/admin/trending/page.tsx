"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMenuItems } from "@/lib/queries/menu";
import { setItemTrending } from "@/lib/queries/admin";
import { MenuItem } from "@/types/database";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TrendingManager } from "@/components/admin/TrendingManager";

export default function AdminTrendingPage() {
  const supabase = createClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = useCallback(async () => {
    const data = await getMenuItems(supabase);
    setItems(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await getMenuItems(supabase);
      if (isMounted) {
        setItems(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleSaveTrendingOrder = async (
    updates: { id: string; is_trending: boolean; trending_order: number }[]
  ) => {
    for (const u of updates) {
      await setItemTrending(supabase, u.id, u.is_trending, u.trending_order);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Trending Control Center"
        subtitle="Manually curate and sequence dishes displayed in the customer Trending section"
      />

      <main className="p-6">
        {loading ? (
          <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        ) : (
          <TrendingManager
            items={items}
            onSaveTrendingOrder={handleSaveTrendingOrder}
            onRefresh={fetchMenuItems}
          />
        )}
      </main>
    </div>
  );
}
