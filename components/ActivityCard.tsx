import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { Activity } from '../types';
import { theme } from '../theme/theme';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  // Get icon based on activity category
  const getCategoryIcon = (category: Activity['category']) => {
    switch (category) {
      case 'mindfulness': return '🧘‍♀️';
      case 'exercise': return '🏃‍♂️';
      case 'social': return '👥';
      case 'creative': return '🎨';
      case 'relaxation': return '🛀';
      default: return '✨';
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
      ]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getCategoryIcon(activity.category)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{activity.title}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{activity.duration} min</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {activity.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={[styles.categoryBadge, getCategoryStyle(activity.category)]}>
            <Text style={styles.categoryText}>
              {capitalizeFirstLetter(activity.category)}
            </Text>
          </View>
          
          <View style={styles.impactContainer}>
            <Text style={styles.impactLabel}>Impact: </Text>
            <Text style={[styles.impactValue, getImpactStyle(activity.moodImpact)]}>
              {capitalizeFirstLetter(activity.moodImpact)}
            </Text>
          </View>
        </View>
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>Complete 3 more for a reward!</Text>
        </View>
      </View>
    </Pressable>
  );
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryStyle(category: Activity['category']) {
  switch (category) {
    case 'mindfulness':
      return { backgroundColor: '#E0F7FA' }; // Light cyan
    case 'exercise':
      return { backgroundColor: '#E8F5E9' }; // Light green
    case 'social':
      return { backgroundColor: '#FFF3E0' }; // Light orange
    case 'creative':
      return { backgroundColor: '#F3E5F5' }; // Light purple
    case 'relaxation':
      return { backgroundColor: '#E3F2FD' }; // Light blue
    default:
      return {};
  }
}

function getImpactStyle(impact: Activity['moodImpact']) {
  switch (impact) {
    case 'low':
      return { color: theme.colors.info };
    case 'medium':
      return { color: theme.colors.warning };
    case 'high':
      return { color: theme.colors.success };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    ...theme.shadows.medium,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '100%',
  },
  iconContainer: {
    width: 50,
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  durationContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duration: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.fontWeights.medium,
  },
  description: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.medium,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 12,
    color: theme.colors.subtext,
  },
  impactValue: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
  progressText: {
    fontSize: 10,
    color: theme.colors.subtext,
    fontStyle: 'italic',
  },
});