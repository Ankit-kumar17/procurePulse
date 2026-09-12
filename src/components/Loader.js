import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';

export default function Loader({ message = 'Loading procurement data...', fullScreen = true }) {
  const content = (
    <View style={styles.centerBox}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="grain" size={32} color={COLORS.accent} />
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subMessage}>ProcurePulse AI Engine</Text>
    </View>
  );

  if (!fullScreen) return content;

  return <View style={styles.fullScreen}>{content}</View>;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  spinner: {
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
