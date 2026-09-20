"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAllCategories } from "@/lib/queries/categories";
import { getMenuItems } from "@/lib/queries/menu";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateItemAvailability,
  setItemTrending,
} from "@/lib/queries/admin";
import { Category, MenuItem } from "@/types/database";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MenuTable } from "@/components/admin/MenuTable";

export default function AdminMenuPage() {
  const supabase = createClient();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuData = useCallback(async () => {
    try {
      const [cats, menu] = await Promise.all([
        getAllCategories(supabase),
        getMenuItems(supabase),
      ]);
      setCategories(cats);
      setItems(menu);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const [cats, menu] = await Promise.all([
        getAllCategories(supabase),
        getMenuItems(supabase),
      ]);
      if (isMounted) {
        setCategories(cats);
        setItems(menu);
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="Menu Management"
        subtitle="Add, edit, delete, and control availability of dishes"
      />

      <main className="p-6">
        {loading ? (
          <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        ) : (
          <MenuTable
            items={items}
            categories={categories}
            onRefresh={fetchMenuData}
            onUpdateAvailability={async (id, status, minutes, note) => {
              await updateItemAvailability(supabase, id, status, minutes, note);
            }}
            onToggleTrending={async (id, isTrending) => {
              await setItemTrending(supabase, id, isTrending);
              fetchMenuData();
            }}
            onSaveItem={async (itemData, itemId) => {
              if (itemId) {
                await updateMenuItem(supabase, itemId, itemData);
              } else {
                await createMenuItem(supabase, itemData);
              }
            }}
            onDeleteItem={async (id) => {
              await deleteMenuItem(supabase, id);
            }}
          />
        )}
      </main>
    </div>
  );
}
