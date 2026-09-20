import { SupabaseClient } from "@supabase/supabase-js";
import { AdminProfile, MenuItem, OrderStatus, OrderWithItems, AvailabilityStatus } from "@/types/database";

export async function getAdminProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", userId)
    .eq("role", "admin")
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getDashboardStats(supabase: SupabaseClient) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Today's orders & revenue
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("id, total_amount, status")
    .gte("created_at", startOfDay.toISOString());

  const ordersCount = todayOrders ? todayOrders.length : 0;
  const todayRevenue = todayOrders
    ? todayOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
    : 0;

  // Menu item availability counts
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, name, availability_status, available_at, status_note, is_trending");

  let availableCount = 0;
  let tempUnavailableCount = 0;
  let outOfStockCount = 0;
  let trendingCount = 0;
  const liveUnavailableItems: MenuItem[] = [];

  const now = new Date();
  (menuItems || []).forEach((item) => {
    if (item.is_trending) trendingCount++;

    if (item.availability_status === "available") {
      availableCount++;
    } else if (item.availability_status === "temporary_unavailable") {
      // Check if timer expired
      if (item.available_at && new Date(item.available_at) <= now) {
        availableCount++;
      } else {
        tempUnavailableCount++;
        liveUnavailableItems.push(item as MenuItem);
      }
    } else if (item.availability_status === "out_of_stock") {
      outOfStockCount++;
      liveUnavailableItems.push(item as MenuItem);
    }
  });

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_item:menu_items(*))")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    todayOrders: ordersCount,
    todayRevenue,
    availableCount,
    tempUnavailableCount,
    outOfStockCount,
    trendingCount,
    liveUnavailableItems,
    recentOrders: (recentOrders as OrderWithItems[]) || [],
  };
}

export async function createMenuItem(
  supabase: SupabaseClient,
  itemData: Partial<MenuItem>
): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      category_id: itemData.category_id,
      name: itemData.name,
      description: itemData.description || null,
      price: itemData.price,
      image_url: itemData.image_url || null,
      availability_status: itemData.availability_status || "available",
      preparation_time: itemData.preparation_time || null,
      is_trending: itemData.is_trending || false,
      trending_order: itemData.trending_order || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateMenuItem(
  supabase: SupabaseClient,
  id: string,
  itemData: Partial<MenuItem>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("menu_items")
    .update({
      category_id: itemData.category_id,
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      image_url: itemData.image_url,
      preparation_time: itemData.preparation_time,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating menu item:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteMenuItem(
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateItemAvailability(
  supabase: SupabaseClient,
  id: string,
  status: AvailabilityStatus,
  minutes?: number | null,
  statusNote?: string | null
): Promise<{ success: boolean; error?: string }> {
  let availableAt: string | null = null;

  if (status === "temporary_unavailable" && minutes && minutes > 0) {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + minutes);
    availableAt = futureDate.toISOString();
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      availability_status: status,
      available_at: availableAt,
      status_note: statusNote || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating availability:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function setItemTrending(
  supabase: SupabaseClient,
  id: string,
  isTrending: boolean,
  trendingOrder?: number | null
): Promise<{ success: boolean; error?: string }> {
  const updateData: { is_trending: boolean; updated_at: string; trending_order?: number | null } = {
    is_trending: isTrending,
    updated_at: new Date().toISOString(),
  };

  if (trendingOrder !== undefined) {
    updateData.trending_order = trendingOrder;
  }

  const { error } = await supabase.from("menu_items").update(updateData).eq("id", id);

  if (error) {
    console.error("Error setting trending:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getAdminOrders(supabase: SupabaseClient): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_item:menu_items(*))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }

  return (data as OrderWithItems[]) || [];
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getAdminAnalytics(supabase: SupabaseClient) {
  const { data: orders } = await supabase.from("orders").select("*");
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*, menu_item:menu_items(name, category_id)");

  const allOrders = orders || [];
  const allItems = orderItems || [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayOrders = allOrders.filter((o) => new Date(o.created_at) >= startOfDay);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Status breakdown
  const statusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  };
  allOrders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) {
      statusCounts[o.status]++;
    }
  });

  // Top items breakdown
  const itemQtyMap: Record<string, { name: string; quantity: number }> = {};
  allItems.forEach((item) => {
    const name = (item.menu_item as { name?: string } | undefined)?.name || "Unknown Item";
    if (!itemQtyMap[name]) {
      itemQtyMap[name] = { name, quantity: 0 };
    }
    itemQtyMap[name].quantity += item.quantity || 0;
  });

  const topItems = Object.values(itemQtyMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    todayOrdersCount: todayOrders.length,
    todayRevenue,
    totalOrders,
    totalRevenue,
    avgOrderValue,
    statusCounts,
    topItems,
  };
}
