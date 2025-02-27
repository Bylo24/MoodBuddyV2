import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { MoodEntry } from '../types';
import { theme } from '../theme/theme';

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
  const sortedEntries = [...moodEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days)
    .reverse();
  
  // Fill in missing days with empty entries
  const filledEntries: (MoodEntry | null)[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const entry = sortedEntries.find(e => e.date === dateString);
    filledEntries.push(entry || null);
  }
  
  // Calculate if mood is improving
  const validEntries = filledEntries.filter(e => e !== null) as MoodEntry[];
  const isImproving = validEntries.length >= 2 && 
    validEntries[validEntries.length - 1].rating > validEntries[0].rating;
  
  // Get color for a specific mood rating
  const getMoodColor = (rating: number) => {
    switch(rating) {
      case 1: return theme.colors.mood1;
      case 2: return theme.colors.mood2;
      case 3: return theme.colors.mood3;
      case 4: return theme.colors.mood4;
      case 5: return theme.colors.mood5;
      default: return theme.colors.border;
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
        {filledEntries.map((entry, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - index));
          const dateString = date.toISOString().split('T')[0];
          
          return (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.barContainer}>
                {entry ? (
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${entry.rating * 20}%`,
                        backgroundColor: getMoodColor(entry.rating)
                      }
                    ]} 
                  />
                ) : (
                  <View style={styles.emptyBar} />
                )}
              </View>
              <Text style={styles.dayLabel}>{getDayAbbreviation(dateString)}</Text>
            </View>
          );
        })}
      </View>
      
      {isImproving && validEntries.length >= 2 && (
        <Text style={styles.motivationalText}>
          You're improving! Keep going! 🎉
        </Text>
      )}
      
      {validEntries.length === 0 && (
        <Text style={styles.emptyText}>
          No mood data yet. Start tracking today!
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
  emptyBar: {
    width: '100%',
    height: '0%',
    borderRadius: 8,
    backgroundColor: theme.colors.border,
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
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.subtext,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});