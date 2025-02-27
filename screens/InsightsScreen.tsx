import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import MoodChart from '../components/MoodChart';
import Button from '../components/Button';

const InsightsScreen = () => {
  const { moodEntries, user, togglePremium } = useAppContext();
  
  // Calculate average mood
  const calculateAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    
    const sum = moodEntries.reduce((acc, entry) => acc + entry.rating, 0);
    return sum / moodEntries.length;
  };
  
  const averageMood = calculateAverageMood();
  
  // Get mood description
  const getMoodDescription = (rating: number) => {
    if (rating <= 1.5) return 'Feeling low';
    if (rating <= 2.5) return 'Somewhat sad';
    if (rating <= 3.5) return 'Neutral';
    if (rating <= 4.5) return 'Quite happy';
    return 'Very happy';
  };
  
  // Calculate mood distribution
  const calculateMoodDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    moodEntries.forEach(entry => {
      distribution[entry.rating]++;
    });
    
    return distribution;
  };
  
  const moodDistribution = calculateMoodDistribution();
  
  // Calculate total entries
  const totalEntries = moodEntries.length;
  
  // Calculate streak (consecutive days with entries)
  const calculateStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    const sortedEntries = [...moodEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedEntries[0].date);
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      
      // Check if this entry is from the previous day
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      
      if (
        entryDate.getDate() === prevDay.getDate() &&
        entryDate.getMonth() === prevDay.getMonth() &&
        entryDate.getFullYear() === prevDay.getFullYear()
      ) {
        streak++;
        currentDate = entryDate;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  const handleUnlockPremium = () => {
    Alert.alert(
      'Unlock Premium Insights',
      'Get access to advanced mood analytics, patterns, and personalized recommendations.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade', 
          onPress: () => {
            togglePremium();
            Alert.alert('Success', 'Premium features unlocked!');
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Mood Insights</Text>
      
      <MoodChart entries={moodEntries} days={14} />
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{averageMood.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Average Mood</Text>
          <Text style={styles.statDescription}>{getMoodDescription(averageMood)}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalEntries}</Text>
          <Text style={styles.statLabel}>Total Check-ins</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
      
      <View style={styles.distributionCard}>
        <Text style={styles.cardTitle}>Mood Distribution</Text>
        <View style={styles.distributionContainer}>
          {[5, 4, 3, 2, 1].map(rating => (
            <View key={rating} style={styles.distributionItem}>
              <Text style={styles.moodEmoji}>
                {rating === 1 ? '😢' : 
                 rating === 2 ? '😕' : 
                 rating === 3 ? '😐' : 
                 rating === 4 ? '🙂' : '😄'}
              </Text>
              <View style={styles.distributionBarContainer}>
                <View 
                  style={[
                    styles.distributionBar, 
                    { 
                      width: `${totalEntries > 0 ? (moodDistribution[rating] / totalEntries) * 100 : 0}%`,
                      backgroundColor: 
                        rating === 1 ? COLORS.verySad : 
                        rating === 2 ? COLORS.sad : 
                        rating === 3 ? COLORS.neutral : 
                        rating === 4 ? COLORS.happy : COLORS.veryHappy
                    }
                  ]} 
                />
              </View>
              <Text style={styles.distributionCount}>{moodDistribution[rating]}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {!user?.isPremium && (
        <View style={styles.premiumCard}>
          <View style={styles.premiumContent}>
            <Ionicons name="lock-closed" size={24} color={COLORS.white} />
            <Text style={styles.premiumTitle}>Advanced Insights</Text>
            <Text style={styles.premiumDescription}>
              Unlock detailed mood patterns, correlations, and personalized recommendations with Premium.
            </Text>
            <Button 
              title="Unlock Premium" 
              variant="outline"
              style={styles.premiumButton}
              onPress={handleUnlockPremium}
            />
          </View>
        </View>
      )}
      
      {user?.isPremium && (
        <View style={styles.advancedInsightsCard}>
          <Text style={styles.cardTitle}>Premium Insights</Text>
          
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={24} color={COLORS.primary} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Mood Trend</Text>
              <Text style={styles.insightDescription}>
                Your mood has been improving over the past week. Keep up the good work!
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Best Day</Text>
              <Text style={styles.insightDescription}>
                Wednesdays tend to be your happiest days. Consider scheduling important activities then.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <Ionicons name="fitness" size={24} color={COLORS.primary} />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Activity Impact</Text>
              <Text style={styles.insightDescription}>
                Physical activities seem to have the most positive impact on your mood.
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 16,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  statDescription: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  distributionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  cardTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  distributionContainer: {
    marginBottom: 8,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodEmoji: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  distributionBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 6,
  },
  distributionCount: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    width: 30,
    textAlign: 'right',
  },
  premiumCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  premiumContent: {
    padding: 16,
    alignItems: 'center',
  },
  premiumTitle: {
    ...FONTS.bold,
    fontSize: 18,
    color: COLORS.white,
    marginVertical: 8,
  },
  premiumDescription: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  premiumButton: {
    borderColor: COLORS.white,
  },
  advancedInsightsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  insightDescription: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default InsightsScreen;