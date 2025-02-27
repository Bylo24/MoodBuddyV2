export const theme = {
  colors: {
    primary: '#6A5ACD', // Slate blue - calming color
    secondary: '#9370DB', // Medium purple
    accent: '#FFD700', // Gold - for positive elements
    background: '#F8F8FF', // Ghost white - light background
    card: '#FFFFFF', // White for cards
    text: '#333333', // Dark text
    subtext: '#666666', // Lighter text for subtitles
    border: '#E0E0E0', // Light border
    success: '#4CAF50', // Green for positive moods
    warning: '#FFC107', // Yellow/amber for neutral moods
    error: '#F44336', // Red for negative moods
    info: '#2196F3', // Blue for informational elements
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
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;