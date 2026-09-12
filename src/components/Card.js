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
  goldBorder = false,
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        highlight && styles.highlightCard,
        goldBorder && styles.goldBorderCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {(title || icon || badge || rightAction) && (
        <View style={[styles.headerRow, headerStyle]}>
          <View style={styles.headerLeft}>
            {icon && (
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '18' }]}>
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
              </View>
            )}
            <View style={styles.titleWrapper}>
              {title && <Text style={styles.cardTitle}>{title}</Text>}
              {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
            </View>
          </View>

          <View style={styles.headerRight}>
            {badge && (
              <View style={[styles.badgePill, { backgroundColor: (badgeColor || COLORS.accent) + '22' }]}>
                <Text style={[styles.badgeText, { color: badgeColor || COLORS.accentDark }]}>
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
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  highlightCard: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  goldBorderCard: {
    borderColor: 'rgba(212,168,67,0.5)',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
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
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  contentContainer: {
    marginTop: 2,
  },
});
