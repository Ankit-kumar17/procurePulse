import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  // Brand / Forest Green (Agriculture & Trusted Government Identity)
  primary: '#285943',         // Primary Forest Green (Main Header, Primary structural elements, selected borders)
  primaryDark: '#1D3F30',     // Dark Forest Green (Header depth, Status Bar, Bottom Nav, dark surfaces)
  primaryLight: '#3D785D',    // Medium Forest Green
  primarySoft: '#EAF2EE',     // Very soft forest green tint for selected card surfaces

  // Accent / Mustard Gold (High-value CTAs, Important Highlights & Recommendations)
  accent: '#D6A62C',          // Mustard Gold (Primary CTAs, Star icons, Active tab, Recommendations)
  accentLight: '#FFF5D8',     // Light Cream/Mustard surface
  accentDark: '#8A6814',      // Deep mustard text (high-contrast on light mustard)
  accentSoft: '#FAF7EE',      // Lightest cream tint

  // Semantic Status Colors (Restrained, clear, high-contrast)
  success: '#218C5A',         // Success Green (Distinct from Primary Forest Green: Confirmed, Received, Fast)
  successLight: '#EAF6EF',    // Success Background
  successDark: '#176541',
  
  warning: '#C58A13',         // Amber / Warning (Pending, Dispatched, Moderate Queue)
  warningLight: '#FFF5D8',    // Warning Background
  warningDark: '#875C09',
  
  error: '#C73A3A',           // Danger / Error (Issues, Delayed, Heavy Rush)
  errorLight: '#FCECEC',      // Danger Background
  errorDark: '#8B2121',
  
  info: '#3D7185',            // Semantic Info Teal-Blue (Informational hints, system advisories)
  infoLight: '#EDF5F7',       // Info Background
  infoDark: '#204654',

  // Surfaces & Backgrounds
  background: '#F7F5EE',      // Warm Cream (Main App / Page Background)
  surface: '#FFFFFF',         // Pure White (Cards, Forms, Modals)
  card: '#FFFFFF',
  cardAlt: '#F2EFE6',

  // Typography
  text: '#1F2A24',            // Dark Forest Charcoal / High Contrast Text (Outdoor readable)
  textSecondary: '#66736B',   // Muted Sage / Subtitles & Secondary info
  textMuted: '#94A39B',       // Light Neutral / Inactive captions
  textInverse: '#FFFFFF',     // Pure White text for dark headers & buttons

  // Borders & Dividers
  border: '#DDE3DC',          // Standard subtle card border
  borderLight: '#EDF1EE',
  borderFocus: '#285943',
  borderSuccess: '#218C5A',
  divider: '#E4EAE4',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(29, 63, 48, 0.65)',
};

export const TYPOGRAPHY = {
  // Display & Hero Headers
  display: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 26,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  
  // Body & Content
  body: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    lineHeight: 16,
  },

  // Numerical & Metrics
  metricLarge: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
  },
  metricHero: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 36,
  },

  // Legacy aliases
  h1: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
  },
  h2: {
    fontSize: 19,
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
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    lineHeight: 16,
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
  xl: 18,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#1D3F30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1D3F30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1D3F30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  gold: {
    shadowColor: '#D6A62C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
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
