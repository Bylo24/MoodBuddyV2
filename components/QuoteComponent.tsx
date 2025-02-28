import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface QuoteComponentProps {
  quote: string;
  author?: string;
}

export default function QuoteComponent({ quote, author }: QuoteComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"{quote}"</Text>
      {author && <Text style={styles.author}>— {author}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  quote: {
    fontSize: theme.typography.fontSizes.lg,
    fontStyle: 'italic',
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  author: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.subtext,
    textAlign: 'right',
  },
});