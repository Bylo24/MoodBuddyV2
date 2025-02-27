import { supabase } from '../utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // For testing purposes, we'll use signUp without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email verification for now
        emailRedirectTo: undefined,
        data: {
          name: email.split('@')[0], // Use part of email as name
        }
      },
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      throw error;
    }
    
    // Check if user was created and session exists
    if (data.user && data.session) {
      console.log('Sign up successful with immediate session:', data.user.id);
      return data;
    } else if (data.user) {
      console.log('Sign up successful, email confirmation required:', data.user.id);
      // For testing, we'll try to sign in immediately
      return await signInWithEmail(email, password);
    } else {
      throw new Error('Failed to create user account');
    }
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
    await clearAuthState();
  } catch (error: any) {
    console.error('Error signing out:', error.message || error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  console.log('Attempting to reset password for:', email);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'moodbuddy://auth/reset-password',
    });
    
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

// Update password
export const updatePassword = async (password: string) => {
  console.log('Attempting to update password');
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      console.error('Password update error:', error.message);
      throw error;
    }
    
    console.log('Password updated successfully');
  } catch (error: any) {
    console.error('Error updating password:', error.message || error);
    throw error;
  }
};

// Store auth state in AsyncStorage
export const storeAuthState = async (session: any) => {
  try {
    await AsyncStorage.setItem('auth-session', JSON.stringify(session));
    console.log('Auth state stored in AsyncStorage');
  } catch (error) {
    console.error('Error storing auth state:', error);
  }
};

// Get auth state from AsyncStorage
export const getAuthState = async () => {
  try {
    const sessionStr = await AsyncStorage.getItem('auth-session');
    if (sessionStr) {
      console.log('Auth state retrieved from AsyncStorage');
      return JSON.parse(sessionStr);
    }
    console.log('No auth state found in AsyncStorage');
    return null;
  } catch (error) {
    console.error('Error getting auth state:', error);
    return null;
  }
};

// Clear auth state from AsyncStorage
export const clearAuthState = async () => {
  try {
    await AsyncStorage.removeItem('auth-session');
    console.log('Auth state cleared from AsyncStorage');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};