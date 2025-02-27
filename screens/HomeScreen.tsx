import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, StatusBar, AppState, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import MoodSlider from '../components/MoodSlider';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import QuoteComponent from '../components/QuoteComponent';
import { MoodRating, MoodEntry } from '../types';
import { getCurrentUser } from '../services/authService';
import { getTodaysMoodEntry, getRecentMoodEntries, calculateMoodStats } from '../services/moodService';
import { recommendedActivities } from '../data/mockData';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // State for mood data
  const [selectedMood, setSelectedMood] = useState<MoodRating>(3);
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [moodStats, setMoodStats] = useState({ average: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  
  // State to force quote refresh
  const [quoteKey, setQuoteKey] = useState(Date.now());
  
  // User state
  const [userId, setUserId] = useState<string | null>(null);
  
  // Load user and mood data
  useEffect(() => {
    const loadUserAndMoodData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const user = await getCurrentUser();
        
        if (!user) {
          console.log('No user logged in');
          setLoading(false);
          return;
        }
        
        setUserId(user.id);
        
        // Get today's mood entry
        const todayEntry = await getTodaysMoodEntry(user.id);
        
        if (todayEntry) {
          setTodaysMood(todayEntry);
          setSelectedMood(todayEntry.rating);
        }
        
        // Get recent mood entries
        const recentEntries = await getRecentMoodEntries(user.id, 7);
        setRecentMoods(recentEntries);
        
        // Calculate mood stats
        const stats = await calculateMoodStats(user.id);
        setMoodStats(stats);
        
      } catch (error) {
        console.error('Error loading mood data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserAndMoodData();
  }, []);
  
  // Listen for app state changes to refresh quote and mood data
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground, refresh quote
        setQuoteKey(Date.now());
        
        // Refresh mood data if user is logged in
        if (userId) {
          refreshMoodData(userId);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [userId]);
  
  // Function to refresh mood data
  const refreshMoodData = async (userId: string) => {
    try {
      // Get today's mood entry
      const todayEntry = await getTodaysMoodEntry(userId);
      
      if (todayEntry) {
        setTodaysMood(todayEntry);
        setSelectedMood(todayEntry.rating);
      }
      
      // Get recent mood entries
      const recentEntries = await getRecentMoodEntries(userId, 7);
      setRecentMoods(recentEntries);
      
      // Calculate mood stats
      const stats = await calculateMoodStats(userId);
      setMoodStats(stats);
      
    } catch (error) {
      console.error('Error refreshing mood data:', error);
    }
  };
  
  // Handle mood change
  const handleMoodChange = (mood: MoodRating) => {
    setSelectedMood(mood);
  };
  
  // Check if today's entry can be edited
  const canEditToday = () => {
    // If there's no entry yet, it can be edited
    if (!todaysMood) return true;
    
    // If the entry was created today, it can be edited
    const today = new Date().toISOString().split('T')[0];
    return todaysMood.date === today;
  };
  
  // Get user's first name
  const getUserFirstName = () => {
    // This would normally come from the user profile
    return "Alex";
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.greeting}>Hey {getUserFirstName()},</Text>
          <Text style={styles.subGreeting}>let's make today great! ✨</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        
        <QuoteComponent key={quoteKey} />
        
        <View style={styles.moodCheckInContainer}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <MoodSlider 
            value={selectedMood} 
            onValueChange={handleMoodChange}
            initialValue={todaysMood?.rating || 3}
            isEditable={canEditToday()}
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
                  { color: getMoodColor(todaysMood?.rating || 0) }
                ]}>
                  {todaysMood ? getMoodEmoji(todaysMood.rating) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Avg</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(Math.round(moodStats.average)) }
                ]}>
                  {moodStats.average > 0 ? getMoodEmoji(Math.round(moodStats.average) as MoodRating) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Streak</Text>
                <Text style={[styles.summaryValue, styles.streakValue]}>
                  {moodStats.streak} {moodStats.streak === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
            
            <View style={styles.trendContainer}>
              <Text style={styles.trendTitle}>Your Mood Trend</Text>
              <MoodTrendGraph moodEntries={recentMoods} />
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