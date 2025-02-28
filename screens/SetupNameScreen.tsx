import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import OnboardingProgress from '../components/OnboardingProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SetupNameScreenProps {
  onComplete: (name: string) => void;
  onSkip: () => void;
}

export default function SetupNameScreen({ onComplete, onSkip }: SetupNameScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name Required', 'Please enter your name to continue');
      return;
    }

    setIsLoading(true);
    try {
      // Save the name to AsyncStorage
      await AsyncStorage.setItem('user_display_name', trimmedName);
      onComplete(trimmedName);
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      // Clear any existing name
      await AsyncStorage.removeItem('user_display_name');
      onSkip();
    } catch (error) {
      console.error('Error in skip flow:', error);
      onSkip(); // Still proceed with skip
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingProgress currentStep={1} totalSteps={3} />
      
      <View style={styles.content}>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your experience
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={30}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            isLoading={isLoading}
          />
          
          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="secondary"
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100, // Offset to center content better
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
});