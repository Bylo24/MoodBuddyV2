import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry, Activity, User } from '../types';
import { MOCK_MOOD_ENTRIES, MOCK_ACTIVITIES } from '../data/mockData';

interface AppContextType {
  user: User | null;
  moodEntries: MoodEntry[];
  activities: Activity[];
  isLoading: boolean;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  togglePremium: () => Promise<void>;
  getRecommendedActivities: (moodRating: number) => Activity[];
}

const defaultUser: User = {
  id: '1',
  name: 'User',
  isPremium: false,
  notificationsEnabled: true,
  theme: 'light',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(defaultUser);
          await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
        }

        // Load mood entries
        const entriesData = await AsyncStorage.getItem('moodEntries');
        if (entriesData) {
          setMoodEntries(JSON.parse(entriesData));
        } else {
          setMoodEntries(MOCK_MOOD_ENTRIES);
          await AsyncStorage.setItem('moodEntries', JSON.stringify(MOCK_MOOD_ENTRIES));
        }

        // Load activities
        setActivities(MOCK_ACTIVITIES);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    try {
      const newEntry: MoodEntry = {
        ...entry,
        id: Date.now().toString(),
      };

      const updatedEntries = [newEntry, ...moodEntries];
      setMoodEntries(updatedEntries);
      await AsyncStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error adding mood entry:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const togglePremium = async () => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, isPremium: !user.isPremium };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error toggling premium:', error);
    }
  };

  const getRecommendedActivities = (moodRating: number): Activity[] => {
    // Logic to recommend activities based on mood rating
    if (moodRating <= 2) {
      // For low mood, recommend uplifting activities
      return activities.filter(a => 
        a.category === 'music' || 
        a.category === 'physical' || 
        a.category === 'social'
      ).slice(0, 3);
    } else if (moodRating === 3) {
      // For neutral mood, recommend a mix
      return activities.filter(a => 
        a.category === 'mindfulness' || 
        a.category === 'creative'
      ).slice(0, 3);
    } else {
      // For good mood, recommend activities to maintain it
      return activities.filter(a => 
        a.category === 'journaling' || 
        a.category === 'mindfulness'
      ).slice(0, 3);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        moodEntries,
        activities,
        isLoading,
        addMoodEntry,
        updateUser,
        togglePremium,
        getRecommendedActivities,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};