import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Dimensions, 
  SafeAreaView, 
  StatusBar,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { theme } from '../theme/theme';
import MoodSlider from '../components/MoodSlider';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import DailyAffirmation from '../components/DailyAffirmation';
import { recentMoodEntries, recommendedActivities } from '../data/mockData';
import { MoodRating } from '../types';
import { fetchInspirationalQuote, Quote } from '../services/geminiService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // State for selected mood (just for UI demonstration)
  const [selectedMood, setSelectedMood] = useState<MoodRating>(3);
  
  // State for quote
  const [dailyQuote, setDailyQuote] = useState<Quote>({
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  });
  
  // Loading state for quote
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  
  // Refreshing state for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  
  // Get the most recent mood entry
  const latestMood = recentMoodEntries[0];
  
  // Calculate average mood for the last 5 entries
  const averageMood = recentMoodEntries.reduce((sum, entry) => sum + entry.rating, 0) / recentMoodEntries.length;
  
  // User name (would come from user profile in a real app)
  const userName = "Alex";
  
  // Function to fetch a new quote
  const getNewQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    try {
      const newQuote = await fetchInspirationalQuote();
      setDailyQuote(newQuote);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);
  
  // Fetch quote on component mount
  useEffect(() => {
    getNewQuote();
  }, [getNewQuote]);
  
  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getNewQuote();
    setRefreshing(false);
  }, [getNewQuote]);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.card}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey {userName},</Text>
          <Text style={styles.subGreeting}>let's make today great! ✨</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        
        <View style={styles.quoteContainer}>
          <DailyAffirmation 
            quote={dailyQuote.quote} 
            author={dailyQuote.author} 
            isLoading={isLoadingQuote}
          />
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={getNewQuote}
            disabled={isLoadingQuote}
          >
            <Text style={styles.refreshButtonText}>New Quote</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.moodCheckInContainer}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <MoodSlider value={selectedMood} onValueChange={setSelectedMood} />
        </View>
        
        <View style={styles.moodSummaryContainer}>
          <Text style={styles.sectionTitle}>Your Mood Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Today</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(latestMood.rating) }
                ]}>
                  {latestMood ? getMoodEmoji(latestMood.rating) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Avg</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: getMoodColor(Math.round(averageMood)) }
                ]}>
                  {averageMood ? getMoodEmoji(Math.round(averageMood) as 1|2|3|4|5) : '–'}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Streak</Text>
                <Text style={[styles.summaryValue, styles.streakValue]}>5 days</Text>
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
  quoteContainer: {
    position: 'relative',
  },
  refreshButton: {
    position: 'absolute',
    right: 0,
    bottom: 28,
    backgroundColor: theme.colors.primary + '33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  refreshButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: theme.fontWeights.medium,
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
});