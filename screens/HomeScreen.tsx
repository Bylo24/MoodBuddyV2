import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import MoodButton from '../components/MoodButton';
import ActivityCard from '../components/ActivityCard';
import { recentMoodEntries, recommendedActivities } from '../data/mockData';

export default function HomeScreen() {
  // Get the most recent mood entry
  const latestMood = recentMoodEntries[0];
  
  // Calculate average mood for the last 5 entries
  const averageMood = recentMoodEntries.reduce((sum, entry) => sum + entry.rating, 0) / recentMoodEntries.length;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello there!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      
      <View style={styles.moodCheckInContainer}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodButtonsContainer}>
          <MoodButton rating={1} label="Terrible" emoji="😢" />
          <MoodButton rating={2} label="Not Good" emoji="😕" />
          <MoodButton rating={3} label="Okay" emoji="😐" />
          <MoodButton rating={4} label="Good" emoji="🙂" />
          <MoodButton rating={5} label="Great" emoji="😄" />
        </View>
      </View>
      
      <View style={styles.moodSummaryContainer}>
        <Text style={styles.sectionTitle}>Your Mood Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryValue}>
              {latestMood ? getMoodEmoji(latestMood.rating) : '–'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Weekly Average</Text>
            <Text style={styles.summaryValue}>
              {averageMood ? getMoodEmoji(Math.round(averageMood) as 1|2|3|4|5) : '–'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Streak</Text>
            <Text style={styles.summaryValue}>5 days</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Recommended Activities</Text>
        <Text style={styles.sectionSubtitle}>Based on your recent mood patterns</Text>
        
        {recommendedActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
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
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.subtext,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  activitiesContainer: {
    marginBottom: theme.spacing.xl,
  },
});