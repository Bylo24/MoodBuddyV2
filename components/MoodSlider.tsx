import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Alert, ToastAndroid, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { getTodayMoodEntry, saveTodayMood, isToday, canEditMood, formatDate } from '../services/moodService';
import { supabase } from '../utils/supabaseClient';

interface MoodSliderProps {
  value: MoodRating | null;
  onValueChange: (value: MoodRating | null) => void;
  onMoodSaved?: () => void; // Callback for when mood is saved
  disabled?: boolean;
  date?: string; // Optional date parameter, defaults to today
}

interface MoodOption {
  rating: MoodRating;
  label: string;
  emoji: string;
  color: string;
}

export default function MoodSlider({ 
  value, 
  onValueChange,
  onMoodSaved,
  disabled = false,
  date = formatDate(new Date()) // Default to today's date
}: MoodSliderProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [hasUserMoved, setHasUserMoved] = useState(false);
  const initialLoadRef = useRef(true);
  const moodFetchedRef = useRef(false);
  
  // Define mood options
  const moodOptions: MoodOption[] = [
    { rating: 1, label: "Terrible", emoji: "😢", color: theme.colors.mood1 },
    { rating: 2, label: "Not Good", emoji: "😕", color: theme.colors.mood2 },
    { rating: 3, label: "Okay", emoji: "😐", color: theme.colors.mood3 },
    { rating: 4, label: "Good", emoji: "🙂", color: theme.colors.mood4 },
    { rating: 5, label: "Great", emoji: "😄", color: theme.colors.mood5 },
  ];
  
  // Get current mood option based on value
  const currentMood = value ? moodOptions.find(option => option.rating === value) : null;
  
  // Show success message
  const showSuccessMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS, we could use a custom toast component or Alert
      console.log(message);
      Alert.alert('Success', message, [{ text: 'OK' }], { cancelable: true });
    }
  };
  
  // Animate emoji when mood changes
  useEffect(() => {
    if (value) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value]);
  
  // Load mood entry for the specified date when component mounts or date changes
  useEffect(() => {
    const loadMoodForDate = async () => {
      if (moodFetchedRef.current) return;
      
      try {
        console.log(`Loading mood entry for date: ${date}...`);
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }
        
        if (!session) {
          console.log('No active session found');
          return;
        }
        
        // Get mood entry for the specified date
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('date', date)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned - this is not an error for us
            console.log(`No mood entry found for date: ${date}`);
            onValueChange(null);
            setIsSaved(false);
          } else {
            console.error('Error fetching mood entry:', error);
          }
        } else if (data) {
          console.log(`Found mood entry for date ${date}:`, data);
          onValueChange(data.rating);
          setIsSaved(true);
          
          // Check if the entry is editable (today's entry)
          setIsEditable(isToday(date));
        }
        
        moodFetchedRef.current = true;
      } catch (error) {
        console.error(`Error loading mood for date ${date}:`, error);
      } finally {
        setIsLoading(false);
        initialLoadRef.current = false;
      }
    };
    
    // Reset the fetch flag when date changes
    moodFetchedRef.current = false;
    loadMoodForDate();
    
  }, [date, onValueChange]);
  
  // Handle slider value change (while sliding)
  const handleSliderChange = (sliderValue: number) => {
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    
    // Mark that user has moved the slider
    if (!hasUserMoved) {
      setHasUserMoved(true);
    }
    
    // Update parent component immediately for UI updates
    onValueChange(moodRating);
  };
  
  // Handle slider value change (when sliding completes)
  const handleSlidingComplete = async (sliderValue: number) => {
    // Only save if the user has actively moved the slider
    if (!hasUserMoved && !initialLoadRef.current) {
      console.log('Slider not moved by user, not saving');
      return;
    }
    
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    
    // Save to database
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error or no session:', sessionError);
        Alert.alert('Error', 'You must be logged in to save your mood.');
        return;
      }
      
      console.log(`Saving mood ${moodRating} for date ${date}`);
      
      // Check if an entry already exists for this date
      const { data: existingEntry, error: checkError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', date)
        .single();
      
      let savedEntry;
      
      if (checkError && checkError.code === 'PGRST116') {
        // No entry exists, create a new one
        console.log(`Creating new mood entry for date ${date}`);
        const { data, error } = await supabase
          .from('mood_entries')
          .insert([
            { user_id: session.user.id, date, rating: moodRating }
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating mood entry:', error);
          Alert.alert('Error', 'Failed to save your mood. Please try again.');
          return;
        }
        
        savedEntry = data;
      } else if (existingEntry) {
        // Entry exists, update it
        console.log(`Updating existing mood entry for date ${date}:`, existingEntry);
        const { data, error } = await supabase
          .from('mood_entries')
          .update({ rating: moodRating })
          .eq('id', existingEntry.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating mood entry:', error);
          Alert.alert('Error', 'Failed to update your mood. Please try again.');
          return;
        }
        
        savedEntry = data;
      }
      
      if (savedEntry) {
        setIsSaved(true);
        console.log('Mood saved successfully:', savedEntry);
        
        // Show success message
        showSuccessMessage(`Mood saved for ${isToday(date) ? 'today' : date}!`);
        
        // Call the onMoodSaved callback to refresh parent component data
        if (onMoodSaved) {
          onMoodSaved();
        }
      } else {
        console.error('Failed to save mood: No entry returned');
        Alert.alert('Error', 'Failed to save your mood. Please try again.');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset hasUserMoved after saving
      setHasUserMoved(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {value === null ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            {isToday(date) ? 'How are you feeling today?' : `How did you feel on ${date}?`}
          </Text>
          <Text style={styles.emptyStateSubText}>Move the slider to select your mood</Text>
        </View>
      ) : null}
      
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value || 3} // Default to middle position visually, but don't save it
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={currentMood?.color || theme.colors.border}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood?.color || theme.colors.primary}
        disabled={disabled || !isEditable || isLoading}
      />
      
      <View style={styles.labelContainer}>
        {moodOptions.map((option) => (
          <View key={option.rating} style={styles.labelItem}>
            <Text style={styles.labelEmoji}>{option.emoji}</Text>
            <Text 
              style={[
                styles.sliderLabel,
                value === option.rating && { color: option.color, fontWeight: theme.fontWeights.bold }
              ]}
            >
              {option.rating}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.moodDisplay}>
        {value ? (
          <>
            <Animated.Text 
              style={[
                styles.emoji,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              {currentMood?.emoji}
            </Animated.Text>
            <Text style={[styles.moodLabel, { color: currentMood?.color }]}>
              {currentMood?.label}
            </Text>
          </>
        ) : (
          <Text style={styles.noMoodText}>No mood selected</Text>
        )}
        
        {isLoading ? (
          <Text style={styles.savingText}>Saving your mood...</Text>
        ) : isSaved && value ? (
          <Text style={styles.savedText}>
            {isEditable 
              ? `Mood saved for ${isToday(date) ? 'today' : date}` 
              : `This mood is locked and can't be changed`}
          </Text>
        ) : null}
        
        {!isEditable && (
          <Text style={styles.lockedText}>
            Past entries cannot be modified
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.small,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  labelItem: {
    alignItems: 'center',
  },
  labelEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontWeight: theme.fontWeights.medium,
  },
  moodDisplay: {
    alignItems: 'center',
    marginTop: 8,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
  },
  savedText: {
    fontSize: 12,
    color: theme.colors.subtext,
    marginTop: 8,
    fontStyle: 'italic',
  },
  savingText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  lockedText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontStyle: 'italic',
    marginTop: 4,
  },
  noMoodText: {
    fontSize: 18,
    color: theme.colors.subtext,
    fontStyle: 'italic',
  },
});