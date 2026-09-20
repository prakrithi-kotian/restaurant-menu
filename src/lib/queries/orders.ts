import { SupabaseClient } from "@supabase/supabase-js";
import { OrderWithItems } from "@/types/database";

export interface CreateOrderPayload {
  table_number?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  items: {
    menu_item_id: string;
    quantity: number;
  }[];
}

export async function createOrder(
  supabase: SupabaseClient,
  payload: CreateOrderPayload
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  // Validate quantities before any DB work
  for (const item of payload.items) {
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    ) {
      return { success: false, error: "Invalid item quantity." };
    }
  }

  const itemIds = payload.items.map((i) => i.menu_item_id);

  // Fetch current menu items state from database (DO NOT TRUST CLIENT)
  const { data: dbItems, error: fetchError } = await supabase
    .from("menu_items")
    .select("id, name, price, availability_status, available_at")
    .in("id", itemIds);

  if (fetchError || !dbItems) {
    return { success: false, error: "Failed to verify menu items availability." };
  }

  const dbItemsMap = new Map(dbItems.map((item) => [item.id, item]));
  const now = new Date();

  // Validate item availability & calculate total using database prices
  let computedTotal = 0;
  const orderItemsToInsert: {
    menu_item_id: string;
    quantity: number;
    price: number;
  }[] = [];

  for (const requestedItem of payload.items) {
    const dbItem = dbItemsMap.get(requestedItem.menu_item_id);
    if (!dbItem) {
      return { success: false, error: "One or more items are no longer available in our menu." };
    }

    // Check availability status
    if (dbItem.availability_status === "out_of_stock") {
      return {
        success: false,
        error: `"${dbItem.name}" is currently out of stock. Please adjust your cart.`,
      };
    }

    if (dbItem.availability_status === "temporary_unavailable") {
      if (dbItem.available_at) {
        const availableTime = new Date(dbItem.available_at);
        if (availableTime > now) {
          return {
            success: false,
            error: `"${dbItem.name}" is temporarily unavailable. Ready in a few minutes.`,
          };
        }
      } else {
        return {
          success: false,
          error: `"${dbItem.name}" is currently unavailable.`,
        };
      }
    }

    const itemPrice = Number(dbItem.price) || 0;
    computedTotal += itemPrice * requestedItem.quantity;

    orderItemsToInsert.push({
      menu_item_id: dbItem.id,
      quantity: requestedItem.quantity,
      price: itemPrice,
    });
  }

  // Helper for generating UUID in browser or server
  const orderId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

  // 1. Insert order
  const { error: orderInsertError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      table_number: payload.table_number || null,
      customer_name: payload.customer_name || null,
      customer_phone: payload.customer_phone || null,
      total_amount: computedTotal,
      status: "pending",
    });

  if (orderInsertError) {
    console.error("Error creating order:", orderInsertError);
    return { success: false, error: "Failed to place order. Please try again." };
  }

  // 2. Insert order items
  const itemsWithOrderId = orderItemsToInsert.map((item) => ({
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }),
    ...item,
    order_id: orderId,
  }));

  const { error: itemsInsertError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsInsertError) {
    console.error("Error inserting order items:", itemsInsertError);
    // Cleanup created order if item insertion fails
    await supabase.from("orders").delete().eq("id", orderId);
    return { success: false, error: "Failed to save order details. Please try again." };
  }

  return { success: true, orderId };
}

export async function getOrderById(
  supabase: SupabaseClient,
  orderId: string
): Promise<OrderWithItems | null> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return null;
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*, menu_item:menu_items(*)")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
  }

  return {
    ...order,
    order_items: orderItems || [],
  };
}
