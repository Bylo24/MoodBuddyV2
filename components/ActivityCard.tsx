import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Activity } from '../types';
import { theme } from '../theme/theme';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{activity.duration} min</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{activity.description}</Text>
        
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
  },
  content: {
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});