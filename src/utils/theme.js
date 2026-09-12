import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  // Brand / Navy
  primary: '#173B63',         // Primary Navy (Headers, Primary CTAs)
  primaryDark: '#0F2944',     // Deep Navy (Status Bar, Bottom Nav, Accent Cards)
  primaryLight: '#245285',    // Medium Navy
  primarySoft: '#EDF3F9',     // Very soft navy tint for selected surfaces

  // Accent / Wheat Gold
  accent: '#D4A843',          // Wheat Gold (Accents, Stars, Highlights)
  accentLight: '#F3E5AB',     // Soft wheat
  accentDark: '#9A731C',      // Deep gold
  accentSoft: '#FFFDF5',      // Lightest gold tint

  // Semantic Status Colors (Restrained, clear, high-contrast)
  success: '#15803D',         // Green (Confirmed, Received, Fast/Low Queue)
  successLight: '#DCFCE7',    // Light Green Badge Surface
  successDark: '#14532D',
  
  warning: '#B45309',         // Amber (Pending, Action Needed, Moderate Queue)
  warningLight: '#FEF3C7',    // Light Amber Badge Surface
  warningDark: '#78350F',
  
  error: '#B91C1C',           // Crimson (Issue, Failed, Heavy Rush/Congestion)
  errorLight: '#FEE2E2',      // Light Red Badge Surface
  errorDark: '#7F1D1D',
  
  info: '#1E40AF',            // Informational Blue
  infoLight: '#EFF6FF',
  infoDark: '#172554',

  // Surfaces & Backgrounds
  background: '#F7F9FC',      // Crisp, glare-free Off-White / Light Slate
  surface: '#FFFFFF',         // Pure White Cards
  card: '#FFFFFF',
  cardAlt: '#F8FAFC',

  // Typography
  text: '#172033',            // Dark Charcoal / High Contrast Text
  textSecondary: '#475569',   // Slate Grey / Subtitle
  textMuted: '#94A3B8',       // Light Slate / Captions
  textInverse: '#FFFFFF',     // White text on dark navy

  // Borders & Dividers
  border: '#DDE4EC',          // Standard subtle card border
  borderLight: '#EDF2F7',
  borderFocus: '#173B63',
  borderSuccess: '#15803D',
  divider: '#E2E8F0',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 41, 68, 0.65)',
};

export const TYPOGRAPHY = {
  // Display & Hero Headers
  h1: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 28,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
  },
  
  // Body & Content
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  
  // Subtitles & Captions
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  // Numerical & Metrics
  metricLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 28,
  },
  metricHero: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 36,
  },
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

export const LAYOUT = {
  minTouchTarget: 48,
  cardBorderWidth: 1,
  headerHeight: 56,
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
