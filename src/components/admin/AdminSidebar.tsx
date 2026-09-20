"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Flame,
  ShoppingBag,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
    { href: "/admin/trending", label: "Trending Control", icon: Flame },
    { href: "/admin/orders", label: "Live Kitchen Orders", icon: ShoppingBag },
    { href: "/admin/analytics", label: "Analytics & Sales", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border/70 flex flex-col justify-between p-4 min-h-screen shrink-0 shadow-xs">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-border/50">
          <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-md shadow-red-900/10 bg-white/5">
            <Image
              src="/images/logo.png"
              alt="Udupi Lunch Home"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-foreground font-heading uppercase">
              UDUPI LUNCH HOME
            </h2>
            <p className="text-[10px] font-extrabold text-red-800 dark:text-red-300 uppercase tracking-wider">Kitchen Admin</p>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-border/50 space-y-2">
        <Link
          href="/menu"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            Live Customer Menu
          </span>
          <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.5 rounded border border-red-300">
            Preview
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out Admin
        </button>
      </div>
    </aside>
  );
}
