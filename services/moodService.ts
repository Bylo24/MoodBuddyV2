import { supabase } from '../utils/supabaseClient';
import { MoodEntry, MoodRating } from '../types';

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

// Check if a date is yesterday
export const isYesterday = (dateString: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatDate(yesterday);
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  const today = getTodayDate();
  return dateString < today;
};

// Get mood entry for a specific date
export const getMoodEntryForDate = async (date: string): Promise<MoodEntry | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is not an error for us
        return null;
      }
      console.error('Error fetching mood entry:', error);
      return null;
    }
    
    return data as MoodEntry;
  } catch (error) {
    console.error('Unexpected error in getMoodEntryForDate:', error);
    return null;
  }
};

// Get mood entry for today
export const getTodayMoodEntry = async (): Promise<MoodEntry | null> => {
  return getMoodEntryForDate(getTodayDate());
};

// Save mood entry for today
export const saveTodayMood = async (rating: MoodRating, note?: string): Promise<MoodEntry | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }
    
    const today = getTodayDate();
    
    // Check if an entry already exists for today
    const existingEntry = await getMoodEntryForDate(today);
    
    if (existingEntry) {
      console.log('Updating existing mood entry for today');
      // Update existing entry
      const { data, error } = await supabase
        .from('mood_entries')
        .update({ rating, note })
        .eq('id', existingEntry.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating mood entry:', error);
        return null;
      }
      
      return data as MoodEntry;
    } else {
      console.log('Creating new mood entry for today');
      // Create new entry
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([
          { user_id: user.id, date: today, rating, note }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating mood entry:', error);
        return null;
      }
      
      return data as MoodEntry;
    }
  } catch (error) {
    console.error('Unexpected error in saveTodayMood:', error);
    return null;
  }
};

// Get recent mood entries for the current week (Sunday to Saturday)
export const getCurrentWeekMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Get current date
    const now = new Date();
    
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Go forward to Saturday
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startDate = formatDate(startOfWeek);
    const endDate = formatDate(endOfWeek);
    
    console.log(`Fetching mood entries from ${startDate} to ${endDate}`);
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching weekly mood entries:', error);
      return [];
    }
    
    return data as MoodEntry[];
  } catch (error) {
    console.error('Unexpected error in getCurrentWeekMoodEntries:', error);
    return [];
  }
};

// Get recent mood entries
export const getRecentMoodEntries = async (days: number = 7): Promise<MoodEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const endDate = getTodayDate();
    const startDate = formatDate(new Date(Date.now() - (days * 24 * 60 * 60 * 1000)));
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching recent mood entries:', error);
      return [];
    }
    
    return data as MoodEntry[];
  } catch (error) {
    console.error('Unexpected error in getRecentMoodEntries:', error);
    return [];
  }
};

// Calculate weekly average mood
export const getWeeklyAverageMood = async (): Promise<number | null> => {
  try {
    const entries = await getCurrentWeekMoodEntries();
    
    if (entries.length === 0) return null;
    
    const sum = entries.reduce((total, entry) => total + entry.rating, 0);
    return sum / entries.length;
  } catch (error) {
    console.error('Error calculating weekly average mood:', error);
    return null;
  }
};

// Calculate average mood for a period
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

// Get all mood entries sorted by date
export const getAllMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching all mood entries:', error);
      return [];
    }
    
    return data as MoodEntry[];
  } catch (error) {
    console.error('Unexpected error in getAllMoodEntries:', error);
    return [];
  }
};

// Get mood streak (consecutive days with mood entries)
export const getMoodStreak = async (): Promise<number> => {
  try {
    const allEntries = await getAllMoodEntries();
    if (allEntries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    const sortedEntries = [...allEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if the most recent entry is from today or yesterday
    const mostRecentDate = new Date(sortedEntries[0].date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // If most recent entry is older than yesterday, streak is broken
    if (mostRecentDate.getTime() < yesterday.getTime()) {
      console.log('Streak broken: Most recent entry is older than yesterday');
      return 0;
    }
    
    // Start counting streak
    let streak = 1;
    let currentDate = new Date(mostRecentDate);
    
    // Loop through dates backwards, checking for consecutive days
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      prevDate.setHours(0, 0, 0, 0);
      
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      // Check if this entry is from the previous day
      if (entryDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = entryDate;
      } else {
        // Streak is broken
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Unexpected error in getMoodStreak:', error);
    return 0;
  }
};

// Check if user can edit mood for a specific date
export const canEditMood = (dateString: string): boolean => {
  // Only allow editing for today's mood
  return isToday(dateString);
};