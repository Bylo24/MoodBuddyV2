import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { MoodRating } from '../types';
import { theme } from '../theme/theme';
import { saveMoodEntry } from '../services/moodService';
import { getCurrentUser } from '../services/authService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface MoodSliderProps {
  value: MoodRating;
  onValueChange: (value: MoodRating) => void;
  initialValue?: MoodRating;
  isEditable?: boolean;
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
  initialValue = 3,
  isEditable = true
}: MoodSliderProps) {
  // Animation value for emoji scaling
  const [scaleAnim] = useState(new Animated.Value(1));
  const [saving, setSaving] = useState(false);
  const [savedValue, setSavedValue] = useState<MoodRating | null>(null);
  
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
  
  // Save the current mood to the database
  const saveMood = async () => {
    try {
      setSaving(true);
      const user = await getCurrentUser();
      
      if (!user) {
        console.error('No user logged in');
        return;
      }
      
      const result = await saveMoodEntry(user.id, value);
      
      if (result) {
        setSavedValue(value);
        console.log('Mood saved successfully');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setSaving(false);
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
        onValueChange={handleValueChange}
        minimumTrackTintColor={currentMood.color}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={currentMood.color}
        disabled={!isEditable}
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
      
      {isEditable && (
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            saving && styles.savingButton,
            savedValue === value && styles.savedButton
          ]} 
          onPress={saveMood}
          disabled={saving || savedValue === value}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : savedValue === value ? 'Saved' : 'Save Mood'}
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  savingButton: {
    backgroundColor: theme.colors.primary + '80', // 50% opacity
  },
  savedButton: {
    backgroundColor: theme.colors.success,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: theme.fontWeights.semibold,
    fontSize: 16,
  },
});