import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, togglePremium } = useAppContext();
  
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveName = async () => {
    if (name.trim()) {
      await updateUser({ name: name.trim() });
      setIsEditing(false);
    }
  };
  
  const handleToggleNotifications = async (value: boolean) => {
    await updateUser({ notificationsEnabled: value });
  };
  
  const handleTogglePremium = async () => {
    if (user?.isPremium) {
      Alert.alert(
        'Cancel Premium',
        'Are you sure you want to cancel your premium subscription?',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes', 
            onPress: () => {
              togglePremium();
              Alert.alert('Success', 'Premium subscription canceled.');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Upgrade to Premium',
        'Unlock all premium features including advanced insights, guided meditations, and a customizable experience.',
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
    }
  };
  
  const handleRateApp = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      Alert.alert(
        'Rate Mood Buddy',
        'Thank you for wanting to rate our app! In a real app, this would redirect to the App Store or Play Store.',
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
            
            {isEditing ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      setName(user?.name || '');
                      setIsEditing(false);
                    }}
                  >
                    <Ionicons name="close" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={handleSaveName}
                  >
                    <Ionicons name="checkmark" size={20} color={COLORS.success} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user?.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="pencil" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>Daily Check-in Reminder</Text>
            </View>
            <Switch
              value={user?.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E0E0E0', true: COLORS.tertiary }}
              thumbColor={user?.notificationsEnabled ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Ionicons name="star" size={24} color={COLORS.white} />
              <Text style={styles.premiumTitle}>Mood Buddy Premium</Text>
            </View>
            
            <Text style={styles.premiumDescription}>
              Unlock advanced insights, guided meditations, and a fully customizable experience.
            </Text>
            
            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.premiumFeatureText}>Advanced mood analytics</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.premiumFeatureText}>Exclusive guided meditations</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.premiumFeatureText}>Personalized recommendations</Text>
              </View>
            </View>
            
            <Button
              title={user?.isPremium ? "Cancel Premium" : "Upgrade to Premium"}
              variant={user?.isPremium ? "outline" : "primary"}
              onPress={handleTogglePremium}
              style={styles.premiumButton}
            />
            
            {user?.isPremium && (
              <Text style={styles.premiumStatus}>
                You currently have premium access
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleRateApp}>
            <View style={styles.settingInfo}>
              <Ionicons name="star-outline" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>Rate Mood Buddy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
              <Text style={styles.settingText}>About Mood Buddy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.white,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
  },
  editNameContainer: {
    flex: 1,
  },
  nameInput: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 4,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginLeft: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  premiumCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitle: {
    ...FONTS.bold,
    fontSize: 18,
    color: COLORS.white,
    marginLeft: 8,
  },
  premiumDescription: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumFeatures: {
    marginBottom: 16,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumFeatureText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 8,
  },
  premiumButton: {
    backgroundColor: COLORS.white,
  },
  premiumStatus: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 12,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  versionText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});

export default SettingsScreen;