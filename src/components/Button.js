import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'gold' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const getContainerStyle = () => {
    const base = [styles.button, styles[`size_${size}`]];
    if (disabled) {
      base.push(styles.disabled);
      return base;
    }
    base.push(styles[`variant_${variant}`]);
    if (variant === 'gold') base.push(SHADOWS.gold);
    else if (variant === 'primary') base.push(SHADOWS.sm);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`text_size_${size}`]];
    if (disabled) {
      base.push(styles.disabledText);
      return base;
    }
    base.push(styles[`text_${variant}`]);
    return base;
  };

  const getIconColor = () => {
    if (disabled) return COLORS.textMuted;
    if (variant === 'outline' || variant === 'ghost') return COLORS.primary;
    if (variant === 'gold') return COLORS.primaryDark;
    if (variant === 'secondary') return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {iconRight && (
            <MaterialCommunityIcons
              name={iconRight}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={getIconColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  variant_primary: {
    backgroundColor: COLORS.primary,
  },
  variant_secondary: {
    backgroundColor: COLORS.accentLight,
  },
  variant_gold: {
    backgroundColor: COLORS.accent,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  variant_danger: {
    backgroundColor: COLORS.error,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  text_size_sm: {
    fontSize: 13,
  },
  text_size_md: {
    fontSize: 15,
  },
  text_size_lg: {
    fontSize: 17,
  },
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.primaryDark,
  },
  text_gold: {
    color: COLORS.primaryDark,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.white,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  disabledText: {
    color: '#94A3B8',
  },
});
