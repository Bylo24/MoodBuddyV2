import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MoodEntry } from '../types';
import { theme } from '../theme/theme';

interface MoodTrendGraphProps {
  moodEntries: MoodEntry[];
  days?: number;
}

export default function MoodTrendGraph({ 
  moodEntries, 
  days = 5 
}: MoodTrendGraphProps) {
  // Take only the most recent entries up to the specified number of days
  const recentEntries = moodEntries.slice(0, days).reverse();
  
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

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        {recentEntries.map((entry, index) => (
          <View key={entry.id} style={styles.dayColumn}>
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
      </View>
      
      {isImproving && (
        <Text style={styles.motivationalText}>
          You're improving! Keep going! 🎉
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingVertical: theme.spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    width: 20,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: theme.borderRadius.md,
  },
  dayLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.subtext,
  },
  motivationalText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.success,
    textAlign: 'center',
  },
});