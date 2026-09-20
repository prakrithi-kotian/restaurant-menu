"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, IndianRupee, ShoppingBag, Award, CheckCircle } from "lucide-react";

interface AnalyticsChartsProps {
  analyticsData: {
    todayOrdersCount: number;
    todayRevenue: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    statusCounts: Record<string, number>;
    topItems: { name: string; quantity: number }[];
  };
}

export function AnalyticsCharts({ analyticsData }: AnalyticsChartsProps) {
  const {
    todayOrdersCount,
    todayRevenue,
    totalOrders,
    totalRevenue,
    avgOrderValue,
    statusCounts,
    topItems,
  } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Today&apos;s Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">
            {formatPrice(todayRevenue)}
          </p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            From {todayOrdersCount} orders today
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Lifetime sales
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">{totalOrders}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Placed by customers</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Avg. Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">
            {formatPrice(avgOrderValue)}
          </p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Per customer ticket</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ordered Items */}
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold font-heading text-foreground">
              Top 5 Best-Selling Items
            </h3>
          </div>

          {topItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl">
              No order data available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, idx) => {
                const maxQty = topItems[0].quantity || 1;
                const percentage = Math.round((item.quantity / maxQty) * 100);

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">
                        #{idx + 1} {item.name}
                      </span>
                      <span className="font-extrabold text-orange-600 dark:text-orange-400">
                        {item.quantity} ordered
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold font-heading text-foreground">
              Orders Status Distribution
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                <span className="text-[11px] font-bold text-muted-foreground capitalize block mb-1">
                  {status}
                </span>
                <span className="text-xl font-extrabold text-foreground font-heading">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
