import { MoodEntry, Activity } from '../types';

export const recentMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: '2023-11-15',
    rating: 4,
    note: 'Had a productive day at work and enjoyed dinner with friends.',
  },
  {
    id: '2',
    date: '2023-11-14',
    rating: 3,
    note: 'Feeling okay, but a bit tired from yesterday.',
  },
  {
    id: '3',
    date: '2023-11-13',
    rating: 5,
    note: 'Amazing day! Got a promotion at work.',
  },
  {
    id: '4',
    date: '2023-11-12',
    rating: 2,
    note: 'Feeling down today. Rainy weather and canceled plans.',
  },
  {
    id: '5',
    date: '2023-11-11',
    rating: 3,
    note: 'Average day, nothing special happened.',
  },
];

export const recommendedActivities: Activity[] = [
  {
    id: '1',
    title: '5-Minute Meditation',
    description: 'Take a short break to clear your mind and focus on your breathing.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e',
  },
  {
    id: '2',
    title: 'Quick Stretching',
    description: 'Loosen up with some simple stretches to release tension.',
    duration: 10,
    category: 'exercise',
    moodImpact: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1',
  },
  {
    id: '3',
    title: 'Gratitude Journaling',
    description: 'Write down three things you are grateful for today.',
    duration: 15,
    category: 'mindfulness',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
  },
  {
    id: '4',
    title: 'Call a Friend',
    description: 'Reach out to someone you care about for a quick chat.',
    duration: 20,
    category: 'social',
    moodImpact: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8',
  },
];