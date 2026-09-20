"use client";

import React from "react";
import { OrderStatus } from "@/types/database";
import { Clock, CheckCircle2, ChefHat, PackageCheck, AlertCircle, Sparkles } from "lucide-react";

interface StatusTimelineProps {
  status: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    status: "pending",
    label: "Order Sent",
    description: "Sent to kitchen staff for confirmation",
    icon: Clock,
  },
  {
    status: "confirmed",
    label: "Confirmed",
    description: "Kitchen has accepted your order",
    icon: CheckCircle2,
  },
  {
    status: "preparing",
    label: "Preparing",
    description: "Chef is crafting your fresh meal",
    icon: ChefHat,
  },
  {
    status: "ready",
    label: "Ready to Serve",
    description: "Your food is hot & ready!",
    icon: Sparkles,
  },
  {
    status: "completed",
    label: "Completed",
    description: "Enjoy your dining experience",
    icon: PackageCheck,
  },
];

export function StatusTimeline({ status }: StatusTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3">
        <AlertCircle className="w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-bold text-base">Order Cancelled</h4>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
            This order was cancelled by the restaurant. Please ask a staff member for assistance.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === status);
  const progressPercent = Math.min(100, Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100));

  return (
    <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold font-heading text-foreground">Order Status</h3>
          <p className="text-xs text-muted-foreground">Updated live via restaurant kitchen updates</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/20 capitalize">
          {status}
        </span>
      </div>

      {/* Progress Bar Header */}
      <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Vertical Steps List */}
      <div className="relative space-y-6 pl-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.status} className="flex items-start gap-4 relative">
              {/* Connector Line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-8 -ml-px transition-colors ${
                    idx < currentStepIndex ? "bg-orange-500" : "bg-border/60"
                  }`}
                />
              )}

              {/* Icon Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCurrent
                    ? "bg-orange-500 text-white ring-4 ring-orange-500/20 shadow-md shadow-orange-500/30 scale-110"
                    : isDone
                    ? "bg-amber-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              {/* Text Info */}
              <div className="pt-0.5">
                <h4
                  className={`text-sm font-bold leading-tight ${
                    isCurrent ? "text-orange-600 dark:text-orange-400" : isDone ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
