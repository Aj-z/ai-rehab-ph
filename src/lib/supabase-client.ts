import { createBrowserClient } from '@supabase/ssr'
// Update the import path to the correct location of your Database type
import type { Database } from '../lib/database.types.ts' // Adjust the path as needed


export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}