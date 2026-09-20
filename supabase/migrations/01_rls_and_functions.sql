-- Supabase SQL Migration Script for Restaurant QR Ordering System
-- Run this in Supabase SQL Editor if RLS policies need initialization

-- Enable RLS on core tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- 1. Public Reads for Categories & Menu Items
CREATE POLICY "Allow public read active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read menu items" ON menu_items
  FOR SELECT USING (true);

-- 2. Public Creation for Orders & Order Items
CREATE POLICY "Allow public insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read order_items" ON order_items
  FOR SELECT USING (true);

-- 3. Admin Policies for Full Management
CREATE POLICY "Allow admin full access categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin full access menu_items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin full access orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin full access order_items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Allow admin read admin_profiles" ON admin_profiles
  FOR SELECT USING (
    admin_profiles.id = auth.uid()
  );
