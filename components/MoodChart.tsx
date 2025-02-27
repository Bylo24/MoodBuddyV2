import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { MoodEntry } from '../types';

interface MoodChartProps {
  entries: MoodEntry[];
  days?: number;
}

const MoodChart: React.FC<MoodChartProps> = ({ entries, days = 7 }) => {
  // Filter entries to only include the last 'days' days
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);
  
  // Create an array of the last 'days' days
  const dateLabels = Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1) + i);
    return date;
  });
  
  // Map entries to the corresponding days
  const moodData = dateLabels.map(date => {
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
    
    // If there are multiple entries for a day, use the average
    if (dayEntries.length > 0) {
      const sum = dayEntries.reduce((acc, entry) => acc + entry.rating, 0);
      return sum / dayEntries.length;
    }
    
    // If no entries for this day, return null
    return null;
  });
  
  // Format date labels
  const formattedLabels = dateLabels.map(date => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
  });
  
  // Calculate bar heights (max height is 100)
  const maxBarHeight = 100;
  const barHeights = moodData.map(rating => 
    rating ? (rating / 5) * maxBarHeight : 0
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Mood Trend</Text>
      <View style={styles.chartContainer}>
        {barHeights.map((height, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: height || 0,
                    backgroundColor: height ? getMoodColor(moodData[index] || 3) : COLORS.textMuted,
                    opacity: height ? 1 : 0.3
                  }
                ]} 
              />
            </View>
            <Text style={styles.label}>{formattedLabels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const getMoodColor = (rating: number): string => {
  if (rating <= 1.5) return COLORS.verySad;
  if (rating <= 2.5) return COLORS.sad;
  if (rating <= 3.5) return COLORS.neutral;
  if (rating <= 4.5) return COLORS.happy;
  return COLORS.veryHappy;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    borderRadius: 8,
  },
  label: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});

export default MoodChart;