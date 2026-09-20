import { SupabaseClient } from "@supabase/supabase-js";
import { MenuItem, MostOrderedItem } from "@/types/database";
import { INITIAL_MENU_ITEMS } from "@/lib/constants/seedData";

export async function getMenuItems(supabase: SupabaseClient): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.error("Error fetching menu items:", error);
    return INITIAL_MENU_ITEMS;
  }

  return data;
}

export async function getTrendingMenuItems(supabase: SupabaseClient): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, category:categories(*)")
    .eq("is_trending", true)
    .order("trending_order", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching trending menu items:", error);
    return [];
  }

  return data || [];
}

export async function getMenuItemById(supabase: SupabaseClient, id: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error) console.error("Error fetching menu item by id:", error);
    return INITIAL_MENU_ITEMS.find((item) => item.id === id) || null;
  }

  return data;
}

export async function getMostOrderedMenuItems(
  supabase: SupabaseClient,
  limit: number = 6
): Promise<MostOrderedItem[]> {
  // Query order_items table and sum quantities grouped by menu_item_id
  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select("menu_item_id, quantity");

  if (error || !orderItems || orderItems.length === 0) {
    if (error) console.error("Error fetching order items for most ordered:", error);
    return [];
  }

  // Calculate sum of quantities per menu_item_id
  const totalsMap = new Map<string, number>();
  orderItems.forEach((item) => {
    const current = totalsMap.get(item.menu_item_id) || 0;
    totalsMap.set(item.menu_item_id, current + (item.quantity || 0));
  });

  const sortedTotals = Array.from(totalsMap.entries())
    .map(([menu_item_id, total_quantity]) => ({ menu_item_id, total_quantity }))
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, limit);

  if (sortedTotals.length === 0) return [];

  // Fetch corresponding menu items
  const itemIds = sortedTotals.map((t) => t.menu_item_id);
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*, category:categories(*)")
    .in("id", itemIds);

  const menuItemsMap = new Map<string, MenuItem>();
  (menuItems || []).forEach((item) => menuItemsMap.set(item.id, item));

  return sortedTotals
    .map((st) => ({
      menu_item_id: st.menu_item_id,
      total_quantity: st.total_quantity,
      menuItem: menuItemsMap.get(st.menu_item_id),
    }))
    .filter((item): item is MostOrderedItem & { menuItem: MenuItem } => item.menuItem !== undefined);
}
