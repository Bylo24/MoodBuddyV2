import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, StatusBar, AppState, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import MoodSlider from '../components/MoodSlider';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import QuoteComponent from '../components/QuoteComponent';
import Header from '../components/Header';
import ProfileModal from '../components/ProfileModal';
import { MoodRating } from '../types';
import { getTodayMoodEntry, getRecentMoodEntries, getMoodStreak, getWeeklyAverageMood, getCurrentWeekMoodEntries, getTodayDate, formatDate } from '../services/moodService';
import { getCurrentUser, isAuthenticated } from '../services/authService';
import { recommendedActivities } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  // State for selected mood (now can be null)
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState<number | null>(null);
  const [weeklyMoodEntries, setWeeklyMoodEntries] = useState<any[]>([]);
  const [todayMood, setTodayMood] = useState<MoodRating | null>(null);
  const [isSliderDisabled, setIsSliderDisabled] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>(getTodayDate());
  
  // State for mood trend graph refresh
  const [trendGraphKey, setTrendGraphKey] = useState(0);
  
  // State for profile modal
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  
  // State to force quote refresh
  const [quoteKey, setQuoteKey] = useState(Date.now());
  
  // Memoized refresh mood data function
  const refreshMoodData = useCallback(async () => {
    try {
      console.log('Refreshing mood data...');
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error or no session:', sessionError);
        return;
      }
      
      // Get the current date in YYYY-MM-DD format
      const today = getTodayDate();
      
      // Query mood entry for the current date
      const { data: todayEntry, error: todayError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .single();
      
      if (todayError) {
        if (todayError.code !== 'PGRST116') {
          console.error('Error fetching today\'s mood entry:', todayError);
        } else {
          console.log('No mood entry found for today');
          setTodayMood(null);
          setSelectedMood(null);
        }
      } else if (todayEntry) {
        console.log('Today\'s mood entry found:', todayEntry);
        setTodayMood(todayEntry.rating);
        setSelectedMood(todayEntry.rating);
      }
      
      // Load streak
      const { data: allEntries, error: entriesError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (entriesError) {
        console.error('Error fetching all mood entries:', entriesError);
      } else {
        // Calculate streak
        const currentStreak = calculateStreak(allEntries);
        console.log('Current streak:', currentStreak);
        setStreak(currentStreak);
        
        // Get weekly entries
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Go back to Sunday
        const startDate = formatDate(startOfWeek);
        
        const weekEntries = allEntries.filter(entry => 
          entry.date >= startDate && entry.date <= today
        );
        
        console.log('Weekly entries:', weekEntries);
        setWeeklyMoodEntries(weekEntries);
        
        // Calculate weekly average
        if (weekEntries.length > 0) {
          const sum = weekEntries.reduce((total, entry) => total + entry.rating, 0);
          const avg = sum / weekEntries.length;
          console.log('Weekly average:', avg);
          setWeeklyAverage(avg);
        } else {
          setWeeklyAverage(null);
        }
      }
      
      // Force mood trend graph to refresh
      setTrendGraphKey(prev => prev + 1);
      
      console.log('Mood data refresh complete');
    } catch (error) {
      console.error('Error refreshing mood data:', error);
    }
  }, []);
  
  // Calculate streak from mood entries
  const calculateStreak = (entries: any[]): number => {
    if (!entries || entries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Get today's date
    const today = getTodayDate();
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    
    // Check if the most recent entry is from today or yesterday
    const mostRecentEntry = sortedEntries[0];
    const mostRecentDate = mostRecentEntry.date;
    
    // If most recent entry is older than yesterday, streak is broken
    if (mostRecentDate !== today && mostRecentDate !== yesterdayStr) {
      return 0;
    }
    
    // Start counting streak
    let streak = 1;
    let currentDate = new Date(mostRecentDate);
    
    // Create a map of dates with entries for faster lookup
    const dateMap = new Map();
    for (const entry of entries) {
      dateMap.set(entry.date, true);
    }
    
    // Loop through previous days to find consecutive entries
    for (let i = 1; i <= 365; i++) { // Check up to a year back
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = formatDate(currentDate);
      
      // Check if there's an entry for this date
      if (dateMap.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Load user data and mood information
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const isLoggedIn = await isAuthenticated();
        if (!isLoggedIn) {
          // Handle not authenticated state
          console.log('User not authenticated');
          onLogout();
          setIsLoading(false);
          return;
        }
        
        const user = await getCurrentUser();
        if (user) {
          // Extract name from email or use default
          const name = user.email ? user.email.split('@')[0] : 'Friend';
          setUserName(name);
          
          // Load mood data
          await refreshMoodData();
          
          // Set the current date
          setCurrentDate(getTodayDate());
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('Auth state changed, reloading user data');
        loadUserData();
      }
    });
    
    return () => {
      // Clean up auth listener
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [refreshMoodData, onLogout]);
  
  // Check for date changes when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        const today = getTodayDate();
        
        // Check if the date has changed
        if (today !== currentDate) {
          console.log('Date has changed. Updating current date and refreshing data.');
          setCurrentDate(today);
          refreshMoodData();
        }
        
        // Refresh quote
        setQuoteKey(Date.now());
      }
    });

    return () => {
      subscription.remove();
    };
  }, [currentDate, refreshMoodData]);
  
  // Handle mood change
  const handleMoodChange = (mood: MoodRating | null) => {
    console.log('Mood changed to:', mood);
    setSelectedMood(mood);
    
    // Immediately update today's mood in the UI if it's today
    if (mood !== null && currentDate === getTodayDate()) {
      setTodayMood(mood);
    }
  };
  
  // Handle mood saved
  const handleMoodSaved = async () => {
    console.log('Mood saved, refreshing data...');
    // Refresh all mood data when a new mood is saved
    await refreshMoodData();
  };
  
  // Handle profile button press
  const handleProfilePress = () => {
    setProfileModalVisible(true);
  };
  
  // Handle profile modal close
  const handleProfileModalClose = () => {
    setProfileModalVisible(false);
    
    // Refresh data when profile modal is closed (in case settings were changed)
    refreshMoodData();
  };
  
  function getMoodEmoji(rating: number | null): string {
    if (rating === null) return '–';
    switch (rating) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '–';
    }
  }
  
  function getMoodColor(rating: number | null): string {
    if (rating === null) return theme.colors.text;
    switch (rating) {
      case 1: return theme.colors.mood1;
      case 2: return theme.colors.mood2;
      case 3: return theme.colors.mood3;
      case 4: return theme.colors.mood4;
      case 5: return theme.colors.mood5;
      default: return theme.colors.text;
    }
  }
  
  if (isLoading) {
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
      
      <Header onProfilePress={handleProfilePress} />
      
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
            value={selectedMood} 
            onValueChange={handleMoodChange}
            onMoodSaved={handleMoodSaved}
            disabled={isSliderDisabled}
            date={currentDate}
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
                  { color: getMoodColor(todayMood) }
                ]}>
                  {getMoodEmoji(todayMood)}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Avg</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(weeklyAverage ? Math.round(weeklyAverage) : null) }
                ]}>
                  {weeklyAverage ? getMoodEmoji(Math.round(weeklyAverage) as MoodRating) : '–'}
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
              <MoodTrendGraph key={trendGraphKey} days={5} />
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
      
      <ProfileModal 
        visible={profileModalVisible} 
        onClose={handleProfileModalClose}
        onLogout={onLogout}
      />
    </SafeAreaView>
  );
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
    paddingTop: 0, // Reduced because we now have a header
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
});