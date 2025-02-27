import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { Activity } from '../types';

const ActivityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activities, user, togglePremium } = useAppContext();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  
  // Get activity ID from route params
  const activityId = (route.params as { activityId: string })?.activityId;
  
  useEffect(() => {
    if (activityId) {
      const foundActivity = activities.find(a => a.id === activityId);
      if (foundActivity) {
        setActivity(foundActivity);
      }
    }
  }, [activityId, activities]);
  
  const handleStartActivity = () => {
    // In a real app, this would navigate to the activity content
    Alert.alert(
      'Activity Started',
      `You've started: ${activity?.title}`,
      [{ text: 'OK' }]
    );
  };
  
  const handleUnlockPremium = () => {
    Alert.alert(
      'Unlock Premium',
      'In a real app, this would open the in-app purchase flow. For this demo, we\'ll simulate unlocking premium features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unlock Premium', 
          onPress: () => {
            togglePremium();
            Alert.alert('Success', 'Premium features unlocked!');
          }
        }
      ]
    );
  };
  
  if (!activity) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Activity not found</Text>
      </View>
    );
  }
  
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'mindfulness': return 'Mindfulness';
      case 'journaling': return 'Journaling';
      case 'music': return 'Music';
      case 'physical': return 'Physical';
      case 'social': return 'Social';
      case 'creative': return 'Creative';
      default: return category;
    }
  };
  
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
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          {activity.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={16} color={COLORS.white} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getCategoryIcon(activity.category)} 
              size={32} 
              color={COLORS.primary} 
            />
          </View>
          
          <Text style={styles.title}>{activity.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
              <Text style={styles.metaText}>{activity.duration} min</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={16} color={COLORS.textLight} />
              <Text style={styles.metaText}>{getCategoryName(activity.category)}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>About this activity</Text>
          <Text style={styles.description}>{activity.description}</Text>
          
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Reduces stress and anxiety</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Improves mood and emotional well-being</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Enhances self-awareness</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {activity.isPremium && !user?.isPremium ? (
          <Button 
            title="Unlock Premium" 
            onPress={handleUnlockPremium}
            icon={<Ionicons name="star" size={18} color={COLORS.white} />}
          />
        ) : (
          <Button 
            title="Start Activity" 
            onPress={handleStartActivity}
            icon={<Ionicons name="play" size={18} color={COLORS.white} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    marginBottom: 16,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default ActivityDetailScreen;