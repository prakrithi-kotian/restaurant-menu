"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAdminProfile } from "@/lib/queries/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {

    let isMounted = true;
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/kitchen-console/login");
        return;
      }

      const profile = await getAdminProfile(supabase, data.user.id);
      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        router.push("/kitchen-console/login");
        return;
      }

      if (isMounted) {
        setAuthorized(true);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [pathname, router, supabase]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-xs font-bold text-muted-foreground">
        Verifying Kitchen Console Authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">{children}</div>
    </div>
  );
}
