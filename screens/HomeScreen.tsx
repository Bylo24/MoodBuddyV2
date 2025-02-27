import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, StatusBar, AppState, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import MoodSlider from '../components/MoodSlider';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import QuoteComponent from '../components/QuoteComponent';
import Header from '../components/Header';
import ProfileModal from '../components/ProfileModal';
import { MoodRating } from '../types';
import { getTodayMoodEntry, getRecentMoodEntries, getMoodStreak, getAverageMood } from '../services/moodService';
import { getCurrentUser, isAuthenticated } from '../services/authService';
import { recommendedActivities } from '../data/mockData';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // State for selected mood (just for UI demonstration)
  const [selectedMood, setSelectedMood] = useState<MoodRating>(3);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [todayMood, setTodayMood] = useState<MoodRating | null>(null);
  const [isSliderDisabled, setIsSliderDisabled] = useState(false);
  
  // State for profile modal
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  
  // State to force quote refresh
  const [quoteKey, setQuoteKey] = useState(Date.now());
  
  // Load user data and mood information
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const isLoggedIn = await isAuthenticated();
        if (!isLoggedIn) {
          // Handle not authenticated state
          console.log('User not authenticated');
          setIsLoading(false);
          return;
        }
        
        const user = await getCurrentUser();
        if (user) {
          // Extract name from email or use default
          const name = user.email ? user.email.split('@')[0] : 'Friend';
          setUserName(name);
          
          // Load mood data
          const todayEntry = await getTodayMoodEntry();
          if (todayEntry) {
            setTodayMood(todayEntry.rating);
            setSelectedMood(todayEntry.rating);
          }
          
          // Load streak
          const currentStreak = await getMoodStreak();
          setStreak(currentStreak);
          
          // Load average mood
          const avgMood = await getAverageMood(7);
          setAverageMood(avgMood);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Listen for app state changes to refresh quote when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground, refresh quote
        setQuoteKey(Date.now());
        
        // Also refresh mood data
        refreshMoodData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  // Refresh mood data
  const refreshMoodData = async () => {
    try {
      // Load today's mood
      const todayEntry = await getTodayMoodEntry();
      if (todayEntry) {
        setTodayMood(todayEntry.rating);
        setSelectedMood(todayEntry.rating);
      } else {
        setTodayMood(null);
      }
      
      // Load streak
      const currentStreak = await getMoodStreak();
      setStreak(currentStreak);
      
      // Load average mood
      const avgMood = await getAverageMood(7);
      setAverageMood(avgMood);
    } catch (error) {
      console.error('Error refreshing mood data:', error);
    }
  };
  
  // Handle mood change
  const handleMoodChange = (mood: MoodRating) => {
    setSelectedMood(mood);
  };
  
  // Handle profile button press
  const handleProfilePress = () => {
    setProfileModalVisible(true);
  };
  
  // Handle profile modal close
  const handleProfileModalClose = () => {
    setProfileModalVisible(false);
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
            disabled={isSliderDisabled}
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
                  { color: getMoodColor(averageMood ? Math.round(averageMood) : null) }
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
              <MoodTrendGraph days={5} />
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