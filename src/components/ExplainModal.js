import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../utils/theme';

export default function ExplainModal({ visible, onClose, centre }) {
  if (!centre) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleBox}>
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="star" size={20} color={COLORS.accentDark} />
              </View>
              <View>
                <Text style={styles.headerTitle}>बैरसिया केंद्र ही क्यों चुनें?</Text>
                <Text style={styles.headerSubtitle}>ई-उपार्जन स्मार्ट विश्लेषण</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Score Banner */}
            <View style={styles.scoreHero}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreVal}>94%</Text>
                <Text style={styles.scoreLabel}>रेटिंग</Text>
              </View>
              <View style={styles.scoreTextCol}>
                <Text style={styles.scoreTitle}>🏆 सर्वोत्तम सुविधा व न्यूनतम समय</Text>
                <Text style={styles.scoreDesc}>
                  दूरी, कतार और कांटा स्पीड को मिलाकर सबसे फायदेमंद केंद्र।
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>आपको क्या फायदा होगा?</Text>

            {/* Factor 1: Time saved */}
            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="clock-fast" size={22} color={COLORS.success} />
                <Text style={styles.factorLabel}>तौल का समय</Text>
                <Text style={[styles.factorVal, { color: COLORS.success }]}>1.5 घंटा बचेगा</Text>
              </View>
              <Text style={styles.factorNote}>
                कोलार मंडी में 2+ घंटे का जाम है, जबकि बैरसिया में केवल 41 मिनट में काम हो जाएगा।
              </Text>
            </View>

            {/* Factor 2: Fuel saved */}
            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="gas-station" size={22} color={COLORS.warning} />
                <Text style={styles.factorLabel}>डीजल की बचत</Text>
                <Text style={[styles.factorVal, { color: COLORS.warning }]}>₹120 की बचत</Text>
              </View>
              <Text style={styles.factorNote}>
                कतार में ट्रैक्टर चालू नहीं रखना पड़ेगा, जिससे ईंधन की सीधी बचत होगी।
              </Text>
            </View>

            {/* Factor 3: Dual Weighbridge */}
            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="scale-balance" size={22} color={COLORS.info} />
                <Text style={styles.factorLabel}>कांटा व्यवस्था</Text>
                <Text style={[styles.factorVal, { color: COLORS.info }]}>2 इलेक्ट्रॉनिक कांटे</Text>
              </View>
              <Text style={styles.factorNote}>
                स्वचालित नमी जांच लैब और डिजिटल पर्ची तुरंत मिल जाती है।
              </Text>
            </View>

            {/* Final Verdict */}
            <View style={styles.summaryCallout}>
              <MaterialCommunityIcons name="check-decagram" size={24} color={COLORS.accentDark} />
              <Text style={styles.summaryText}>
                <Text style={{ fontWeight: '900' }}>सलाह: </Text>
                बैरसिया केंद्र जाने पर आप समय पर घर वापस लौट पाएंगे!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.selectBtn} onPress={onClose} activeOpacity={0.88}>
              <MaterialCommunityIcons name="check" size={20} color={COLORS.white} />
              <Text style={styles.selectBtnText}>समझ गया, यही केंद्र चुनूंगा</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingBottom: SPACING.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: '#EAEFEA',
  },
  body: {
    padding: SPACING.md,
  },
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F8E4A0',
    marginBottom: SPACING.md,
  },
  scoreCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  scoreVal: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.accentDark,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  scoreTextCol: {
    flex: 1,
  },
  scoreTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.accentDark,
  },
  scoreDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeading: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  factorCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.sm,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    marginLeft: 6,
  },
  factorVal: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
  },
  factorNote: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  summaryCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F8E4A0',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  summaryText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accentDark,
    flex: 1,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  selectBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    color: COLORS.white,
  },
});
