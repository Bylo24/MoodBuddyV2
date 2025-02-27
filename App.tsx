import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, LogBox } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { theme } from './theme/theme';

// Ignore specific warnings if needed
// LogBox.ignoreLogs(['Warning: ...']);

export default function App() {
  // Set up console logging for debugging
  useEffect(() => {
    console.log('App initialized');
    
    // Override console.error to make errors more visible
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError('🔴 ERROR:', ...args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});