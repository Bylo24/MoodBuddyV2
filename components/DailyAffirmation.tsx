import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';

interface DailyAffirmationProps {
  quote: string;
  author?: string;
  isLoading?: boolean;
  hasError?: boolean;
}

export default function DailyAffirmation({ 
  quote, 
  author, 
  isLoading = false,
  hasError = false
}: DailyAffirmationProps) {
  return (
    <View style={[styles.container, hasError && styles.errorContainer]}>
      <Text style={styles.quoteIcon}>"</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Text style={styles.loadingText}>Finding inspiration...</Text>
        </View>
      ) : (
        <>
          <Text style={[styles.quote, hasError && styles.errorText]}>{quote}</Text>
          {author && <Text style={styles.author}>— {author}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary + '22', // 13% opacity
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    minHeight: 100, // Ensure consistent height during loading
  },
  errorContainer: {
    borderLeftColor: theme.colors.error,
    backgroundColor: theme.colors.error + '22',
  },
  quoteIcon: {
    fontSize: 32,
    color: theme.colors.primary,
    position: 'absolute',
    top: 4,
    left: 10,
    opacity: 0.3,
  },
  quote: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  errorText: {
    color: theme.colors.error,
    fontStyle: 'normal',
  },
  author: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: theme.colors.subtext,
    fontSize: 14,
    fontStyle: 'italic',
  },
});