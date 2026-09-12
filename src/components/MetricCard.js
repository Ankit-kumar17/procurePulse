import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../utils/theme';

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  iconColor,
  status = 'default', // 'default' | 'success' | 'warning' | 'error' | 'primary' | 'gold'
  variant = 'card',   // 'card' | 'compact' | 'hero'
  onPress,
  style,
}) {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return { text: COLORS.success, bg: COLORS.successLight, border: '#BBF7D0' };
      case 'warning':
        return { text: COLORS.warning, bg: COLORS.warningLight, border: '#FDE68A' };
      case 'error':
        return { text: COLORS.error, bg: COLORS.errorLight, border: '#FECACA' };
      case 'primary':
        return { text: COLORS.primary, bg: COLORS.primarySoft, border: '#C2D6EC' };
      case 'gold':
        return { text: COLORS.accentDark, bg: COLORS.accentLight, border: 'rgba(212,168,67,0.4)' };
      default:
        return { text: COLORS.text, bg: '#F8FAFC', border: COLORS.border };
    }
  };

  const colors = getStatusColors();
  const Container = onPress ? TouchableOpacity : View;

  if (variant === 'compact') {
    return (
      <Container
        style={[
          styles.compactContainer,
          { backgroundColor: colors.bg, borderColor: colors.border },
          style,
        ]}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={iconColor || colors.text}
            style={styles.compactIcon}
          />
        )}
        <View>
          <Text style={styles.compactLabel}>{label}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.compactValue, { color: colors.text }]}>{value}</Text>
            {unit && <Text style={styles.unitText}> {unit}</Text>}
          </View>
        </View>
      </Container>
    );
  }

  if (variant === 'hero') {
    return (
      <Container
        style={[styles.heroContainer, style]}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={styles.heroHeader}>
          {icon && (
            <View style={styles.heroIconBox}>
              <MaterialCommunityIcons name={icon} size={22} color={COLORS.accent} />
            </View>
          )}
          <Text style={styles.heroLabel}>{label}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.heroValue}>{value}</Text>
          {unit && <Text style={styles.heroUnit}> {unit}</Text>}
        </View>
      </Container>
    );
  }

  return (
    <Container
      style={[
        styles.cardContainer,
        { borderTopColor: colors.text },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.topRow}>
        <Text style={styles.cardLabel}>{label}</Text>
        {icon && (
          <View style={[styles.cardIconBox, { backgroundColor: colors.bg }]}>
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={iconColor || colors.text}
            />
          </View>
        )}
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>
        {unit && <Text style={styles.unitText}> {unit}</Text>}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    ...SHADOWS.sm,
    flex: 1,
    minWidth: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValue: {
    ...TYPOGRAPHY.metricLarge,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 8,
  },
  compactIcon: {
    marginRight: 2,
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  compactValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  heroContainer: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#245285',
    ...SHADOWS.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
  },
  heroUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accentLight,
  },
});
