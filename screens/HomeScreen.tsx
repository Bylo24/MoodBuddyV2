import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import Header from '../components/Header';
import MoodButton from '../components/MoodButton';
import DailyAffirmation from '../components/DailyAffirmation';
import MoodTrendGraph from '../components/MoodTrendGraph';
import ActivityCard from '../components/ActivityCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const [userName, setUserName] = useState('Friend');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('user_display_name');
      if (storedName) {
        setUserName(storedName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const handleUpdateName = async (name: string) => {
    try {
      setUserName(name);
      await AsyncStorage.setItem('user_display_name', name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        userName={userName}
        onProfilePress={() => setShowProfileModal(true)}
        onLogout={onLogout}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <DailyAffirmation />
        
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodButtonsContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <MoodButton 
                key={rating} 
                rating={rating} 
                onPress={() => console.log(`Mood ${rating} selected`)} 
              />
            ))}
          </View>
        </View>
        
        <View style={styles.trendSection}>
          <Text style={styles.sectionTitle}>Your Mood Trend</Text>
          <MoodTrendGraph />
        </View>
        
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Suggested Activities</Text>
          <View style={styles.activitiesContainer}>
            <ActivityCard 
              title="Take a Walk" 
              description="A 10-minute walk can boost your mood"
              icon="directions-walk"
            />
            <ActivityCard 
              title="Deep Breathing" 
              description="5 minutes of deep breathing reduces stress"
              icon="air"
            />
            <ActivityCard 
              title="Journal" 
              description="Write down your thoughts and feelings"
              icon="edit"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold as any,
    marginBottom: theme.spacing.md,
  },
  moodSection: {
    marginTop: theme.spacing.lg,
  },
  moodButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendSection: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  activitiesSection: {
    marginTop: theme.spacing.xl,
  },
  activitiesContainer: {
    gap: theme.spacing.md,
  },
});