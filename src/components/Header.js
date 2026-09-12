import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  rightBadgeCount = 0,
  rightComponent,
  voiceGuideTitle,
  onVoiceGuidePress,
  bottomComponent,
  farmerName,
  farmerId,
  style,
}) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20) + 6;

  return (
    <View style={[styles.headerContainer, { paddingTop: topPadding }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandingBox}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="grain" size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.appTitle}>ProcurePulse</Text>
              <Text style={styles.appState}>e-Uparjan 2.0 • MP</Text>
            </View>
          </View>
        )}

        <View style={styles.rightActions}>
          {onVoiceGuidePress && (
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={onVoiceGuidePress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="volume-high" size={16} color={COLORS.primaryDark} />
              <Text style={styles.voiceButtonText}>{voiceGuideTitle || 'सुनें'}</Text>
            </TouchableOpacity>
          )}

          {farmerName && (
            <View style={styles.farmerPill}>
              <MaterialCommunityIcons name="account-check" size={16} color={COLORS.accent} />
              <Text style={styles.farmerPillText} numberOfLines={1}>
                {farmerName.split(' ')[0]} ({farmerId ? farmerId.slice(-4) : '0001'})
              </Text>
            </View>
          )}

          {rightComponent}

          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name={rightIcon} size={22} color={COLORS.white} />
              {rightBadgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{rightBadgeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {title && (
        <View style={styles.titleSection}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      )}

      {bottomComponent && (
        <View style={styles.bottomSection}>
          {bottomComponent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  brandingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.4)',
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appState: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  voiceButtonText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  farmerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.3)',
  },
  farmerPillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.primaryDark,
    fontSize: 9,
    fontWeight: '800',
  },
  titleSection: {
    marginTop: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomSection: {
    marginTop: SPACING.md,
  },
});
