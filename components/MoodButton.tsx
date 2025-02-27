import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';

interface MoodButtonProps {
  rating: MoodRating;
  label: string;
  emoji: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function MoodButton({ 
  rating, 
  label, 
  emoji, 
  selected = false, 
  onPress 
}: MoodButtonProps) {
  return (
    <Pressable
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    width: 80,
    height: 100,
    margin: theme.spacing.xs,
    ...theme.shadows.small,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
    transform: [{ scale: 1.05 }],
  },
  emoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
});