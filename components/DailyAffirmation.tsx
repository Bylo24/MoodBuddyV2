import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { theme } from '../theme/theme';
import { fetchMentalHealthQuote } from '../utils/geminiApi';
import { Ionicons } from '@expo/vector-icons';

interface DailyAffirmationProps {
  initialQuote?: string;
  initialAuthor?: string;
}

export default function DailyAffirmation({ 
  initialQuote = "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
  initialAuthor = "Unknown"
}: DailyAffirmationProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [author, setAuthor] = useState(initialAuthor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quoteData = await fetchMentalHealthQuote();
      setQuote(quoteData.quote);
      setAuthor(quoteData.author);
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      setError('Could not load a new quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a quote when the component mounts
  useEffect(() => {
    fetchNewQuote();
  }, []);

  return (
    <Pressable 
      style={styles.container}
      onPress={loading ? undefined : fetchNewQuote}
      disabled={loading}
    >
      <Text style={styles.quoteIcon}>"</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding inspiration...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.quote}>{quote}</Text>
          {author && <Text style={styles.author}>— {author}</Text>}
        </>
      )}
      
      <Pressable 
        style={styles.refreshButton}
        onPress={loading ? undefined : fetchNewQuote}
        disabled={loading}
      >
        <Ionicons 
          name="refresh" 
          size={18} 
          color={theme.colors.primary} 
          style={[styles.refreshIcon, loading && styles.refreshIconSpinning]} 
        />
      </Pressable>
    </Pressable>
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
    position: 'relative',
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
  author: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: theme.colors.subtext,
    fontSize: 14,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
  },
  refreshButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    ...theme.shadows.small,
  },
  refreshIcon: {
    opacity: 0.8,
  },
  refreshIconSpinning: {
    opacity: 0.5,
  },
});