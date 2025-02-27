import { MoodEntry, Activity } from '../types';

export const recentMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
    note: 'Had a productive day at work!'
  },
  {
    id: '2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 3,
    note: 'Feeling okay, but a bit tired.'
  },
  {
    id: '3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    note: 'Great day! Went hiking with friends.'
  },
  {
    id: '4',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 2,
    note: 'Feeling stressed about deadlines.'
  },
  {
    id: '5',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 3,
    note: 'Average day, nothing special.'
  }
];

export const recommendedActivities: Activity[] = [
  {
    id: '1',
    title: '5-Minute Meditation',
    description: 'Take a short break to clear your mind and focus on your breathing.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'medium'
  },
  {
    id: '2',
    title: 'Quick Walk Outside',
    description: 'Get some fresh air and sunlight with a 10-minute walk.',
    duration: 10,
    category: 'exercise',
    moodImpact: 'medium'
  },
  {
    id: '3',
    title: 'Gratitude Journaling',
    description: 'Write down three things you're grateful for today.',
    duration: 5,
    category: 'mindfulness',
    moodImpact: 'high'
  },
  {
    id: '4',
    title: 'Call a Friend',
    description: 'Reach out to someone you care about for a quick chat.',
    duration: 15,
    category: 'social',
    moodImpact: 'high'
  },
  {
    id: '5',
    title: 'Stretching Routine',
    description: 'Loosen up with some simple stretches to release tension.',
    duration: 7,
    category: 'exercise',
    moodImpact: 'medium'
  }
];