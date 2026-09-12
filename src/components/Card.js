import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

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
                      variant === 'hero' ? 'rgba(255,255,255,0.15)' : (iconColor + '15'),
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
                      badgeColor ? (badgeColor + '22') : (variant === 'hero' ? 'rgba(212,168,67,0.25)' : COLORS.accentLight),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        badgeColor || (variant === 'hero' ? COLORS.accentLight : COLORS.accentDark),
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
  },
  variant_hero: {
    backgroundColor: COLORS.primaryDark,
    borderColor: '#245285',
    ...SHADOWS.md,
  },
  variant_success: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  variant_warning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  variant_error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  highlightCard: {
    borderColor: COLORS.success,
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
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  textHeroTitle: {
    color: COLORS.white,
  },
  textHeroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
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
