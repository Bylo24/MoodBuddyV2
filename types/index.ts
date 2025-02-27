export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string;
  rating: MoodRating;
  note?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'mindfulness' | 'exercise' | 'social' | 'creative' | 'relaxation';
  moodImpact: 'low' | 'medium' | 'high';
}