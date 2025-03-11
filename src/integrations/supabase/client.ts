
import { createClient } from '@supabase/supabase-js';

// Supabase client
export const supabase = createClient(
  'https://nsaihorptygenpbguarw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYWlob3JwdHlnZW5wYmd1YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTQzMzQsImV4cCI6MjA1NjkzMDMzNH0.bYD_vn4O8SmJvE4HW-yy-03VqUBT0pUIX5iV2VesZZA'
);
