"use client";

import React, { useState } from "react";
import { OrderStatus, OrderWithItems } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { Clock, CheckCircle2, ChefHat, Sparkles, PackageCheck, AlertCircle, Phone, MapPin } from "lucide-react";

interface OrdersTableProps {
  orders: OrderWithItems[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    badge: "bg-amber-500 text-white",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    badge: "bg-blue-500 text-white",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Preparing",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
    badge: "bg-orange-500 text-white",
    icon: ChefHat,
  },
  ready: {
    label: "Ready to Serve",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    badge: "bg-purple-500 text-white",
    icon: Sparkles,
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    badge: "bg-emerald-500 text-white",
    icon: PackageCheck,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    badge: "bg-rose-500 text-white",
    icon: AlertCircle,
  },
};

export function OrdersTable({ orders, onUpdateStatus, onRefresh }: OrdersTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All Orders", count: orders.length },
    { key: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length },
    { key: "confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length },
    { key: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "preparing").length },
    { key: "ready", label: "Ready", count: orders.filter((o) => o.status === "ready").length },
    { key: "completed", label: "Completed", count: orders.filter((o) => o.status === "completed").length },
    { key: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-card text-muted-foreground border border-border/50 hover:bg-muted"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isActive ? "bg-background text-foreground font-extrabold" : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground text-xs">
            No orders found in this category.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;
            const formattedTime = new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl bg-card border shadow-xs transition-all ${
                  order.status === "pending"
                    ? "border-amber-500/50 bg-amber-500/5 ring-2 ring-amber-500/20"
                    : "border-border/60"
                }`}
              >
                {/* Card Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-foreground font-mono">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formattedTime}
                    </span>
                    {order.table_number && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center gap-1 border border-orange-500/20">
                        <MapPin className="w-3 h-3" />
                        Table {order.table_number}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>

                    {/* Status Dropdown Switcher */}
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 rounded-xl bg-muted/80 border border-border text-xs font-bold focus:ring-2 focus:ring-orange-500/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details & Items Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Customer Info
                    </h5>
                    <p className="text-xs font-bold text-foreground">
                      {order.customer_name || "Guest Customer"}
                    </p>
                    {order.customer_phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {order.customer_phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Order Items ({order.order_items.length})
                    </h5>
                    <div className="space-y-1.5">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-medium">
                            <span className="font-bold text-orange-600 dark:text-orange-400 mr-2">
                              {item.quantity}x
                            </span>
                            {item.menu_item?.name || "Dish item"}
                          </span>
                          <span className="font-extrabold text-foreground font-mono">
                            {formatPrice((item.price || 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-sm font-extrabold">
                      <span>Total Amount</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
