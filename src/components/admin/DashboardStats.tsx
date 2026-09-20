"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { MenuItem } from "@/types/database";
import { Countdown } from "../customer/Countdown";
import { ShoppingBag, IndianRupee, CheckCircle2, Clock, AlertTriangle, Flame } from "lucide-react";

interface DashboardStatsProps {
  todayOrders: number;
  todayRevenue: number;
  availableCount: number;
  tempUnavailableCount: number;
  outOfStockCount: number;
  trendingCount: number;
  liveUnavailableItems: MenuItem[];
}

export function DashboardStats({
  todayOrders,
  todayRevenue,
  availableCount,
  tempUnavailableCount,
  outOfStockCount,
  trendingCount,
  liveUnavailableItems,
}: DashboardStatsProps) {
  const cards = [
    {
      title: "Today's Orders",
      value: todayOrders,
      icon: ShoppingBag,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Today's Revenue",
      value: formatPrice(todayRevenue),
      icon: IndianRupee,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Available Items",
      value: availableCount,
      icon: CheckCircle2,
      color: "text-green-500 bg-green-500/10 border-green-500/20",
    },
    {
      title: "Temp. Unavailable",
      value: tempUnavailableCount,
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      icon: AlertTriangle,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Trending Items",
      value: trendingCount,
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-foreground font-heading">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Live Availability Feed */}
      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-foreground">
              Live Availability Monitor
            </h3>
            <p className="text-xs text-muted-foreground">
              Items currently unavailable to customers
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            {liveUnavailableItems.length} Flagged
          </span>
        </div>

        {liveUnavailableItems.length === 0 ? (
          <div className="p-6 rounded-xl bg-muted/40 text-center text-xs text-muted-foreground">
            🎉 All menu items are currently available for ordering!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveUnavailableItems.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-muted/50 border border-border/40 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    Status: {item.availability_status.replace("_", " ")}
                  </p>
                </div>
                {item.availability_status === "temporary_unavailable" && item.available_at ? (
                  <div className="text-right text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Countdown availableAt={item.available_at} />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Out of Stock
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
