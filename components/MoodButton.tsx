import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface MoodButtonProps {
  rating: number;
  onPress: () => void;
}

export default function MoodButton({ rating, onPress }: MoodButtonProps) {
  const getMoodIcon = () => {
    switch(rating) {
      case 1: return 'sentiment-very-dissatisfied';
      case 2: return 'sentiment-dissatisfied';
      case 3: return 'sentiment-neutral';
      case 4: return 'sentiment-satisfied';
      case 5: return 'sentiment-very-satisfied';
      default: return 'sentiment-neutral';
    }
  };
  
  const getMoodColor = () => {
    return theme.colors.moodColors[rating as keyof typeof theme.colors.moodColors];
  };
  
  const getMoodText = () => {
    switch(rating) {
      case 1: return 'Very Bad';
      case 2: return 'Bad';
      case 3: return 'Okay';
      case 4: return 'Good';
      case 5: return 'Very Good';
      default: return 'Neutral';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getMoodColor() + '20' }]} // 20% opacity
      onPress={onPress}
    >
      <MaterialIcons 
        name={getMoodIcon()} 
        size={30} 
        color={getMoodColor()} 
      />
      <Text style={styles.text}>{getMoodText()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    width: 65,
    height: 80,
  },
  text: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});