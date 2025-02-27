import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'mindfulness': return 'leaf-outline';
    case 'journaling': return 'book-outline';
    case 'music': return 'musical-notes-outline';
    case 'physical': return 'fitness-outline';
    case 'social': return 'people-outline';
    case 'creative': return 'color-palette-outline';
    default: return 'star-outline';
  }
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card, 
        SHADOWS.small,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getCategoryIcon(activity.category)} 
            size={24} 
            color={COLORS.primary} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.duration}>{activity.duration} min</Text>
        </View>
        {activity.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color={COLORS.white} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{activity.description}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  duration: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  description: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    ...FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 4,
  },
});

export default ActivityCard;