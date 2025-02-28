import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function DailyAffirmation() {
  // In a real app, this would come from an API or local storage
  const affirmation = "You are capable of amazing things. Today is full of possibilities.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Affirmation</Text>
      <Text style={styles.affirmation}>"{affirmation}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold as any,
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  affirmation: {
    fontSize: theme.typography.fontSizes.lg,
    fontStyle: 'italic',
    color: theme.colors.text,
    lineHeight: 24,
  },
});