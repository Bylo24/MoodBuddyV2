import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import OnboardingProgress from '../components/OnboardingProgress';

interface IntroductionScreenProps {
  onComplete: () => void;
  userName: string;
}

export default function IntroductionScreen({ onComplete, userName }: IntroductionScreenProps) {
  return (
    <View style={styles.container}>
      <OnboardingProgress currentStep={2} totalSteps={3} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome to Mood Buddy, {userName || 'Friend'}!</Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>📊</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Track Your Mood</Text>
            <Text style={styles.featureDescription}>
              Log your daily mood and activities to identify patterns in your emotional wellbeing.
            </Text>
          </View>
        </View>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>🧠</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Gain Insights</Text>
            <Text style={styles.featureDescription}>
              Discover connections between your activities and mood to make positive changes.
            </Text>
          </View>
        </View>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>💭</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Daily Affirmations</Text>
            <Text style={styles.featureDescription}>
              Start each day with positive affirmations tailored to your mood history.
            </Text>
          </View>
        </View>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>📈</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDescription}>
              View your mood trends over time and celebrate your improvements.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
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
  featureContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold as any,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.subtext,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
});