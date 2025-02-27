import { supabase } from '../utils/supabaseClient';
import { MoodEntry, MoodRating } from '../types';

export async function getTodaysMoodEntry(userId: string): Promise<MoodEntry | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  
  if (error) {
    console.error('Error fetching today\'s mood:', error);
    return null;
  }
  
  return data;
}

export async function saveMoodEntry(
  userId: string, 
  rating: MoodRating, 
  note?: string
): Promise<MoodEntry | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Check if an entry already exists for today
  const existingEntry = await getTodaysMoodEntry(userId);
  
  if (existingEntry) {
    // Update existing entry
    const { data, error } = await supabase
      .from('mood_entries')
      .update({
        rating,
        note,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingEntry.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating mood entry:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new entry
    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: userId,
        date: today,
        rating,
        note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating mood entry:', error);
      return null;
    }
    
    return data;
  }
}

export async function getRecentMoodEntries(
  userId: string, 
  days: number = 7
): Promise<MoodEntry[]> {
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching recent moods:', error);
    return [];
  }
  
  return data || [];
}

export async function getMoodEntryForDate(
  userId: string,
  date: string
): Promise<MoodEntry | null> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  
  if (error) {
    console.error(`Error fetching mood for date ${date}:`, error);
    return null;
  }
  
  return data;
}

export async function calculateMoodStats(userId: string, days: number = 30) {
  const entries = await getRecentMoodEntries(userId, days);
  
  if (entries.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      streak: 0
    };
  }
  
  // Calculate average
  const sum = entries.reduce((acc, entry) => acc + entry.rating, 0);
  const average = sum / entries.length;
  
  // Find highest and lowest
  const ratings = entries.map(entry => entry.rating);
  const highest = Math.max(...ratings);
  const lowest = Math.min(...ratings);
  
  // Calculate streak
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Sort entries by date in descending order
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Check if there's an entry for today
  if (sortedEntries.length > 0 && sortedEntries[0].date === today) {
    streak = 1;
    
    // Check consecutive days
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i-1].date);
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (sortedEntries[i].date === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return {
    average,
    highest,
    lowest,
    streak
  };
}