import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import axios from 'axios';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { extractQuoteAndAuthor } from '../utils/quoteExtractor';

// Fallback quotes in case the API fails
const FALLBACK_QUOTES = [
  {
    quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    quote: "Mental health problems don't define who you are. They are something you experience.",
    author: "Roy Chisholm"
  },
  {
    quote: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
    author: "Lori Deschene"
  },
  {
    quote: "There is hope, even when your brain tells you there isn't.",
    author: "John Green"
  },
  {
    quote: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde"
  }
];

export default function QuoteComponent() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0].quote);
  const [author, setAuthor] = useState(FALLBACK_QUOTES[0].author);
  const [loading, setLoading] = useState(false);
  
  const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  const getRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  };
  
  const fetchQuote = async () => {
    setLoading(true);
    
    try {
      console.log('Fetching quote from Gemini API...');
      
      const prompt = "give me a quote about mental health within 2 sentences with the author aswell. put the quote in normal text and the author in bold. I dont want you to say anything expect the quote, and make sure its a real quote e.g Your mental health is a priority. Your happiness is essential. Your self-care is a necessity Unknown";
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}?key=${API_KEY}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }
      });
      
      console.log('API response received');
      
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = response.data.candidates[0].content.parts[0].text;
        console.log('Raw response text:', responseText);
        
        const { quote: extractedQuote, author: extractedAuthor } = extractQuoteAndAuthor(responseText);
        
        if (extractedQuote && extractedAuthor) {
          setQuote(extractedQuote);
          setAuthor(extractedAuthor);
          console.log('Quote updated successfully');
        } else {
          throw new Error('Failed to extract quote and author');
        }
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      
      // Use a fallback quote
      const fallback = getRandomFallbackQuote();
      setQuote(fallback.quote);
      setAuthor(fallback.author);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a quote when the component mounts
  useEffect(() => {
    fetchQuote();
  }, []);
  
  return (
    <Pressable 
      style={styles.container}
      onPress={loading ? undefined : fetchQuote}
      disabled={loading}
    >
      <Text style={styles.quoteIcon}>"</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding inspiration...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.quote}>{quote}</Text>
          <Text style={styles.author}>— {author}</Text>
        </>
      )}
      
      <Pressable 
        style={styles.refreshButton}
        onPress={loading ? undefined : fetchQuote}
        disabled={loading}
      >
        <Ionicons 
          name="refresh" 
          size={18} 
          color={theme.colors.primary} 
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
    minHeight: 120,
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
    minHeight: 80,
  },
  loadingText: {
    marginTop: 8,
    color: theme.colors.subtext,
    fontSize: 14,
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
});