import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme/theme';
import MoodButton from '../components/MoodButton';
import ActivityCard from '../components/ActivityCard';
import { MoodRating, Activity } from '../types';
import { recentMoodEntries, recommendedActivities } from '../data/mockData';

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Calculate average mood from recent entries
  const averageMood = recentMoodEntries.length > 0
    ? (recentMoodEntries.reduce((sum, entry) => sum + entry.rating, 0) / recentMoodEntries.length).toFixed(1)
    : 'N/A';

  const handleMoodSelection = (rating: MoodRating) => {
    setSelectedMood(rating);
    // In a real app, you would save this to state/database
    console.log(`Selected mood: ${rating}`);
  };

  const handleActivityPress = (activity: Activity) => {
    // In a real app, you would navigate to activity details
    console.log(`Selected activity: ${activity.title}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.greeting}>How are you feeling today?</Text>
        </View>
        
        <View style={styles.moodSelector}>
          <FlatList
            data={[1, 2, 3, 4, 5] as MoodRating[]}
            renderItem={({ item }) => (
              <MoodButton
                rating={item}
                selected={selectedMood === item}
                onPress={handleMoodSelection}
              />
            )}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodButtonsContainer}
          />
        </View>
        
        {selectedMood && (
          <View style={styles.moodConfirmation}>
            <Text style={styles.confirmationText}>
              Thanks for sharing how you're feeling!
            </Text>
            <TouchableOpacity style={styles.addNoteButton}>
              <Text style={styles.addNoteText}>+ Add a note</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Mood Summary</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{averageMood}</Text>
              <Text style={styles.summaryLabel}>Avg. Mood</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{recentMoodEntries.length}</Text>
              <Text style={styles.summaryLabel}>Check-ins</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>7</Text>
              <Text style={styles.summaryLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedActivities.slice(0, 3).map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={handleActivityPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  moodSelector: {
    marginBottom: SPACING.lg,
  },
  moodButtonsContainer: {
    paddingVertical: SPACING.sm,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  moodConfirmation: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  confirmationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  addNoteButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  addNoteText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
});