import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import Button from './Button';

export default function ExplainModal({ visible, onClose, centre }) {
  if (!centre) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleBox}>
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="robot-outline" size={18} color={COLORS.primaryDark} />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Recommendation Logic</Text>
                <Text style={styles.headerSubtitle}>Why Centre B is your optimal choice</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.scoreHero}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreVal}>{centre.score || 94}</Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
              <View style={styles.scoreTextCol}>
                <Text style={styles.scoreTitle}>Composite Efficiency Score</Text>
                <Text style={styles.scoreDesc}>
                  Calculated by minimizing transit cost + wait time + truck idling emissions.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>Decision Factors Comparison</Text>

            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color={COLORS.primary} />
                <Text style={styles.factorLabel}>Distance vs Centre A</Text>
                <Text style={styles.factorVal}>+3.2 km (8.4 km total)</Text>
              </View>
              <Text style={styles.factorNote}>
                Slightly further than Centre A (5.2 km), adding ~7 mins driving time.
              </Text>
            </View>

            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="clock-fast" size={20} color={COLORS.success} />
                <Text style={styles.factorLabel}>Queue Time Saved</Text>
                <Text style={[styles.factorVal, { color: COLORS.success }]}>-97 mins (41m vs 138m)</Text>
              </View>
              <Text style={styles.factorNote}>
                Centre A has a 138-minute unloading bottleneck. Centre B saves over 1.5 hours in line!
              </Text>
            </View>

            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="scale-bathroom" size={20} color={COLORS.info} />
                <Text style={styles.factorLabel}>Facility Infrastructure</Text>
                <Text style={styles.factorVal}>Dual Electronic Scales</Text>
              </View>
              <Text style={styles.factorNote}>
                High throughput with automated moisture analysis reduces rejection disputes.
              </Text>
            </View>

            <View style={styles.summaryCallout}>
              <MaterialCommunityIcons name="check-decagram" size={22} color={COLORS.accentDark} />
              <Text style={styles.summaryText}>
                <Text style={{ fontWeight: '700' }}>ProcurePulse Verdict: </Text>
                Choosing Centre B saves you ~90 minutes of total turnaround time and ₹120 in idling fuel.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Got It, Select This Centre"
              variant="gold"
              onPress={onClose}
              icon="thumb-up"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingTop: SPACING.md,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    padding: SPACING.lg,
  },
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accent,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.white,
  },
  scoreTextCol: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  scoreDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  factorCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginLeft: 6,
  },
  factorVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  factorNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    marginLeft: 26,
  },
  summaryCallout: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentLight + '44',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginVertical: SPACING.sm,
    gap: 10,
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 17,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
});
