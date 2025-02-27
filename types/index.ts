export type MoodRating = 1 | 2 | 3 | 4 | 5;

export type MoodEntry = {
  id: string;
  date: string;
  rating: MoodRating;
  note?: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'mindfulness' | 'exercise' | 'social' | 'creative' | 'relaxation';
  moodImpact: 'low' | 'medium' | 'high';
  imageUrl?: string;
};