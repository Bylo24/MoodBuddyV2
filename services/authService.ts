import { supabase } from '../utils/supabaseClient';

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
    return !!session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user ? `${user.id} (${user.email})` : 'No user');
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to retry a function with exponential backoff
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error.message || error);
      lastError = error;
      
      // If it's not a network error or timeout, don't retry
      if (error.message && !error.message.includes('network') && !error.message.includes('timeout') && !error.message.includes('abort')) {
        throw error;
      }
      
      // Wait before next retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign in with email:', email);
  
  return retryOperation(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      throw error;
    }
    
    console.log('Sign in successful:', data.user?.id);
    return data;
  });
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign up with email:', email);
  
  return retryOperation(async () => {
    // Create a new account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      throw error;
    }
    
    console.log('Sign up response:', data);
    
    // If we have a user but no session, try to sign in immediately
    if (data.user && !data.session) {
      console.log('User created but no session, attempting immediate sign in');
      return await signInWithEmail(email, password);
    }
    
    return data;
  });
};

// Sign out
export const signOut = async () => {
  console.log('Attempting to sign out');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
    console.log('Sign out successful');
  } catch (error: any) {
    console.error('Error signing out:', error.message || error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  console.log('Attempting to reset password for:', email);
  
  return retryOperation(async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Password reset error:', error.message);
      throw error;
    }
    
    console.log('Password reset email sent');
  });
};