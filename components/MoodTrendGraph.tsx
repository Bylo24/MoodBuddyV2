import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function MoodTrendGraph() {
  // Mock data - in a real app, this would come from a database or local storage
  const mockData = [
    { day: 'Mon', value: 3 },
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 2 },
    { day: 'Thu', value: 5 },
    { day: 'Fri', value: 3 },
    { day: 'Sat', value: 4 },
    { day: 'Sun', value: 4 },
  ];

  const maxValue = 5; // Maximum mood rating

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        {mockData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: getMoodColor(item.value)
                  }
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const getMoodColor = (value: number) => {
  switch(value) {
    case 1: return theme.colors.moodColors[1];
    case 2: return theme.colors.moodColors[2];
    case 3: return theme.colors.moodColors[3];
    case 4: return theme.colors.moodColors[4];
    case 5: return theme.colors.moodColors[5];
    default: return theme.colors.moodColors[3];
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    width: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.subtext,
  },
});