
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = (supabaseAccessToken) => {
    return createClient(supabaseUrl, supabaseKey, {
       global: {
          headers: {
             Authorization: `Bearer ${supabaseAccessToken}`,
             apikey: supabaseKey // 🔹 Add this
          }
       }
    });
 };
 export default supabaseClient;
        