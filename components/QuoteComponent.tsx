import React, { useState, useEffect, useRef } from 'react';
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
  },
  {
    quote: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  },
  {
    quote: "It's okay to not be okay – it means that your mind is trying to heal itself.",
    author: "Jasmine Warga"
  },
  {
    quote: "You are not alone in this. You are seen, you are loved, and you matter.",
    author: "Sophie Turner"
  },
  {
    quote: "The strongest people are those who win battles we know nothing about.",
    author: "Unknown"
  },
  {
    quote: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  }
];

export default function QuoteComponent() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0].quote);
  const [author, setAuthor] = useState(FALLBACK_QUOTES[0].author);
  const [loading, setLoading] = useState(false);
  
  // Keep track of recently used quotes to avoid repetition
  const recentQuotesRef = useRef<Set<string>>(new Set());
  const apiFailCountRef = useRef(0);
  
  const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  const getRandomFallbackQuote = () => {
    // Filter out recently used quotes
    const availableQuotes = FALLBACK_QUOTES.filter(q => !recentQuotesRef.current.has(q.quote));
    
    // If all quotes have been used recently, reset the tracking
    if (availableQuotes.length === 0) {
      recentQuotesRef.current.clear();
      return getRandomQuote(FALLBACK_QUOTES);
    }
    
    return getRandomQuote(availableQuotes);
  };
  
  const getRandomQuote = (quotes: typeof FALLBACK_QUOTES) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    
    // Add to recently used set
    recentQuotesRef.current.add(selectedQuote.quote);
    
    // Keep the set size manageable
    if (recentQuotesRef.current.size > FALLBACK_QUOTES.length / 2) {
      const iterator = recentQuotesRef.current.values();
      recentQuotesRef.current.delete(iterator.next().value);
    }
    
    return selectedQuote;
  };
  
  const fetchQuote = async () => {
    setLoading(true);
    
    try {
      // If we've had too many API failures in a row, use fallback quotes for a while
      if (apiFailCountRef.current > 3) {
        console.log('Too many API failures, using fallback quote');
        const fallback = getRandomFallbackQuote();
        setQuote(fallback.quote);
        setAuthor(fallback.author);
        
        // Reset the failure counter after some successful fallbacks
        apiFailCountRef.current--;
        setLoading(false);
        return;
      }
      
      console.log('Fetching quote from Gemini API...');
      
      // Use a more varied prompt to get different quotes
      const prompts = [
        "give me a quote about mental health within 2 sentences with the author aswell. put the quote in normal text and the author in bold. I dont want you to say anything expect the quote, and make sure its a real quote e.g Your mental health is a priority. Your happiness is essential. Your self-care is a necessity Unknown",
        "provide a short inspirational quote about mental wellness with the author name. Format it as the quote followed by the author's name in bold. Make sure it's a real quote from a known person.",
        "share a meaningful quote about emotional wellbeing or mental health. Include the author's name in bold after the quote. Keep it concise and authentic.",
        "give me a powerful quote about self-care or mental health awareness. Format it as the quote text followed by the author name in bold. Ensure it's a genuine quote.",
        "provide an uplifting quote about psychological wellness or emotional health. Include the author in bold after the quote. Make sure it's a real quote from someone notable."
      ];
      
      // Select a random prompt
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
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
                  text: randomPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.9,  // Increase temperature for more variety
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          }
        },
        timeout: 10000  // 10 second timeout
      });
      
      console.log('API response received');
      
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = response.data.candidates[0].content.parts[0].text;
        console.log('Raw response text:', responseText);
        
        const { quote: extractedQuote, author: extractedAuthor } = extractQuoteAndAuthor(responseText);
        
        if (extractedQuote && extractedAuthor && 
            extractedQuote !== quote && // Ensure it's different from current quote
            !recentQuotesRef.current.has(extractedQuote)) { // Ensure it hasn't been used recently
          
          setQuote(extractedQuote);
          setAuthor(extractedAuthor);
          recentQuotesRef.current.add(extractedQuote);
          console.log('Quote updated successfully');
          
          // Reset API failure counter on success
          apiFailCountRef.current = 0;
        } else {
          console.log('Extracted quote was duplicate or invalid, trying fallback');
          throw new Error('Duplicate or invalid quote');
        }
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      
      // Increment API failure counter
      apiFailCountRef.current++;
      
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