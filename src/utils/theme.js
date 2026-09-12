import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#1B3A5C',         // Deep Navy
  primaryDark: '#10243B',
  primaryLight: '#2C5A8A',
  accent: '#D4A843',          // Wheat Gold
  accentLight: '#F3E5AB',
  accentDark: '#B8860B',
  success: '#2E8B57',         // Forest Green
  successLight: '#E8F5E9',
  warning: '#F59E0B',         // Amber
  warningLight: '#FEF3C7',
  error: '#DC2626',           // Crimson
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#EFF6FF',
  background: '#FAFAF8',      // Off-White
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1E293B',            // Charcoal / Dark Slate
  textSecondary: '#64748B',   // Grey
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#CBD5E1',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.6)',
  goldGradient: ['#D4A843', '#F3E5AB'],
  navyGradient: ['#1B3A5C', '#10243B']
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B3A5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1B3A5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#D4A843',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  }
};

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
};
