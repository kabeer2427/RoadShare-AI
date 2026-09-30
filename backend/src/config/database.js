import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.warn('⚠️ Supabase URL or Service Key missing. Database queries will fail.');
}

// We use the service_role key on the backend to bypass RLS for admin/system level operations
// For user operations, we should instantiate a client with the user's JWT or rely on our backend logic.
export const supabase = createClient(
  config.supabaseUrl || 'http://localhost:54321',
  config.supabaseServiceKey || 'dummy_key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
