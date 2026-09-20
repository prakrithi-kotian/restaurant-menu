"use client";

import React from "react";
import { MenuItem } from "@/types/database";
import { getAvailabilityInfo } from "@/lib/utils";
import { Countdown } from "./Countdown";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface AvailabilityBadgeProps {
  item: MenuItem;
  showCountdown?: boolean;
}

export function AvailabilityBadge({ item, showCountdown = true }: AvailabilityBadgeProps) {
  const info = getAvailabilityInfo(item);

  if (info.isAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Available
      </span>
    );
  }

  if (info.status === "out_of_stock") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
        <XCircle className="w-3.5 h-3.5" />
        Currently unavailable
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      <span>Currently unavailable</span>
      {showCountdown && item.available_at && (
        <span className="font-extrabold text-amber-800 dark:text-amber-200">
          • <Countdown availableAt={item.available_at} />
        </span>
      )}
    </span>
  );
}
