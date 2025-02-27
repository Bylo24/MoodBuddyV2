import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { theme } from '../theme/theme';

// Fallback quotes in case the API fails
const FALLBACK_QUOTES = [
  "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
  "Mental health problems don't define who you are. They are something you experience.",
  "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
  "There is hope, even when your brain tells you there isn't.",
  "Self-care is not self-indulgence, it is self-preservation.",
  "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
  "It's okay to not be okay – it means that your mind is trying to heal itself.",
  "You are not alone in this. You are seen, you are loved, and you matter.",
  "The strongest people are those who win battles we know nothing about.",
  "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
];

export default function QuoteComponent() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Keep track of recently used quotes to avoid repetition
  const recentQuotesRef = useRef<Set<string>>(new Set());
  
  const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  const getRandomFallbackQuote = () => {
    // Filter out recently used quotes
    const availableQuotes = FALLBACK_QUOTES.filter(q => !recentQuotesRef.current.has(q));
    
    // If all quotes have been used recently, reset the tracking
    if (availableQuotes.length === 0) {
      recentQuotesRef.current.clear();
      return getRandomQuote(FALLBACK_QUOTES);
    }
    
    return getRandomQuote(availableQuotes);
  };
  
  const getRandomQuote = (quotes: string[]) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    
    // Add to recently used set
    recentQuotesRef.current.add(selectedQuote);
    
    // Keep the set size manageable
    if (recentQuotesRef.current.size > FALLBACK_QUOTES.length / 2) {
      const iterator = recentQuotesRef.current.values();
      recentQuotesRef.current.delete(iterator.next().value);
    }
    
    return selectedQuote;
  };
  
  const extractQuote = (text: string): string => {
    // Clean up the text
    const cleanText = text
      .replace(/^["']|["']$/g, '') // Remove quotes at beginning/end
      .replace(/\n+/g, ' ') // Replace multiple newlines with space
      .trim();
    
    // Try to extract just the quote part (without author)
    const patterns = [
      // Bold markdown: Quote **Author**
      /^(.*?)\s*\*\*.*?\*\*\s*$/,
      // Quote - Author
      /^(.*?)\s*[-–—].*?$/,
      // "Quote" - Author
      /^["'](.+?)["']\s*[-–—].*?$/,
      // Quote by Author
      /^(.*?)\s+by\s+.*?$/i,
      // Quote from Author
      /^(.*?)\s+from\s+.*?$/i,
    ];
    
    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
    
    // If no pattern matches, check if there's a dash anywhere
    const dashIndex = cleanText.lastIndexOf('-');
    if (dashIndex > 0) {
      return cleanText.substring(0, dashIndex).trim();
    }
    
    // Return the whole text if we can't extract just the quote
    return cleanText;
  };
  
  const fetchQuote = async () => {
    setLoading(true);
    
    try {
      const prompt = "give me a short inspirational quote about mental health or wellness. Just provide the quote itself without attribution or explanation. Keep it under 2 sentences.";
      
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
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          }
        },
        timeout: 5000  // 5 second timeout
      });
      
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = response.data.candidates[0].content.parts[0].text;
        const extractedQuote = extractQuote(responseText);
        
        if (extractedQuote && !recentQuotesRef.current.has(extractedQuote)) {
          setQuote(extractedQuote);
          recentQuotesRef.current.add(extractedQuote);
        } else {
          // Use fallback if duplicate or extraction failed
          setQuote(getRandomFallbackQuote());
        }
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      // Use a fallback quote
      setQuote(getRandomFallbackQuote());
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a quote when the component mounts
  useEffect(() => {
    fetchQuote();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.quoteIcon}>"</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        <Text style={styles.quote}>{quote}</Text>
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
    position: 'relative',
    minHeight: 80,
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
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 40,
  },
});