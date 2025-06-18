// theme.ts
export const theme = {
  colors: {
    // Core Colors
    background: '#F7F8FA', // Light gray background that feels fresh
    darkBackground: '#1F2029', // For dark mode
    card: '#FFFFFF',
    darkCard: '#282A36',
    
    // Primary palette - Sophisticated blue with secondary accents
    primary: '#3B82F6', // Vibrant blue - main brand color
    primaryDark: '#2563EB', // Darker blue for hover states
    primaryLight: '#93C5FD', // Light blue for backgrounds
    secondary: '#10B981', // Emerald green for accents
    tertiary: '#8B5CF6', // Purple for special elements

    // Text colors
    text: '#1E293B', // Near black for readability
    textSecondary: '#64748B', // Medium gray for secondary text
    textLight: '#94A3B8', // Light gray for tertiary text
    textOnDark: '#F1F5F9', // Light text for dark backgrounds
    
    // UI elements
    border: '#E2E8F0', // Very light gray for borders
    success: '#10B981', // Emerald green
    error: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    
    // Special effects
    gradient: ['#3B82F6', '#8B5CF6'], // Blue to purple gradient
    glass: 'rgba(255, 255, 255, 0.9)', // Light glass effect
    darkGlass: 'rgba(31, 32, 41, 0.8)', // Dark glass effect
    shadow: 'rgba(0, 0, 0, 0.08)', // Subtle shadow
  },
  
  fonts: {
    // Using system fonts for now (can be replaced with custom fonts)
    regular: 'System',
    medium: 'System',
    bold: 'System',
    size: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    },
  },
  
  spacing: {
    '0': 0,
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '8': 32,
    '10': 40,
    '12': 48,
    '16': 64,
  },
  
  // Rounded corners
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
  },
  
  // Animation durations
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
}; 