import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface HeaderProps {
  userName: string;
  onProfilePress: () => void;
  onLogout: () => void;
}

export default function Header({ userName, onProfilePress, onLogout }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <MaterialIcons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold as any,
    color: 'white',
  },
  date: {
    fontSize: theme.typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});