import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Activity } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme/theme';

interface ActivityCardProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  // Map categories to emoji icons
  const categoryIcons = {
    mindfulness: '🧘‍♀️',
    exercise: '🏃‍♂️',
    social: '👥',
    creative: '🎨',
    relaxation: '🛀',
  };

  // Map mood impact to visual indicator
  const impactIndicator = {
    low: '•',
    medium: '••',
    high: '•••',
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(activity)}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{categoryIcons[activity.category]}</Text>
        <Text style={styles.impact}>{impactIndicator[activity.moodImpact]}</Text>
      </View>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.description}>{activity.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.duration}>{activity.duration} min</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
  },
  impact: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  duration: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
});