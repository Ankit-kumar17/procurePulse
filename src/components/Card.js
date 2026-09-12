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
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        highlight && styles.highlightCard,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {(title || icon || badge || rightAction) && (
        <View style={[styles.headerRow, headerStyle]}>
          <View style={styles.headerLeft}>
            {icon && (
              <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
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
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  highlightCard: {
    borderColor: COLORS.success,
    borderWidth: 1.5,
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
