import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../utils/theme';

export default function InfoRow({
  icon,
  iconColor = COLORS.primary,
  label,
  value,
  badge,
  badgeVariant = 'default',
  highlight = false,
  showDivider = true,
  onPress,
  style,
  valueStyle,
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.row,
        showDivider && styles.divider,
        highlight && styles.highlightRow,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.leftCol}>
        {icon && (
          <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
            <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
          </View>
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.rightCol}>
        {value !== undefined && value !== null && (
          <Text
            style={[
              styles.value,
              highlight && styles.highlightValue,
              valueStyle,
            ]}
          >
            {value}
          </Text>
        )}
        {badge && (
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {onPress && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={COLORS.textMuted}
            style={styles.chevron}
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    minHeight: 38,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  highlightRow: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'right',
  },
  highlightValue: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  badgeBox: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  chevron: {
    marginLeft: 4,
  },
});
