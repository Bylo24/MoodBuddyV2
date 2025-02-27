import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { getTodayMoodEntry, saveTodayMood, isToday, canEditMood } from '../services/moodService';

interface MoodSliderProps {
  value: MoodRating;
  onValueChange: (value: MoodRating) => void;
  onMoodSaved?: () => void; // New callback for when mood is saved
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
  
  // Define mood options
  const moodOptions: MoodOption[] = [
    { rating: 1, label: "Terrible", emoji: "😢", color: theme.colors.mood1 },
    { rating: 2, label: "Not Good", emoji: "😕", color: theme.colors.mood2 },
    { rating: 3, label: "Okay", emoji: "😐", color: theme.colors.mood3 },
    { rating: 4, label: "Good", emoji: "🙂", color: theme.colors.mood4 },
    { rating: 5, label: "Great", emoji: "😄", color: theme.colors.mood5 },
  ];
  
  // Get current mood option based on value
  const currentMood = moodOptions.find(option => option.rating === value) || moodOptions[2];
  
  // Animate emoji when mood changes
  useEffect(() => {
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
  }, [value]);
  
  // Load today's mood entry when component mounts
  useEffect(() => {
    const loadTodayMood = async () => {
      try {
        const entry = await getTodayMoodEntry();
        if (entry) {
          onValueChange(entry.rating);
          setIsSaved(true);
          
          // Check if the entry is editable (today's entry)
          setIsEditable(canEditMood(entry.date));
        }
      } catch (error) {
        console.error('Error loading today\'s mood:', error);
      }
    };
    
    loadTodayMood();
  }, []);
  
  // Handle slider value change (while sliding)
  const handleSliderChange = (sliderValue: number) => {
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    
    // Update local state and parent component
    onValueChange(moodRating);
  };
  
  // Handle slider value change (when sliding completes)
  const handleSlidingComplete = async (sliderValue: number) => {
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    
    // Save to database
    try {
      setIsLoading(true);
      await saveTodayMood(moodRating);
      setIsSaved(true);
      
      // Call the onMoodSaved callback to refresh parent component data
      if (onMoodSaved) {
        onMoodSaved();
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={currentMood.color}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood.color}
        disabled={disabled || !isEditable}
      />
      
      <View style={styles.labelContainer}>
        {moodOptions.map((option) => (
          <Text 
            key={option.rating} 
            style={[
              styles.sliderLabel,
              value === option.rating && { color: option.color, fontWeight: theme.fontWeights.bold }
            ]}
          >
            {option.rating}
          </Text>
        ))}
      </View>
      
      <View style={styles.moodDisplay}>
        <Animated.Text 
          style={[
            styles.emoji,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {currentMood.emoji}
        </Animated.Text>
        <Text style={[styles.moodLabel, { color: currentMood.color }]}>
          {currentMood.label}
        </Text>
        
        {isSaved && (
          <Text style={styles.savedText}>
            {isEditable 
              ? "Today's mood is saved" 
              : "This mood is locked and can't be changed"}
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
});