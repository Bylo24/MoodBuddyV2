import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import MoodButton from '../components/MoodButton';
import Button from '../components/Button';
import { MoodRating } from '../types';

const CheckInScreen = () => {
  const navigation = useNavigation();
  const { addMoodEntry } = useAppContext();
  
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleMoodSelect = (rating: MoodRating) => {
    setSelectedMood(rating);
  };
  
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      await addMoodEntry({
        date: new Date().toISOString(),
        rating: selectedMood,
        note: note.trim() || undefined,
      });
      
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Select the emoji that best represents your mood</Text>
        
        <View style={styles.moodContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <MoodButton
              key={rating}
              rating={rating as MoodRating}
              selected={selectedMood === rating}
              onSelect={handleMoodSelect}
            />
          ))}
        </View>
        
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Add a note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind today?"
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={200}
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.characterCount}>{note.length}/200</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Mood"
            size="large"
            loading={isSubmitting}
            disabled={!selectedMood || isSubmitting}
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  noteContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    ...SHADOWS.small,
  },
  noteLabel: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  noteInput: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 0,
  },
  characterCount: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});

export default CheckInScreen;