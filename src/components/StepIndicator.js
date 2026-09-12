import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function StepIndicator({
  steps = [],
  currentStep = 1, // 1-indexed
  totalSteps = 4,
  style,
}) {
  const defaultLabels = ['फसल', 'मंडी', 'तारीख', 'समय'];
  const stepCount = steps.length > 0 ? steps.length : totalSteps;
  const labels = steps.length > 0 ? steps : defaultLabels.slice(0, stepCount);

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: stepCount }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const label = labels[index];

        return (
          <React.Fragment key={index}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                ]}
              >
                {isCompleted ? (
                  <MaterialCommunityIcons name="check" size={14} color={COLORS.white} />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isActive && styles.circleTextActive,
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
              {label && (
                <Text
                  style={[
                    styles.label,
                    isActive && styles.labelActive,
                    isCompleted && styles.labelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              )}
            </View>

            {index < stepCount - 1 && (
              <View
                style={[
                  styles.connector,
                  stepNum < currentStep && styles.connectorCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 46,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAEFEA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DDE3DC',
  },
  circleCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  circleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  circleText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  circleTextActive: {
    color: COLORS.white,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  labelCompleted: {
    color: COLORS.success,
    fontWeight: '700',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#EAEFEA',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  connectorCompleted: {
    backgroundColor: COLORS.success,
  },
});
