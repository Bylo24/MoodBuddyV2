export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id?: string;
  user_id: string;
  date: string;
  rating: MoodRating;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'mindfulness' | 'exercise' | 'social' | 'creative' | 'relaxation';
  moodImpact: 'low' | 'medium' | 'high';
  imageUrl?: string;
}