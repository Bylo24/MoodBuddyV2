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
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  quoteIcon: {
    fontSize: 32,
    color: theme.colors.primary,
    position: 'absolute',
    top: 4,
    left: 10,
    opacity: 0.2,
  },
  quote: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 8,
    textAlign: 'right',
  },
});