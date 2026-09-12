import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' (mustard gold CTA) | 'forest' | 'secondary' | 'outline' | 'gold' | 'success' | 'danger' | 'ghost' | 'soft'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const getContainerStyle = () => {
    const base = [styles.button, styles[`size_${size}`]];
    if (fullWidth) base.push(styles.fullWidth);
    if (disabled) {
      base.push(styles.disabled);
      return base;
    }
    base.push(styles[`variant_${variant}`]);
    if (variant === 'primary' || variant === 'gold') base.push(SHADOWS.gold);
    else if (variant === 'forest' || variant === 'success') base.push(SHADOWS.sm);
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
    if (variant === 'primary' || variant === 'gold') return COLORS.text;
    if (variant === 'secondary' || variant === 'outline' || variant === 'ghost' || variant === 'soft') return COLORS.primary;
    if (variant === 'success' || variant === 'forest' || variant === 'danger') return COLORS.white;
    return COLORS.text;
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
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  // Mustard Gold Primary CTA
  variant_primary: {
    backgroundColor: COLORS.accent,
  },
  // Forest Green Structural Button
  variant_forest: {
    backgroundColor: COLORS.primary,
  },
  // Secondary White with Forest Green Border
  variant_secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  variant_gold: {
    backgroundColor: COLORS.accent,
  },
  // Confirmation / Success Green Button
  variant_success: {
    backgroundColor: COLORS.success,
  },
  // Soft Green Tint for auxiliary actions
  variant_soft: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: '#EAEFEA',
    borderColor: '#EAEFEA',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  text_size_sm: {
    fontSize: 13,
  },
  text_size_md: {
    fontSize: 15,
  },
  text_size_lg: {
    fontSize: 16,
  },
  text_primary: {
    color: COLORS.text,
  },
  text_forest: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.primary,
  },
  text_gold: {
    color: COLORS.text,
  },
  text_success: {
    color: COLORS.white,
  },
  text_soft: {
    color: COLORS.primary,
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
    color: COLORS.textMuted,
  },
});
