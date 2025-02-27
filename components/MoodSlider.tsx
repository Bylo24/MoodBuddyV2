import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Alert, ToastAndroid, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { getTodayMoodEntry, saveTodayMood, isToday, canEditMood } from '../services/moodService';

interface MoodSliderProps {
  value: MoodRating | null;
  onValueChange: (value: MoodRating | null) => void;
  onMoodSaved?: () => void; // Callback for when mood is saved
  disabled?: boolean;
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
  disabled = false
}: MoodSliderProps) {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [hasUserMoved, setHasUserMoved] = useState(false);
  const initialLoadRef = useRef(true);
  
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
  
  // Load today's mood entry when component mounts
  useEffect(() => {
    const loadTodayMood = async () => {
      try {
        console.log('Loading today\'s mood entry...');
        const entry = await getTodayMoodEntry();
        
        if (entry) {
          console.log('Found mood entry for today:', entry);
          onValueChange(entry.rating);
          setIsSaved(true);
          
          // Check if the entry is editable (today's entry)
          setIsEditable(canEditMood(entry.date));
        } else {
          console.log('No mood entry for today, setting to null');
          // No mood entry for today, set to null
          onValueChange(null);
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error loading today\'s mood:', error);
      } finally {
        initialLoadRef.current = false;
      }
    };
    
    loadTodayMood();
  }, []);
  
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
      
      // Check if a mood entry exists for today
      const existingEntry = await getTodayMoodEntry();
      const isUpdate = !!existingEntry;
      
      // Save the mood
      const savedEntry = await saveTodayMood(moodRating);
      
      if (savedEntry) {
        setIsSaved(true);
        console.log('Mood saved successfully:', savedEntry);
        
        // Show success message
        showSuccessMessage("Mood saved for today!");
        
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
          <Text style={styles.emptyStateText}>How are you feeling today?</Text>
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
              ? "Today's mood is saved" 
              : "This mood is locked and can't be changed"}
          </Text>
        ) : null}
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