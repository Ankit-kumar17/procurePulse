import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { APP_CONFIG } from '../../utils/constants';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.85);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Background Decorative Rings */}
      <View style={styles.bgRing1} />
      <View style={styles.bgRing2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="grain" size={60} color={COLORS.accent} />
          <View style={styles.sparkleBadge}>
            <MaterialCommunityIcons name="shield-check" size={18} color={COLORS.primaryDark} />
          </View>
        </View>

        <Text style={styles.title}>ProcurePulse</Text>
        <Text style={styles.tagline}>Smart Procurement for Farmers</Text>

        <View style={styles.badgeContainer}>
          <Text style={styles.stateBadge}>MP e-Uparjan 2.0 • AI Powered</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerGovt}>Department of Food, Civil Supplies & Consumer Protection</Text>
        <Text style={styles.footerSub}>Government of Madhya Pradesh</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  bgRing1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 67, 0.12)',
    top: '15%',
  },
  bgRing2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 67, 0.06)',
    top: '7%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    ...SHADOWS.gold,
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.accentLight,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 67, 0.3)',
  },
  stateBadge: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerGovt: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    textAlign: 'center',
  },
  footerSub: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
