import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../utils/theme';

export default function Card({
  title,
  subtitle,
  icon,
  iconColor = COLORS.primary,
  badge,
  badgeColor,
  rightAction,
  onPress,
  children,
  style,
  headerStyle,
  highlight = false,
  selected = false,
  variant = 'default', // 'default' | 'hero' | 'success' | 'warning' | 'error'
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        styles[`variant_${variant}`],
        highlight && styles.highlightCard,
        selected && styles.selectedCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {(title || icon || badge || rightAction) && (
        <View style={[styles.headerRow, headerStyle]}>
          <View style={styles.headerLeft}>
            {icon && (
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      variant === 'hero' ? 'rgba(255,255,255,0.15)' : (iconColor + '18'),
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={20}
                  color={variant === 'hero' ? COLORS.accent : iconColor}
                />
              </View>
            )}
            <View style={styles.titleWrapper}>
              {title && (
                <Text
                  style={[
                    styles.cardTitle,
                    variant === 'hero' && styles.textHeroTitle,
                  ]}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text
                  style={[
                    styles.cardSubtitle,
                    variant === 'hero' && styles.textHeroSubtitle,
                  ]}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.headerRight}>
            {badge && (
              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor:
                      badgeColor ? (badgeColor + '22') : (variant === 'hero' ? 'rgba(214,166,44,0.25)' : COLORS.accentLight),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        badgeColor || (variant === 'hero' ? COLORS.accent : COLORS.accentDark),
                    },
                  ]}
                >
                  {badge}
                </Text>
              </View>
            )}
            {rightAction}
          </View>
        </View>
      )}

      {children && <View style={styles.contentContainer}>{children}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  variant_default: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  variant_hero: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  variant_success: {
    backgroundColor: COLORS.successLight,
    borderColor: '#C0E2CD',
  },
  variant_warning: {
    backgroundColor: COLORS.warningLight,
    borderColor: '#F8E4A0',
  },
  variant_error: {
    backgroundColor: COLORS.errorLight,
    borderColor: '#F7C7C7',
  },
  highlightCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primarySoft,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
  },
  cardTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.text,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  textHeroTitle: {
    color: COLORS.white,
  },
  textHeroSubtitle: {
    color: 'rgba(255,255,255,0.80)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  contentContainer: {
    marginTop: 2,
  },
});
