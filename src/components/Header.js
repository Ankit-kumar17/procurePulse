import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import ProfileModal from './ProfileModal';

export default function Header({
  isHome = false,
  title,
  subtitle,
  showBack = false,
  onBackPress,
  onBack, // alias
  rightIcon,
  onRightPress,
  rightComponent,
  rightElement, // alias
  onVoiceGuidePress,
  farmerName,
  farmerId,
  farmer,
  onLogout,
  bottomComponent,
  style,
}) {
  const insets = useSafeAreaInsets();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 4;

  const handleBack = onBackPress || onBack;
  const rightNode = rightElement || rightComponent;
  const displayName = farmerName ? farmerName.split(' ')[0] : 'किसान';

  return (
    <View style={[styles.headerContainer, { paddingTop: topPadding }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {isHome ? (
        /* ══════════════════════════════════════════════════════════════
           1. HOME SCREEN MOBILE HEADER
           ══════════════════════════════════════════════════════════════ */
        <View style={styles.homeHeaderContent}>
          {/* Row 1: Compact Branding on Left, Minimal Actions on Right */}
          <View style={styles.topRow}>
            {/* Left: Compact Logo + ProcurePulse */}
            <View style={styles.brandingBox}>
              <View style={styles.logoBadge}>
                <MaterialCommunityIcons name="grain" size={18} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.appTitle}>ProcurePulse</Text>
                <Text style={styles.appState}>e-Uparjan 2.0 • MP</Text>
              </View>
            </View>

            {/* Right: [🔊] Listen Button + [👤 Name] Profile Button */}
            <View style={styles.rightActionsGroup}>
              {onVoiceGuidePress && (
                <TouchableOpacity
                  style={styles.compactVoiceBtn}
                  onPress={onVoiceGuidePress}
                  activeOpacity={0.75}
                  accessibilityLabel="बोलकर सुनें"
                >
                  <MaterialCommunityIcons name="volume-high" size={18} color={COLORS.text} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.compactProfileBtn}
                onPress={() => setProfileModalVisible(true)}
                activeOpacity={0.75}
                accessibilityLabel="प्रोफाइल व सेटिंग्स"
              >
                <MaterialCommunityIcons name="account-circle" size={18} color={COLORS.accent} />
                <Text style={styles.compactProfileText} numberOfLines={1}>
                  {displayName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Prominent Clean Greeting + Season Subtitle */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>
              {title || `नमस्ते, ${displayName} जी 🙏`}
            </Text>
            <Text style={styles.greetingSeason}>
              {subtitle || 'रबी सीजन 2026–27'}
            </Text>
          </View>

          {bottomComponent && (
            <View style={styles.bottomSection}>
              {bottomComponent}
            </View>
          )}
        </View>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           2. INNER PAGE COMPACT HEADER
           ══════════════════════════════════════════════════════════════ */
        <View style={styles.innerHeaderContent}>
          <View style={styles.innerRow}>
            {/* Left: Back Button + Title & Subtitle */}
            <View style={styles.innerLeftGroup}>
              {showBack && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  activeOpacity={0.7}
                  accessibilityLabel="पीछे जाएं"
                >
                  <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
              )}

              <View style={styles.innerTitleBox}>
                <Text style={styles.innerTitle} numberOfLines={1}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={styles.innerSubtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Right: Compact Voice or Action button */}
            <View style={styles.innerRightGroup}>
              {onVoiceGuidePress && (
                <TouchableOpacity
                  style={styles.compactVoiceBtn}
                  onPress={onVoiceGuidePress}
                  activeOpacity={0.75}
                  accessibilityLabel="बोलकर सुनें"
                >
                  <MaterialCommunityIcons name="volume-high" size={18} color={COLORS.text} />
                </TouchableOpacity>
              )}

              {rightNode}

              {rightIcon && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onRightPress}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={rightIcon} size={20} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {bottomComponent && (
            <View style={styles.bottomSection}>
              {bottomComponent}
            </View>
          )}
        </View>
      )}

      {/* Profile & Account Sheet Modal */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        farmer={farmer || { name: farmerName, farmerId }}
        onLogout={onLogout}
      />
    </View>
  );
}

export { Header as FarmerHeader };

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOWS.md,
  },

  /* ─── HOME HEADER STYLES ─── */
  homeHeaderContent: {
    paddingTop: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  brandingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214,166,44,0.35)',
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appState: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '600',
    marginTop: -1,
  },
  rightActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactVoiceBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  compactProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(214,166,44,0.3)',
    minHeight: 34,
  },
  compactProfileText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 90,
  },
  greetingSection: {
    marginTop: SPACING.sm + 2,
    marginBottom: 2,
  },
  greetingTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  greetingSeason: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },

  /* ─── INNER HEADER STYLES ─── */
  innerHeaderContent: {
    paddingVertical: 2,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  innerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerTitleBox: {
    flex: 1,
  },
  innerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  innerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  innerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    marginTop: SPACING.sm,
  },
});
