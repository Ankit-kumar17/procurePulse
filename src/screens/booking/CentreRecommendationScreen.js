import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import ExplainModal from '../../components/ExplainModal';
import { useFarmer } from '../../context/FarmerContext';

export default function CentreRecommendationScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity } = route.params || {};
  const { centres } = useFarmer();
  const insets = useSafeAreaInsets();

  const [selectedCentre, setSelectedCentre] = useState(null);
  const [explainModalVisible, setExplainModalVisible] = useState(false);
  const [modalCentre, setModalCentre] = useState(null);

  useEffect(() => {
    if (centres && centres.length > 0) {
      // Default select recommended centre
      const rec = centres.find((c) => c.recommended) || centres[0];
      setSelectedCentre(rec);
    }
  }, [centres]);

  const handleSelectCentre = (centre) => {
    setSelectedCentre(centre);
  };

  const handleProceed = () => {
    if (!selectedCentre) return;
    navigation.navigate('Calendar', {
      crop,
      variety,
      season,
      land,
      quantity,
      centre: selectedCentre,
    });
  };

  const handleOpenExplain = (centre) => {
    setModalCentre(centre);
    setExplainModalVisible(true);
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  // Helper for human explanation
  const getSimpleReason = (centre) => {
    if (centre.recommended) {
      return {
        text: 'थोड़ा दूर है, लेकिन यहां इंतजार बहुत कम है।',
        pill1: '🚜 +3.2 km',
        pill2: '⏰ 97 मिनट कम इंतजार',
        isPositive: true,
      };
    }
    if (centre.wait > 100) {
      return {
        text: '⚠️ पास है, लेकिन बहुत भारी भीड़ व लंबा इंतजार है।',
        pill1: '📍 5.2 km पास',
        pill2: '⏳ ~2.3 घंटे इंतजार',
        isPositive: false,
      };
    }
    return {
      text: '🟡 इंतजार कम है, लेकिन मंडी काफी दूर है।',
      pill1: '📍 11.8 km दूर',
      pill2: '⚡ 27 मिनट इंतजार',
      isPositive: null,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. COMPACT MOBILE HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel="पीछे जाएं"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>मंडी चुनें</Text>
            <Text style={styles.headerSubText}>चरण 2 / 4 • सबसे अच्छी मंडी</Text>
          </View>

          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="grain" size={16} color={COLORS.accent} />
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. STEPPER TRACKER ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <MaterialCommunityIcons name="check" size={12} color={COLORS.white} />
            </View>
            <Text style={styles.stepLabelDone}>फसल</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.primaryLight} />

          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>2</Text>
            </View>
            <Text style={styles.stepLabelActive}>मंडी</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.divider} />

          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>समय</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.divider} />

          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>4</Text>
            </View>
            <Text style={styles.stepLabel}>पक्का</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 115 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3. SIMPLE HUMAN ADVICE BANNER ─── */}
        <View style={styles.adviceBanner}>
          <View style={styles.adviceIconCircle}>
            <MaterialCommunityIcons name="star-face" size={22} color={COLORS.primaryDark} />
          </View>
          <View style={styles.adviceContent}>
            <View style={styles.adviceTagRow}>
              <Text style={styles.adviceTagText}>⭐ हमारी सलाह</Text>
            </View>
            <Text style={styles.adviceTitle}>
              बेरसिया केंद्र (Berasia Hub) में भीड़ कम है और आपकी तौल जल्दी होगी।
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>उपलब्ध उपार्जन केंद्र (Mandis)</Text>

        {/* ─── 4. MANDI CARDS ─── */}
        <View style={styles.cardsList}>
          {centres.map((centre) => {
            const isSelected = selectedCentre?.id === centre.id;
            const simpleReason = getSimpleReason(centre);

            // Wait time color indicator
            const isHighWait = centre.wait > 100;
            const waitColor = isHighWait ? COLORS.error : COLORS.success;
            const waitBg = isHighWait ? '#FEE2E2' : '#DCFCE7';

            return (
              <TouchableOpacity
                key={centre.id}
                style={[
                  styles.centreCard,
                  isSelected && styles.centreCardSelected,
                  centre.recommended && !isSelected && styles.centreCardRecommended,
                ]}
                onPress={() => handleSelectCentre(centre)}
                activeOpacity={0.88}
              >
                {/* Top Row: Name + Badges */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardTitleBox}>
                    <Text style={[styles.mandiName, isSelected && styles.mandiNameSelected]}>
                      🏪 {centre.name.split('(')[0].trim()}
                    </Text>
                    <Text style={styles.mandiAddress} numberOfLines={1}>
                      📍 {centre.address}
                    </Text>
                  </View>

                  {centre.recommended && (
                    <View style={styles.recommendedBadge}>
                      <MaterialCommunityIcons name="star" size={13} color={COLORS.primaryDark} />
                      <Text style={styles.recommendedBadgeText}>हमारी सलाह</Text>
                    </View>
                  )}
                </View>

                {/* 3 Metrics: Distance | Wait | Slots */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricBox}>
                    <View style={styles.metricTop}>
                      <MaterialCommunityIcons name="map-marker-distance" size={16} color={COLORS.primary} />
                      <Text style={styles.metricValue}>{centre.distance} km</Text>
                    </View>
                    <Text style={styles.metricSub}>दूरी</Text>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={[styles.metricBox, { backgroundColor: waitBg, borderRadius: 8 }]}>
                    <View style={styles.metricTop}>
                      <MaterialCommunityIcons name="clock-outline" size={16} color={waitColor} />
                      <Text style={[styles.metricValue, { color: waitColor }]}>
                        {centre.wait} min
                      </Text>
                    </View>
                    <Text style={[styles.metricSub, { color: waitColor, fontWeight: '700' }]}>
                      इंतजार
                    </Text>
                  </View>

                  <View style={styles.metricDivider} />

                  <View style={styles.metricBox}>
                    <View style={styles.metricTop}>
                      <MaterialCommunityIcons name="calendar-check" size={16} color={COLORS.info} />
                      <Text style={styles.metricValue}>{centre.availableSlots}</Text>
                    </View>
                    <Text style={styles.metricSub}>आज के स्लॉट</Text>
                  </View>
                </View>

                {/* Simple Human Reason Strip */}
                <View style={[
                  styles.reasonStrip,
                  centre.recommended && styles.reasonStripRecommended,
                  isHighWait && styles.reasonStripWarning,
                ]}>
                  <Text style={[
                    styles.reasonMainText,
                    centre.recommended && styles.reasonMainTextRecommended,
                    isHighWait && styles.reasonMainTextWarning,
                  ]}>
                    {simpleReason.text}
                  </Text>

                  {simpleReason.pill1 && (
                    <View style={styles.pillsRow}>
                      <View style={styles.reasonPill}>
                        <Text style={styles.reasonPillText}>{simpleReason.pill1}</Text>
                      </View>
                      <View style={styles.reasonPill}>
                        <Text style={styles.reasonPillText}>{simpleReason.pill2}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Bottom Action / Why Button Row */}
                <View style={styles.cardFooter}>
                  {centre.recommended ? (
                    <TouchableOpacity
                      style={styles.whyButton}
                      onPress={() => handleOpenExplain(centre)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="information-outline" size={15} color={COLORS.primary} />
                      <Text style={styles.whyButtonText}>ⓘ यह क्यों सुझाई?</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}

                  <View style={[
                    styles.selectPill,
                    isSelected ? styles.selectPillActive : styles.selectPillInactive
                  ]}>
                    <MaterialCommunityIcons
                      name={isSelected ? "check-circle" : "radiobox-blank"}
                      size={15}
                      color={isSelected ? COLORS.white : COLORS.textSecondary}
                    />
                    <Text style={[
                      styles.selectPillText,
                      isSelected && styles.selectPillTextActive
                    ]}>
                      {isSelected ? 'यही मंडी चुनी गई' : 'यह मंडी चुनें'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 5. STICKY BOTTOM ACTION BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {selectedCentre && (
          <View style={styles.selectedMandiStrip}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.selectedMandiStripText} numberOfLines={1}>
              <Text style={{ fontWeight: '800', color: COLORS.primaryDark }}>
                {selectedCentre.name.split('(')[0].trim()}
              </Text>
              {' '}चुनी गई
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleProceed}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaButtonText}>आगे: तारीख चुनें →</Text>
        </TouchableOpacity>
      </View>

      {/* ─── EXPLAINABILITY MODAL ─── */}
      <ExplainModal
        visible={explainModalVisible}
        centre={modalCentre}
        onClose={() => setExplainModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* ─── 1. HEADER ─── */
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...SHADOWS.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.3)',
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentLight,
  },

  /* ─── 2. STEPPER ─── */
  stepperBar: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: COLORS.success,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stepDotTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepLabelDone: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  stepLabelActive: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
  },

  /* ─── 3. ADVICE BANNER ─── */
  adviceBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF9C3',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDE047',
    marginBottom: SPACING.md,
    gap: 10,
    ...SHADOWS.sm,
  },
  adviceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  adviceTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#854D0E',
  },
  adviceTitle: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
    lineHeight: 18,
  },

  /* ─── SECTION HEADING ─── */
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 10,
  },

  /* ─── 4. CARDS LIST ─── */
  cardsList: {
    gap: 12,
  },
  centreCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  centreCardRecommended: {
    borderColor: '#FDE047',
  },
  centreCardSelected: {
    borderColor: COLORS.accentDark,
    backgroundColor: '#FFFDF5',
    ...SHADOWS.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitleBox: {
    flex: 1,
  },
  mandiName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 22,
  },
  mandiNameSelected: {
    color: COLORS.primaryDark,
  },
  mandiAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },

  /* ─── METRICS ─── */
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },

  /* ─── REASON STRIP ─── */
  reasonStrip: {
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.sm,
    padding: 8,
    marginBottom: 10,
  },
  reasonStripRecommended: {
    backgroundColor: '#FEF9C3',
  },
  reasonStripWarning: {
    backgroundColor: '#FEE2E2',
  },
  reasonMainText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  reasonMainTextRecommended: {
    color: '#854D0E',
  },
  reasonMainTextWarning: {
    color: COLORS.error,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  reasonPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  reasonPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },

  /* ─── FOOTER ─── */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  whyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  whyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  selectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  selectPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.sm,
  },
  selectPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: COLORS.border,
  },
  selectPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  selectPillTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },

  /* ─── 5. STICKY BOTTOM ACTION BAR ─── */
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingTop: 8,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  selectedMandiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 6,
  },
  selectedMandiStripText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  ctaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    ...SHADOWS.md,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
