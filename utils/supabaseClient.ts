import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Use the correct URL and API key from environment variables
const supabaseUrl = 'https://yzfnrdcuafamsjkppmka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Zm5yZGN1YWZhbXNqa3BwbWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MjAyMTUsImV4cCI6MjA1NjE5NjIxNX0.1SSzASgQcrQAGFa4RxraBdROcwIbRknmBmU6Und3iOM';

console.log('Initializing Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('API Key:', supabaseAnonKey ? 'Set' : 'Not set');

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