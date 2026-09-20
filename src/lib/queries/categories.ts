import { SupabaseClient } from "@supabase/supabase-js";
import { Category } from "@/types/database";
import { INITIAL_CATEGORIES } from "@/lib/constants/seedData";

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("Error fetching categories:", error);
    return INITIAL_CATEGORIES;
  }

  return data;
}

export async function getAllCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("Error fetching all categories:", error);
    return INITIAL_CATEGORIES;
  }

  return data;
}
