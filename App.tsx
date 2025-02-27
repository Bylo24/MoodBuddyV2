import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { theme } from './theme/theme';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SetupNameScreen from './screens/SetupNameScreen';
import { isAuthenticated, signOut, getCurrentUser } from './services/authService';
import { supabase } from './utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define app states
type AppState = 'loading' | 'login' | 'onboarding' | 'home';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  
  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session:', session ? 'Present' : 'None');
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, checking onboarding status');
        checkOnboardingStatus();
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out, updating UI');
        setAppState('login');
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Check if user is authenticated
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      console.log('Checking authentication status...');
      const authenticated = await isAuthenticated();
      console.log('Authentication check result:', authenticated);
      
      if (authenticated) {
        await checkOnboardingStatus();
      } else {
        setAppState('login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAppState('login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      // Check if user has a name set
      const storedName = await AsyncStorage.getItem('user_display_name');
      
      if (storedName) {
        console.log('User has completed onboarding, proceeding to home');
        setUserName(storedName);
        setAppState('home');
      } else {
        // Get user email to extract name if available
        const user = await getCurrentUser();
        if (user?.email) {
          const emailName = user.email.split('@')[0];
          setUserName(emailName);
        }
        
        console.log('User needs to complete onboarding');
        setAppState('onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setAppState('onboarding');
    }
  };
  
  // Handle login
  const handleLogin = () => {
    console.log('Login successful, checking onboarding status');
    checkOnboardingStatus();
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = async (name: string) => {
    console.log('Onboarding complete with name:', name);
    try {
      await AsyncStorage.setItem('user_display_name', name);
      setUserName(name);
      setAppState('home');
    } catch (error) {
      console.error('Error saving user name:', error);
      // Proceed anyway
      setAppState('home');
    }
  };
  
  // Handle onboarding skip
  const handleOnboardingSkip = async () => {
    console.log('Onboarding skipped');
    // If we have a username from email, use that
    if (userName) {
      try {
        await AsyncStorage.setItem('user_display_name', userName);
      } catch (error) {
        console.error('Error saving default user name:', error);
      }
    }
    setAppState('home');
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signOut();
      console.log('Logout successful, updating UI');
      setAppState('login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Mood Buddy...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {appState === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {appState === 'onboarding' && (
        <SetupNameScreen 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      {appState === 'home' && (
        <HomeScreen onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
});