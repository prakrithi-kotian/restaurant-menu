"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAdminAnalytics } from "@/lib/queries/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

type AnalyticsData = Awaited<ReturnType<typeof getAdminAnalytics>>;

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      const res = await getAdminAnalytics(supabase);
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    }
    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Business Analytics"
        subtitle="Sales performance, popular dishes, and order metric reports"
      />

      <main className="p-6">
        {loading || !data ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-muted rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          </div>
        ) : (
          <AnalyticsCharts analyticsData={data} />
        )}
      </main>
    </div>
  );
}
