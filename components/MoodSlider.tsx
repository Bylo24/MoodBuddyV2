import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';

interface MoodSliderProps {
  value: MoodRating;
  onValueChange: (value: MoodRating) => void;
}

interface MoodOption {
  rating: MoodRating;
  label: string;
  emoji: string;
  color: string;
}

export default function MoodSlider({ value, onValueChange }: MoodSliderProps) {
  // Animation value for emoji scaling
  const [scaleAnim] = useState(new Animated.Value(1));
  
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
  
  // Handle slider value change
  const handleValueChange = (sliderValue: number) => {
    // Convert to integer between 1-5
    const moodRating = Math.round(sliderValue) as MoodRating;
    onValueChange(moodRating);
  };
  
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor={currentMood.color}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood.color}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  sliderLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
  },
  moodDisplay: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.sm,
  },
  moodLabel: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
  },
});