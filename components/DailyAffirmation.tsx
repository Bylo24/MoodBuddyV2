import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

interface DailyAffirmationProps {
  quote: string;
  author?: string;
}

export default function DailyAffirmation({ quote, author }: DailyAffirmationProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.quoteIcon}>"</Text>
      <Text style={styles.quote}>{quote}</Text>
      {author && <Text style={styles.author}>— {author}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary + '15', // 15% opacity
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  quoteIcon: {
    fontSize: 40,
    color: theme.colors.primary,
    position: 'absolute',
    top: 0,
    left: 10,
    opacity: 0.2,
  },
  quote: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: theme.lineHeights.relaxed * theme.fontSizes.md,
  },
  author: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
    marginTop: theme.spacing.sm,
    textAlign: 'right',
  },
});