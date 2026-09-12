import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../utils/theme';

export default function Badge({
  label,
  variant = 'default', // 'success' | 'warning' | 'error' | 'info' | 'gold' | 'default'
  icon,
  size = 'md',        // 'sm' | 'md'
  style,
  textStyle,
}) {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return { bg: COLORS.successLight, text: COLORS.success, border: 'rgba(46,139,87,0.3)' };
      case 'warning':
        return { bg: COLORS.warningLight, text: COLORS.warning, border: 'rgba(245,158,11,0.3)' };
      case 'error':
        return { bg: COLORS.errorLight, text: COLORS.error, border: 'rgba(220,38,38,0.3)' };
      case 'info':
        return { bg: COLORS.infoLight, text: COLORS.info, border: 'rgba(37,99,235,0.3)' };
      case 'gold':
        return { bg: COLORS.accentLight, text: COLORS.accentDark, border: 'rgba(212,168,67,0.4)' };
      default:
        return { bg: '#F1F5F9', text: COLORS.textSecondary, border: COLORS.border };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badge_sm : styles.badge_md,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={size === 'sm' ? 12 : 14}
          color={colors.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.text_sm : styles.text_md,
          { color: colors.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badge_sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badge_md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 12,
  },
});
