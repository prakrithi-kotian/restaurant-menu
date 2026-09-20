-- Safe & Idempotent Supabase SQL Seed Script for Udupi Lunch Home Menu

-- 1. Insert or Update Categories
INSERT INTO categories (id, name, display_order, is_active, created_at)
VALUES 
  ('cat-1', 'Meal Thalis', 1, true, NOW()),
  ('cat-2', 'Chicken', 2, true, NOW()),
  ('cat-3', 'Fish', 3, true, NOW()),
  ('cat-4', 'Mutton', 4, true, NOW()),
  ('cat-5', 'Rice & Biryani', 5, true, NOW()),
  ('cat-6', 'South Indian', 6, true, NOW()),
  ('cat-7', 'Veg', 7, true, NOW()),
  ('cat-8', 'Sides', 8, true, NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. Upsert Udupi Lunch Home Menu Items (Safe: Does not break foreign keys or delete existing orders)
INSERT INTO menu_items (
  id, 
  category_id, 
  name, 
  description, 
  price, 
  image_url, 
  availability_status, 
  available_at,
  status_note,
  is_trending, 
  trending_order, 
  preparation_time, 
  created_at
)
VALUES 
    -- MEAL THALIS
  ('item-1', 'cat-1', 'Chicken Thali', 'Boiled/White Rice, Chicken Gravy, 2 pcs Neer Dosa/Chapati, Chicken Sukka, 1 pcs Chicken Kabab, Veg Baiji, Pickle, Dry Fish Chutney', 249, '/images/menu/chicken-thali.jpg', 'available', NULL, NULL, true, 1, 20, NOW()),
  ('item-2', 'cat-1', 'Fish Thali', 'Boiled/White Rice, Neer Dosa/Chapati, Fish Fry, Veg Baiji, Fish Chutney', 249, '/images/menu/fish-thali.jpg', 'available', NULL, NULL, false, NULL, 20, NOW()),
  ('item-3', 'cat-1', 'Veg Thali', 'Boiled/White Rice, Dal/Rasam, Chapati, Veg Baiji, Dry Chutney, Papad, Pickle', 199, '/images/menu/veg-thali.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),

  -- RICE & BIRYANI
  ('item-4', 'cat-5', 'Ghee Rice Kabab', 'Ghee rice served with juicy chicken kabab pieces, Dal and Green Gravy', 149, '/images/menu/ghee-rice-kabab.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),
  ('item-5', 'cat-5', 'Biryani Combo', 'Chicken Biryani served with salad, 2 pcs Kabab and Thums Up 200ml', 199, '/images/menu/biryani-combo.jpg', 'available', NULL, NULL, true, 2, 25, NOW()),
  ('item-13', 'cat-5', 'Donne Biryani', 'A flavorful, signature South Indian rice dish', 249, '/images/menu/donne-biryani.jpg', 'available', NULL, NULL, false, NULL, 25, NOW()),

  -- SOUTH INDIAN
  ('item-6', 'cat-6', 'Neerdosa 1 Plate', '4 pieces Neerdosa', 80, '/images/menu/neer-dosa.jpg', 'available', NULL, NULL, false, NULL, 10, NOW()),
  ('item-7', 'cat-6', 'Chapati 1 Plate', '4 pieces Chapati', 60, '/images/menu/chapati.jpg', 'available', NULL, NULL, false, NULL, 10, NOW()),
  ('item-8', 'cat-6', 'Pundi Chicken Gassi', 'Steamed rice dumplings (Pundi) served in rich coconut-based Chicken Gassi gravy', 199, '/images/menu/pundi-chicken-gassi.jpg', 'available', NULL, NULL, false, NULL, 20, NOW()),
  ('item-9', 'cat-6', 'Kori Rotti Sukka', 'Crispy rice wafers (Kori Rotti) with Chicken Sukka', 249, '/images/menu/kori-rotti-sukka.jpg', 'available', NULL, NULL, false, NULL, 20, NOW()),
  

  -- MUTTON
  ('item-10', 'cat-4', 'Mutton Ghee Roast', 'Traditional Mangalorean style slow-cooked Mutton Ghee Roast', 499, '/images/menu/mutton-ghee-roast.jpg', 'available', NULL, NULL, false, NULL, 30, NOW()),
  ('item-11', 'cat-4', 'Mutton Pepper Fry', 'Dry Mutton stir-fry loaded with black pepper and spices', 499, '/images/menu/mutton-pepper-fry.jpg', 'available', NULL, NULL, false, NULL, 25, NOW()),

  -- CHICKEN
  ('item-12', 'cat-2', 'Chicken Sukka', 'Dry, spicy chicken preparation with coconut and spices', 180, '/images/menu/chicken-sukka.jpg', 'available', NULL, NULL, false, NULL, 20, NOW()),
  ('item-14', 'cat-2', 'Chicken Pepper Fry', 'Spicy chicken stir-fry with crushed pepper', 249, '/images/menu/chicken-pepper-fry.jpg', 'available', NULL, NULL, false, NULL, 20, NOW()),
  ('item-15', 'cat-2', '1 Plate Chicken Kabab', 'Juicy and flavorful chicken kababs served hot', 180, '/images/menu/chicken-kabab.jpg', 'available', NULL, NULL, true, 3, 15, NOW()),

  -- SIDES
  ('item-18', 'cat-8', 'Chicken Kabab', 'Juicy coastal fried chicken kababs loaded with Mangalorean spices', 180, '/images/menu/chicken-kabab.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),
  ('item-19', 'cat-8', 'Chicken Sukka (Side)', 'Classic Mangalorean roasted chicken with grated coconut', 180, '/images/menu/chicken-sukka.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),

  -- VEG
  ('item-16', 'cat-7', 'Panner Pepper Fry', 'Cubes of Panner tossed with crushed pepper and spices', 249, '/images/menu/paneer-pepper-fry.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),
  ('item-17', 'cat-7', 'Panner Chilli', 'Panner tossed in spicy chilli sauce with vegetables', 249, '/images/menu/paneer-chilli.jpg', 'available', NULL, NULL, false, NULL, 15, NOW()),

  -- FISH
  ('item-21', 'cat-3', 'Fish Fry', 'Fresh coastal fish fry marinated with authentic Mangalorean spices', 249, '/images/menu/fish-fry.jpg', 'available', NULL, NULL, false, NULL, 20, NOW())
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  preparation_time = EXCLUDED.preparation_time;
