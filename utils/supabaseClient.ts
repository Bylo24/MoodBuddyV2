import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://yzfnrdcuafamsjkppmka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Zm5yZGN1YWZhbXNqa3BwbWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NzA0NzcsImV4cCI6MjAzMTQ0NjQ3N30.Yx-Ky-Ux-Ux-Yx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    // Set a short timeout of 10 seconds
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    },
  },
});

// Log the Supabase URL and key for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');