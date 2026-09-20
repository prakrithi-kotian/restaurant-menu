export type AvailabilityStatus = 'available' | 'temporary_unavailable' | 'out_of_stock';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  availability_status: AvailabilityStatus;
  available_at?: string | null;
  status_note?: string | null;
  is_trending: boolean;
  trending_order?: number | null;
  preparation_time?: number | null;
  created_at: string;
  updated_at?: string | null;
  category?: Category;
}

export interface Order {
  id: string;
  table_number?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  created_at: string;
  menu_item?: MenuItem;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { menu_item?: MenuItem })[];
}

export interface MostOrderedItem {
  menu_item_id: string;
  total_quantity: number;
  menuItem?: MenuItem;
}
