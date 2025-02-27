import { supabase, getCurrentUser } from '../utils/supabaseClient';
import { MoodRating } from '../types';

// Interface for mood entries in the database
export interface MoodEntry {
  id?: string;
  user_id: string;
  date: string;
  rating: MoodRating;
  note?: string;
  created_at?: string;
}

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDate();
};

// Get mood entry for a specific date
export const getMoodEntryForDate = async (date: string): Promise<MoodEntry | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found for this date
        return null;
      }
      throw error;
    }

    return data as MoodEntry;
  } catch (error) {
    console.error('Error getting mood entry:', error);
    return null;
  }
};

// Get today's mood entry
export const getTodayMoodEntry = async (): Promise<MoodEntry | null> => {
  return getMoodEntryForDate(getTodayDate());
};

// Save or update mood entry for today
export const saveTodayMood = async (rating: MoodRating, note?: string): Promise<MoodEntry | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const today = getTodayDate();
    const existingEntry = await getMoodEntryForDate(today);

    const moodData: MoodEntry = {
      user_id: user.id,
      date: today,
      rating,
      note: note || '',
    };

    let result;
    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabase
        .from('mood_entries')
        .update(moodData)
        .eq('id', existingEntry.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result as MoodEntry;
  } catch (error) {
    console.error('Error saving mood:', error);
    return null;
  }
};

// Get recent mood entries
export const getRecentMoodEntries = async (days: number = 7): Promise<MoodEntry[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', formatDate(startDate))
      .lte('date', formatDate(endDate))
      .order('date', { ascending: false });

    if (error) throw error;

    return data as MoodEntry[];
  } catch (error) {
    console.error('Error getting recent mood entries:', error);
    return [];
  }
};

// Calculate average mood rating for a period
export const getAverageMood = async (days: number = 7): Promise<number | null> => {
  try {
    const entries = await getRecentMoodEntries(days);
    if (entries.length === 0) return null;

    const sum = entries.reduce((total, entry) => total + entry.rating, 0);
    return sum / entries.length;
  } catch (error) {
    console.error('Error calculating average mood:', error);
    return null;
  }
};

// Get mood streak (consecutive days with entries)
export const getMoodStreak = async (): Promise<number> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get all entries sorted by date
    const { data, error } = await supabase
      .from('mood_entries')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    // Calculate streak
    let streak = 1;
    const today = new Date();
    let currentDate = new Date(data[0].date);

    // If the most recent entry is not from today or yesterday, streak is 0
    const daysDiff = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) return 0;

    // Count consecutive days
    for (let i = 1; i < data.length; i++) {
      const prevDate = new Date(data[i].date);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating mood streak:', error);
    return 0;
  }
};

// Check if user can update today's mood (not locked yet)
export const canUpdateTodayMood = async (): Promise<boolean> => {
  // In a real app, you might have more complex logic here
  // For now, we'll just allow updates if it's still today
  return true;
};