import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { getCurrentUser } from '../services/authService';
import { getMoodStreak, getAverageMood } from '../services/moodService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabaseClient';

interface ProfileScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onClose, onLogout }: ProfileScreenProps) {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [streak, setStreak] = useState(0);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
  ];
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Try to get stored display name first
        const storedName = await AsyncStorage.getItem('user_display_name');
        
        // Load saved language preference
        const savedLanguage = await AsyncStorage.getItem('user_language');
        if (savedLanguage) {
          const langObj = languages.find(lang => lang.code === savedLanguage);
          if (langObj) {
            setCurrentLanguage(langObj.name);
          }
        }
        
        const user = await getCurrentUser();
        if (user) {
          // Use stored name if available, otherwise extract from email
          if (storedName) {
            setUserName(storedName);
          } else {
            const name = user.email ? user.email.split('@')[0] : 'User';
            setUserName(name);
          }
          
          setEmail(user.email || '');
          
          // Load streak
          const currentStreak = await getMoodStreak();
          setStreak(currentStreak);
          
          // Load average mood
          const avgMood = await getAverageMood(30); // Last 30 days
          setAverageMood(avgMood);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Direct sign out function with minimal steps
  const handleDirectSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Show loading state
              setIsSigningOut(true);
              console.log('User confirmed direct sign out');
              
              // Close the modal first
              onClose();
              
              // Short delay to let modal close
              setTimeout(async () => {
                try {
                  // Clear all storage
                  console.log('Clearing AsyncStorage');
                  await AsyncStorage.clear();
                  
                  // Sign out from Supabase
                  console.log('Signing out from Supabase');
                  await supabase.auth.signOut();
                  
                  // Call the logout callback
                  console.log('Calling onLogout callback');
                  onLogout();
                } catch (error) {
                  console.error('Error during direct sign out:', error);
                  Alert.alert('Error', 'Failed to sign out. Please try again.');
                }
              }, 300);
            } catch (error) {
              console.error('Error in direct sign out:', error);
              setIsSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  // Handle language selection
  const handleLanguageSelect = async (langCode: string, langName: string) => {
    try {
      // Save language preference
      await AsyncStorage.setItem('user_language', langCode);
      setCurrentLanguage(langName);
      setLanguageModalVisible(false);
      
      // Show confirmation
      Alert.alert(
        'Language Updated',
        `Your language has been set to ${langName}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving language preference:', error);
      Alert.alert('Error', 'Failed to update language. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
          disabled={isSigningOut}
        >
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {averageMood ? averageMood.toFixed(1) : '-'}
            </Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Ionicons name="language-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Language</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{currentLanguage}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
            <Text style={styles.menuItemText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleDirectSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalContainer}>
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>Select Language</Text>
              <TouchableOpacity 
                style={styles.languageModalCloseButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    currentLanguage === language.name && styles.languageItemSelected
                  ]}
                  onPress={() => handleLanguageSelect(language.code, language.name)}
                >
                  <Text 
                    style={[
                      styles.languageItemText,
                      currentLanguage === language.name && styles.languageItemTextSelected
                    ]}
                  >
                    {language.name}
                  </Text>
                  {currentLanguage === language.name && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  placeholder: {
    width: 36, // Same width as close button for balance
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.fontWeights.bold,
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...theme.shadows.small,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginRight: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
    ...theme.shadows.small,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.error,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.subtext,
  },
  // Language modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  languageModalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  languageModalCloseButton: {
    padding: 4,
  },
  languageList: {
    padding: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.primary + '15',
  },
  languageItemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  languageItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
});