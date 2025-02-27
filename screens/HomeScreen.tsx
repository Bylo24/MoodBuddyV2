import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, StatusBar, AppState, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../theme/theme';
import MoodSlider from '../components/MoodSlider';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import QuoteComponent from '../components/QuoteComponent';
import { recommendedActivities } from '../data/mockData';
import { MoodRating } from '../types';
import { getRecentMoodEntries, getAverageMood, getMoodStreak, MoodEntry } from '../services/moodService';
import { isAuthenticated, getCurrentUser } from '../utils/supabaseClient';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // State for mood data
  const [selectedMood, setSelectedMood] = useState<MoodRating>(3);
  const [recentMoodEntries, setRecentMoodEntries] = useState<MoodEntry[]>([]);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Friend");
  
  // State to force quote refresh
  const [quoteKey, setQuoteKey] = useState(Date.now());
  
  // Load user data and mood entries
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        Alert.alert(
          "Not Logged In",
          "Please log in to track your mood.",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }
      
      // Get user info
      const user = await getCurrentUser();
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
      
      // Load mood data
      const entries = await getRecentMoodEntries(7);
      setRecentMoodEntries(entries);
      
      // Get average mood
      const avgMood = await getAverageMood(7);
      setAverageMood(avgMood);
      
      // Get streak
      const currentStreak = await getMoodStreak();
      setStreak(currentStreak);
      
      // Set selected mood from today's entry if available
      const todayEntry = entries.find(entry => entry.date === new Date().toISOString().split('T')[0]);
      if (todayEntry) {
        setSelectedMood(todayEntry.rating);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert(
        "Error",
        "Failed to load your mood data. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);
  
  // Listen for app state changes to refresh data and quote when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        loadUserData();
        setQuoteKey(Date.now());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  // Handle mood change
  const handleMoodChange = (mood: MoodRating) => {
    setSelectedMood(mood);
  };
  
  // Handle mood save completion
  const handleMoodSaveComplete = () => {
    // Reload data to update averages, streak, etc.
    loadUserData();
  };
  
  // Get today's mood entry
  const getTodayMood = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return recentMoodEntries.find(entry => entry.date === today);
  };
  
  // Get latest mood entry
  const getLatestMood = (): MoodEntry | undefined => {
    return recentMoodEntries[0];
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your mood data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey {userName},</Text>
          <Text style={styles.subGreeting}>let's make today great! ✨</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        
        <QuoteComponent key={quoteKey} />
        
        <View style={styles.moodCheckInContainer}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <MoodSlider 
            initialValue={selectedMood} 
            onValueChange={handleMoodChange}
            onSaveComplete={handleMoodSaveComplete}
          />
        </View>
        
        <View style={styles.moodSummaryContainer}>
          <Text style={styles.sectionTitle}>Your Mood Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Today</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(getTodayMood()?.rating || 0) }
                ]}>
                  {getTodayMood() ? getMoodEmoji(getTodayMood()!.rating) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Avg</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(Math.round(averageMood || 0)) }
                ]}>
                  {averageMood ? getMoodEmoji(Math.round(averageMood) as MoodRating) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Streak</Text>
                <Text style={[styles.summaryValue, styles.streakValue]}>{streak} days</Text>
              </View>
            </View>
            
            <View style={styles.trendContainer}>
              <Text style={styles.trendTitle}>Your Mood Trend</Text>
              <MoodTrendGraph moodEntries={recentMoodEntries} />
            </View>
          </View>
        </View>
        
        <View style={styles.activitiesContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recommended Activities</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Based on your recent mood patterns</Text>
          
          {recommendedActivities.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <ActivityCard activity={activity} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getMoodEmoji(rating: number): string {
  switch (rating) {
    case 1: return '😢';
    case 2: return '😕';
    case 3: return '😐';
    case 4: return '🙂';
    case 5: return '😄';
    default: return '–';
  }
}

function getMoodColor(rating: number): string {
  switch (rating) {
    case 1: return theme.colors.mood1;
    case 2: return theme.colors.mood2;
    case 3: return theme.colors.mood3;
    case 4: return theme.colors.mood4;
    case 5: return theme.colors.mood5;
    default: return theme.colors.text;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width for horizontal padding
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: 22,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: theme.colors.subtext,
    marginTop: 4,
  },
  moodCheckInContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: -8,
    marginBottom: 16,
  },
  moodSummaryContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: theme.fontWeights.bold,
  },
  streakValue: {
    color: theme.colors.accent,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
  trendContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  activitiesContainer: {
    marginBottom: 16,
  },
  activityItem: {
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
});