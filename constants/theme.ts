import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#6A5ACD', // Soft purple (main color)
  secondary: '#9370DB', // Medium purple
  tertiary: '#B19CD9', // Light purple
  
  white: '#FFFFFF',
  black: '#000000',
  
  background: '#F8F9FA', // Very light gray with a hint of blue
  card: '#FFFFFF',
  
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  
  success: '#4CAF50', // Green
  warning: '#FFC107', // Yellow
  error: '#F44336', // Red
  info: '#2196F3', // Blue
  
  // Mood colors
  veryHappy: '#4CAF50', // Green
  happy: '#8BC34A', // Light green
  neutral: '#FFC107', // Yellow
  sad: '#FF9800', // Orange
  verySad: '#F44336', // Red
  
  // Gradient colors
  gradientStart: '#6A5ACD',
  gradientEnd: '#9370DB',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  
  // Screen dimensions
  width,
  height,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};