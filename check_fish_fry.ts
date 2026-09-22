import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFishFry() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('name', 'Fish Fry');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Fish Fry:', JSON.stringify(data, null, 2));
  }
}

checkFishFry();
