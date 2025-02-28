import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import OnboardingProgress from '../components/OnboardingProgress';

interface TipsScreenProps {
  onComplete: () => void;
}

export default function TipsScreen({ onComplete }: TipsScreenProps) {
  return (
    <View style={styles.container}>
      <OnboardingProgress currentStep={3} totalSteps={3} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Tips for Getting the Most Out of Mood Buddy</Text>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipNumber}>1</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Track Daily</Text>
            <Text style={styles.tipDescription}>
              For the most accurate insights, try to log your mood at least once a day.
            </Text>
          </View>
        </View>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipNumber}>2</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Be Honest</Text>
            <Text style={styles.tipDescription}>
              Record how you truly feel, not how you think you should feel.
            </Text>
          </View>
        </View>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipNumber}>3</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Add Context</Text>
            <Text style={styles.tipDescription}>
              Include activities and notes to better understand what affects your mood.
            </Text>
          </View>
        </View>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipNumber}>4</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Review Regularly</Text>
            <Text style={styles.tipDescription}>
              Check your mood trends weekly to identify patterns and make positive changes.
            </Text>
          </View>
        </View>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipNumber}>5</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Be Patient</Text>
            <Text style={styles.tipDescription}>
              Emotional wellbeing is a journey. Small improvements add up over time.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={onComplete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: theme.colors.text,
    marginVertical: theme.spacing.lg,
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  tipNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: theme.typography.fontWeights.bold as any,
    marginRight: theme.spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold as any,
    marginBottom: theme.spacing.xs,
  },
  tipDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.subtext,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
});