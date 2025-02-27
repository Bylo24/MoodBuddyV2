export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // ISO string
  rating: MoodRating;
  note?: string;
  activities?: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration: number; // in minutes
  isPremium: boolean;
}

export type ActivityCategory = 
  | 'mindfulness' 
  | 'journaling' 
  | 'music' 
  | 'physical' 
  | 'social' 
  | 'creative';

export interface User {
  id: string;
  name: string;
  isPremium: boolean;
  notificationsEnabled: boolean;
  notificationTime?: string; // HH:MM format
  theme: 'light' | 'dark' | 'system';
}