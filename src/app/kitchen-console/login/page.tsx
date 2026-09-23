"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/queries/admin";
import Image from "next/image";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error || !data.user) {
        setErrorMsg(error?.message || "Invalid credentials.");
        setIsSubmitting(false);
        return;
      }

      // Check admin_profiles table
      const profile = await getAdminProfile(supabase, data.user.id);
      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setErrorMsg("Access denied. You do not have admin permissions.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected login error occurred.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="bg-card w-full max-w-md rounded-3xl border border-border/80 shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-md shadow-red-900/15 bg-white/5">
            <Image
              src="/images/logo.png"
              alt="Udupi Lunch Home"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-foreground">
            Kitchen Console
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Admin Management Portal Login
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="admin@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-border text-xs focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Console"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
