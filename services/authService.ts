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

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign in with email:', email);
  try {
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
  } catch (error: any) {
    console.error('Error signing in:', error.message || error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  console.log('Attempting to sign up with email:', email);
  try {
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
  } catch (error: any) {
    console.error('Error signing up:', error.message || error);
    throw error;
  }
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
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Password reset error:', error.message);
      throw error;
    }
    
    console.log('Password reset email sent');
  } catch (error: any) {
    console.error('Error resetting password:', error.message || error);
    throw error;
  }
};