import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  // Brand / Navy
  primary: '#173B63',         // Primary Navy
  primaryDark: '#0F2944',     // Deep Navy
  primaryLight: '#245285',    // Medium Navy

  // Accent / Gold
  accent: '#D4A843',          // Wheat Gold
  accentLight: '#F3E5AB',
  accentDark: '#B8860B',

  // Semantic Status Colors
  success: '#168A4A',         // Forest Green
  successLight: '#EAF7EF',
  warning: '#B77900',         // Warm Amber
  warningLight: '#FFF6D8',
  error: '#C62828',           // Crimson Danger
  errorLight: '#FDECEC',
  info: '#1E40AF',
  infoLight: '#EFF6FF',

  // Surfaces & Backgrounds
  background: '#F7F9FC',      // Crisp Off-White/Light Slate
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Typography
  text: '#172033',            // Dark Charcoal / High Contrast
  textSecondary: '#5F6B7A',   // Slate Grey
  textMuted: '#94A3B8',       // Light Slate

  // Borders & Dividers
  border: '#DDE4EC',
  borderLight: '#EDF2F7',
  divider: '#E2E8F0',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 41, 68, 0.65)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F2944',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F2944',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F2944',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  gold: {
    shadowColor: '#D4A843',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
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
