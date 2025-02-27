import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { theme } from '../theme/theme';
import { MoodEntry } from '../services/moodService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface MoodTrendGraphProps {
  moodEntries: MoodEntry[];
  days?: number;
}

export default function MoodTrendGraph({ 
  moodEntries, 
  days = 5 
}: MoodTrendGraphProps) {
  // Take only the most recent entries up to the specified number of days
  const recentEntries = [...moodEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days)
    .reverse();
  
  // Calculate if mood is improving
  const isImproving = recentEntries.length >= 2 && 
    recentEntries[recentEntries.length - 1].rating > recentEntries[0].rating;
  
  // Get color for a specific mood rating
  const getMoodColor = (rating: number) => {
    switch(rating) {
      case 1: return theme.colors.mood1;
      case 2: return theme.colors.mood2;
      case 3: return theme.colors.mood3;
      case 4: return theme.colors.mood4;
      case 5: return theme.colors.mood5;
      default: return theme.colors.primary;
    }
  };
  
  // Get day abbreviation
  const getDayAbbreviation = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
  };

  // If no entries, show empty state
  if (recentEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No mood data yet</Text>
        <Text style={styles.emptySubtext}>Your mood trend will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        {recentEntries.map((entry, index) => (
          <View key={entry.id || index} style={styles.dayColumn}>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: `${entry.rating * 20}%`,
                    backgroundColor: getMoodColor(entry.rating)
                  }
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{getDayAbbreviation(entry.date)}</Text>
          </View>
        ))}
        
        {/* Fill in empty slots if we have fewer than 'days' entries */}
        {Array.from({ length: Math.max(0, days - recentEntries.length) }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayColumn}>
            <View style={styles.barContainer} />
            <Text style={styles.dayLabel}>-</Text>
          </View>
        ))}
      </View>
      
      {isImproving && recentEntries.length >= 2 && (
        <Text style={styles.motivationalText}>
          You're improving! Keep going! 🎉
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingVertical: 8,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 60,
    width: 16,
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  dayLabel: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.subtext,
  },
  motivationalText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.success,
    textAlign: 'center',
  },
  emptyContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
  },
  emptySubtext: {
    fontSize: 12,
    color: theme.colors.subtext,
    opacity: 0.7,
  },
});