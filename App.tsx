import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Context
import { AppProvider, useAppContext } from './context/AppContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import CheckInScreen from './screens/CheckInScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import InsightsScreen from './screens/InsightsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Constants
import { COLORS } from './constants/theme';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="CheckIn" 
        component={CheckInScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <Ionicons name="add" size={size} color={COLORS.white} />
            </View>
          ),
          tabBarLabel: 'Check In',
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// App container with navigation
const AppContainer = () => {
  const { isLoading } = useAppContext();
  
  useEffect(() => {
    // Request notification permissions
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };
    
    requestNotificationPermissions();
    
    // Schedule daily reminder notification
    const scheduleDailyReminder = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const trigger = {
        hour: 20, // 8 PM
        minute: 0,
        repeats: true,
      };
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Mood Check-in Reminder',
          body: 'How are you feeling today? Take a moment to check in with Mood Buddy.',
        },
        trigger,
      });
    };
    
    scheduleDailyReminder();
  }, []);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Mood Buddy...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

// Main App component
export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 10,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});