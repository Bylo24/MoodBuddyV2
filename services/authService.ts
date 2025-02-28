import { supabase } from '../utils/supabaseClient';

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking auth status:', error.message);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error('Unexpected error in isAuthenticated:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in signInWithEmail:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in signUpWithEmail:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error in signOut:', error);
    throw error;
  }
};