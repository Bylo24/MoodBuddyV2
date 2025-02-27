import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { theme } from './theme/theme';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { isAuthenticated, signOut } from './services/authService';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Check if user is authenticated
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
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
      {isLoggedIn ? (
        <HomeScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
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