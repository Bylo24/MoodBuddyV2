import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { getTodayMoodEntry, saveTodayMood, canUpdateTodayMood } from '../services/moodService';

interface MoodSliderProps {
  initialValue?: MoodRating;
  onValueChange?: (value: MoodRating) => void;
  onSaveComplete?: () => void;
}

export default function MoodSlider({ 
  initialValue = 3, 
  onValueChange,
  onSaveComplete
}: MoodSliderProps) {
  const [value, setValue] = useState<MoodRating>(initialValue);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));
  
  // Define mood options
  const moodOptions = [
    { rating: 1, label: "Terrible", emoji: "😢", color: theme.colors.mood1 },
    { rating: 2, label: "Not Good", emoji: "😕", color: theme.colors.mood2 },
    { rating: 3, label: "Okay", emoji: "😐", color: theme.colors.mood3 },
    { rating: 4, label: "Good", emoji: "🙂", color: theme.colors.mood4 },
    { rating: 5, label: "Great", emoji: "😄", color: theme.colors.mood5 },
  ];
  
  // Get current mood option based on value
  const currentMood = moodOptions.find(option => option.rating === value) || moodOptions[2];
  
  // Load today's mood data
  useEffect(() => {
    const loadTodayMood = async () => {
      try {
        setIsLoading(true);
        
        // Check if user can update today's mood
        const canUpdate = await canUpdateTodayMood();
        setIsLocked(!canUpdate);
        
        // Get today's mood entry
        const todayEntry = await getTodayMoodEntry();
        
        if (todayEntry) {
          setValue(todayEntry.rating);
          if (onValueChange) {
            onValueChange(todayEntry.rating);
          }
        }
      } catch (error) {
        console.error('Error loading today\'s mood:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTodayMood();
  }, []);
  
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
  
  // Handle slider value change
  const handleValueChange = async (sliderValue: number) => {
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    
    if (isLocked) {
      Alert.alert(
        "Mood Locked",
        "Today's mood entry is locked and cannot be changed.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setValue(moodRating);
    
    if (onValueChange) {
      onValueChange(moodRating);
    }
    
    try {
      // Save to database
      await saveTodayMood(moodRating);
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert(
        "Error",
        "Failed to save your mood. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  return (
    <View style={[
      styles.container,
      isLocked && styles.lockedContainer
    ]}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={(val) => setValue(Math.round(val) as MoodRating)}
        onSlidingComplete={handleValueChange}
        minimumTrackTintColor={currentMood.color}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood.color}
        disabled={isLocked || isLoading}
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
        
        {isLocked && (
          <Text style={styles.lockedText}>
            Today's mood is locked
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
  lockedContainer: {
    opacity: 0.8,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  lockedText: {
    fontSize: 12,
    color: theme.colors.subtext,
    marginTop: 8,
    fontStyle: 'italic',
  },
});