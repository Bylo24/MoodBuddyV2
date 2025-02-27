import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Activity } from '../types';
import { theme } from '../theme/theme';

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
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getCategoryIcon(activity.category)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
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
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.medium,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  iconContainer: {
    width: 60,
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    lineHeight: theme.lineHeights.tight * theme.fontSizes.lg,
  },
  durationContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  duration: {
    color: 'white',
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.medium,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.md,
    lineHeight: theme.lineHeights.normal * theme.fontSizes.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.medium,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.subtext,
  },
  impactValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  progressContainer: {
    marginTop: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
  progressText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.subtext,
    fontStyle: 'italic',
  },
});