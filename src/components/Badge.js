import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../utils/theme';

export default function Badge({
  label,
  variant = 'default', // 'success' | 'warning' | 'error' | 'info' | 'gold' | 'navy' | 'default'
  icon,
  size = 'md',        // 'sm' | 'md' | 'lg'
  onPress,
  style,
  textStyle,
}) {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return { bg: COLORS.successLight, text: COLORS.success, border: 'rgba(21,128,61,0.3)' };
      case 'warning':
        return { bg: COLORS.warningLight, text: COLORS.warning, border: 'rgba(180,83,9,0.3)' };
      case 'error':
        return { bg: COLORS.errorLight, text: COLORS.error, border: 'rgba(185,28,28,0.3)' };
      case 'info':
        return { bg: COLORS.infoLight, text: COLORS.info, border: 'rgba(30,64,175,0.3)' };
      case 'gold':
        return { bg: COLORS.accentLight, text: COLORS.accentDark, border: 'rgba(212,168,67,0.4)' };
      case 'navy':
        return { bg: COLORS.primaryDark, text: COLORS.white, border: COLORS.primary };
      default:
        return { bg: '#F1F5F9', text: COLORS.textSecondary, border: COLORS.border };
    }
  };

  const colors = getBadgeColors();
  const Container = onPress ? TouchableOpacity : View;

  const getIconSize = () => {
    if (size === 'sm') return 12;
    if (size === 'lg') return 18;
    return 14;
  };

  return (
    <Container
      style={[
        styles.badge,
        styles[`badge_${size}`],
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={getIconSize()}
          color={colors.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: colors.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Container>
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
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badge_md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badge_lg: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: 13,
  },
  text_lg: {
    fontSize: 15,
  },
});
