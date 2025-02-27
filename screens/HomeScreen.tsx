import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import MoodChart from '../components/MoodChart';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, moodEntries, activities, getRecommendedActivities } = useAppContext();
  
  // Get today's mood entry if it exists
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEntry = moodEntries.find(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Get recommended activities based on today's mood or default to neutral
  const recommendedActivities = todayEntry 
    ? getRecommendedActivities(todayEntry.rating)
    : activities.slice(0, 3);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{user?.name || 'Friend'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.moodSection}>
        {todayEntry ? (
          <View style={styles.todayMood}>
            <Text style={styles.sectionTitle}>Today's Mood</Text>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>
                {todayEntry.rating === 1 ? '😢' : 
                 todayEntry.rating === 2 ? '😕' : 
                 todayEntry.rating === 3 ? '😐' : 
                 todayEntry.rating === 4 ? '🙂' : '😄'}
              </Text>
              <Text style={styles.moodText}>
                {todayEntry.rating === 1 ? 'Very Sad' : 
                 todayEntry.rating === 2 ? 'Sad' : 
                 todayEntry.rating === 3 ? 'Neutral' : 
                 todayEntry.rating === 4 ? 'Happy' : 'Very Happy'}
              </Text>
            </View>
            {todayEntry.note && (
              <Text style={styles.moodNote}>{todayEntry.note}</Text>
            )}
          </View>
        ) : (
          <View style={styles.checkInPrompt}>
            <Text style={styles.checkInTitle}>How are you feeling today?</Text>
            <Button 
              title="Check In Now" 
              onPress={() => navigation.navigate('CheckIn' as never)}
              icon={<Ionicons name="add-circle-outline" size={18} color={COLORS.white} />}
            />
          </View>
        )}
      </View>
      
      {moodEntries.length > 1 && (
        <MoodChart entries={moodEntries} />
      )}
      
      <View style={styles.activitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Activities' as never)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recommendedActivities.map(activity => (
          <ActivityCard 
            key={activity.id}
            activity={activity}
            onPress={() => navigation.navigate('ActivityDetail' as never, { activityId: activity.id } as never)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  name: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  moodSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  todayMood: {},
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodText: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
  },
  moodNote: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  checkInPrompt: {
    alignItems: 'center',
    padding: 16,
  },
  checkInTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
  },
  activitiesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default HomeScreen;