import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { MoodRating } from '../types';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../theme/theme';

interface MoodButtonProps {
  rating: MoodRating;
  selected?: boolean;
  onPress: (rating: MoodRating) => void;
}

export default function MoodButton({ rating, selected = false, onPress }: MoodButtonProps) {
  // Map ratings to emojis and colors
  const moodEmojis = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😄',
  };

  const moodLabels = {
    1: 'Very Bad',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Great',
  };

  const moodColors = {
    1: COLORS.mood1,
    2: COLORS.mood2,
    3: COLORS.mood3,
    4: COLORS.mood4,
    5: COLORS.mood5,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: moodColors[rating] },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(rating)}
    >
      <Text style={styles.emoji}>{moodEmojis[rating]}</Text>
      <Text style={styles.label}>{moodLabels[rating]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    width: 80,
    height: 80,
    ...SHADOWS.small,
  },
  selected: {
    borderWidth: 3,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  emoji: {
    fontSize: FONT_SIZES.xxl,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
});