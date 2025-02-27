import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { MoodRating } from '../types';

interface MoodButtonProps {
  rating: MoodRating;
  selected: boolean;
  onSelect: (rating: MoodRating) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const getMoodEmoji = (rating: MoodRating): string => {
  switch (rating) {
    case 1: return '😢';
    case 2: return '😕';
    case 3: return '😐';
    case 4: return '🙂';
    case 5: return '😄';
    default: return '😐';
  }
};

const getMoodColor = (rating: MoodRating): string => {
  switch (rating) {
    case 1: return COLORS.verySad;
    case 2: return COLORS.sad;
    case 3: return COLORS.neutral;
    case 4: return COLORS.happy;
    case 5: return COLORS.veryHappy;
    default: return COLORS.neutral;
  }
};

const MoodButton: React.FC<MoodButtonProps> = ({ rating, selected, onSelect }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(selected ? 1 : 0.7);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: selected ? withTiming(getMoodColor(rating), { duration: 300 }) : withTiming('white', { duration: 300 }),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.1);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    opacity.value = withTiming(1, { duration: 300 });
    onSelect(rating);
  };

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle, SHADOWS.small]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Text style={styles.emoji}>{getMoodEmoji(rating)}</Text>
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {rating === 1 ? 'Very Sad' : 
         rating === 2 ? 'Sad' : 
         rating === 3 ? 'Neutral' : 
         rating === 4 ? 'Happy' : 'Very Happy'}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
  },
  selectedLabel: {
    color: COLORS.white,
  },
});

export default MoodButton;