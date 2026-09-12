import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

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
                <MaterialCommunityIcons name="star" size={20} color="#854D0E" />
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
                <MaterialCommunityIcons name="clock-fast" size={22} color="#15803D" />
                <Text style={styles.factorLabel}>तौल का समय</Text>
                <Text style={[styles.factorVal, { color: '#15803D' }]}>1.5 घंटा बचेगा</Text>
              </View>
              <Text style={styles.factorNote}>
                कोलार मंडी में 2+ घंटे का जाम है, जबकि बैरसिया में केवल 41 मिनट में काम हो जाएगा।
              </Text>
            </View>

            {/* Factor 2: Fuel saved */}
            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="gas-station" size={22} color="#D97706" />
                <Text style={styles.factorLabel}>डीजल की बचत</Text>
                <Text style={[styles.factorVal, { color: '#D97706' }]}>₹120 की बचत</Text>
              </View>
              <Text style={styles.factorNote}>
                कतार में ट्रैक्टर चालू नहीं रखना पड़ेगा, जिससे ईंधन की सीधी बचत होगी।
              </Text>
            </View>

            {/* Factor 3: Dual Weighbridge */}
            <View style={styles.factorCard}>
              <View style={styles.factorRow}>
                <MaterialCommunityIcons name="scale-balance" size={22} color="#2563EB" />
                <Text style={styles.factorLabel}>कांटा व्यवस्था</Text>
                <Text style={[styles.factorVal, { color: '#2563EB' }]}>2 इलेक्ट्रॉनिक कांटे</Text>
              </View>
              <Text style={styles.factorNote}>
                स्वचालित नमी जांच लैब और डिजिटल पर्ची तुरंत मिल जाती है।
              </Text>
            </View>

            {/* Final Verdict */}
            <View style={styles.summaryCallout}>
              <MaterialCommunityIcons name="check-decagram" size={24} color="#854D0E" />
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
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
    borderBottomColor: '#E2E8F0',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
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
    backgroundColor: '#F8FAFC',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.accent,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
  },
  scoreTextCol: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 13,
    fontWeight: '900',
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
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  factorCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 8,
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
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    marginLeft: 6,
  },
  factorVal: {
    fontSize: 13,
    fontWeight: '900',
  },
  factorNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginLeft: 28,
  },
  summaryCallout: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: SPACING.sm,
    gap: 10,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#854D0E',
    flex: 1,
    lineHeight: 17,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.md,
  },
  selectBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
});
