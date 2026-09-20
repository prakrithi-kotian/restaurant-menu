"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  adminName?: string;
}

export function AdminHeader({ title, subtitle, adminName = "Udupi Admin Staff" }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 px-6 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black tracking-tight text-foreground font-heading uppercase">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border">
          <div className="w-7 h-7 rounded-lg bg-red-800 text-white flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-foreground">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
