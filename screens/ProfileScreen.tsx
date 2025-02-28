import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../services/authService';

interface ProfileScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onClose, onLogout }: ProfileScreenProps) {
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('user_display_name');
      const savedLanguage = await AsyncStorage.getItem('user_language');
      
      if (storedName) {
        setName(storedName);
        setNewName(storedName);
      }
      
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('user_display_name', newName.trim());
      setName(newName.trim());
      setIsEditing(false);
      Alert.alert('Success', 'Your name has been updated');
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert('Error', 'Failed to save your name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    setIsLoading(true);
    try {
      setLanguage(langCode);
      await AsyncStorage.setItem('user_language', langCode);
      Alert.alert('Success', 'Language preference saved');
    } catch (error) {
      console.error('Error saving language preference:', error);
      Alert.alert('Error', 'Failed to save language preference');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut();
              onLogout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // In a real app, we would call an API to delete the user's account
              // For now, we'll just clear AsyncStorage and log out
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      try {
                        console.log('Clearing AsyncStorage');
                        await AsyncStorage.clear();
                        onLogout();
                      } catch (error) {
                        console.error('Error clearing data:', error);
                      }
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete your account');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Name</Text>
          {isEditing ? (
            <View>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
                autoFocus
              />
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setNewName(name);
                    setIsEditing(false);
                  }}
                  variant="secondary"
                  disabled={isLoading}
                />
                <Button
                  title="Save"
                  onPress={handleSaveName}
                  isLoading={isLoading}
                />
              </View>
            </View>
          ) : (
            <View style={styles.displayRow}>
              <Text style={styles.displayText}>{name}</Text>
              <Button
                title="Edit"
                onPress={() => setIsEditing(true)}
                variant="secondary"
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.languageOptions}>
            <Button
              title="English"
              onPress={() => handleLanguageChange('en')}
              variant={language === 'en' ? 'primary' : 'outline'}
              disabled={isLoading}
            />
            <Button
              title="Español"
              onPress={() => handleLanguageChange('es')}
              variant={language === 'es' ? 'primary' : 'outline'}
              disabled={isLoading}
            />
            <Button
              title="Français"
              onPress={() => handleLanguageChange('fr')}
              variant={language === 'fr' ? 'primary' : 'outline'}
              disabled={isLoading}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            disabled={isLoading}
          />
          <View style={styles.spacer} />
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="outline"
            disabled={isLoading}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Close"
          onPress={onClose}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold as any,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold as any,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  displayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayText: {
    fontSize: theme.typography.fontSizes.lg,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  spacer: {
    height: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});