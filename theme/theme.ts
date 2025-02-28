export const theme = {
  colors: {
    primary: '#6A5ACD', // Slate blue
    secondary: '#9370DB', // Medium purple
    accent: '#8A2BE2', // Blue violet
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#333333',
    subtext: '#666666',
    border: '#E0E0E0',
    notification: '#FF3B30',
    success: '#4CD964',
    warning: '#FF9500',
    error: '#FF3B30',
    moodColors: {
      1: '#E53935', // Very Bad - Red
      2: '#FB8C00', // Bad - Orange
      3: '#FDD835', // Okay - Yellow
      4: '#7CB342', // Good - Light Green
      5: '#43A047', // Very Good - Green
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};