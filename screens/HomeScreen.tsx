import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import MoodButton from '../components/MoodButton';
import ActivityCard from '../components/ActivityCard';
import MoodTrendGraph from '../components/MoodTrendGraph';
import DailyAffirmation from '../components/DailyAffirmation';
import { recentMoodEntries, recommendedActivities } from '../data/mockData';
import { MoodRating } from '../types';

export default function HomeScreen() {
  // State for selected mood (just for UI demonstration)
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  
  // Get the most recent mood entry
  const latestMood = recentMoodEntries[0];
  
  // Calculate average mood for the last 5 entries
  const averageMood = recentMoodEntries.reduce((sum, entry) => sum + entry.rating, 0) / recentMoodEntries.length;
  
  // Daily affirmation
  const dailyAffirmation = {
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  };
  
  // User name (would come from user profile in a real app)
  const userName = "Alex";
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey {userName}, let's make today great! 😊</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      
      <DailyAffirmation quote={dailyAffirmation.quote} author={dailyAffirmation.author} />
      
      <View style={styles.moodCheckInContainer}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodButtonsContainer}>
          <MoodButton 
            rating={1} 
            label="Terrible" 
            emoji="😢" 
            selected={selectedMood === 1}
            onPress={() => setSelectedMood(1)}
          />
          <MoodButton 
            rating={2} 
            label="Not Good" 
            emoji="😕" 
            selected={selectedMood === 2}
            onPress={() => setSelectedMood(2)}
          />
          <MoodButton 
            rating={3} 
            label="Okay" 
            emoji="😐" 
            selected={selectedMood === 3}
            onPress={() => setSelectedMood(3)}
          />
          <MoodButton 
            rating={4} 
            label="Good" 
            emoji="🙂" 
            selected={selectedMood === 4}
            onPress={() => setSelectedMood(4)}
          />
          <MoodButton 
            rating={5} 
            label="Great" 
            emoji="😄" 
            selected={selectedMood === 5}
            onPress={() => setSelectedMood(5)}
          />
        </View>
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
              <Text style={styles.summaryLabel}>Weekly Average</Text>
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
        <Text style={styles.sectionTitle}>Recommended Activities</Text>
        <Text style={styles.sectionSubtitle}>Based on your recent mood patterns</Text>
        
        <View style={styles.activitiesGrid}>
          {recommendedActivities.slice(0, 2).map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <ActivityCard activity={activity} />
            </View>
          ))}
        </View>
        
        <View style={styles.activitiesGrid}>
          {recommendedActivities.slice(2, 4).map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <ActivityCard activity={activity} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    lineHeight: theme.lineHeights.tight * theme.fontSizes.xxl,
  },
  date: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.subtext,
    marginTop: theme.spacing.xs,
  },
  moodCheckInContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: theme.lineHeights.tight * theme.fontSizes.xl,
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.subtext,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    lineHeight: theme.lineHeights.normal * theme.fontSizes.md,
  },
  moodButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodSummaryContainer: {
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.lineHeights.normal * theme.fontSizes.sm,
  },
  summaryValue: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
  },
  streakValue: {
    color: theme.colors.accent,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  trendContainer: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  trendTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  activitiesContainer: {
    marginBottom: theme.spacing.xl,
  },
  activitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  activityItem: {
    width: '48%',
  },
});