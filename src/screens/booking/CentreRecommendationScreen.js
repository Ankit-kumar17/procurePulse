import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
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

  const handlePlayVoiceGuide = () => {
    Alert.alert(
      '🔊 मंडी सहायक (Voice Guide)',
      'नमस्ते किसान भाई!\n\n• बैरसिया उपार्जन केंद्र आपके लिए सबसे अच्छा है क्योंकि वहां केवल 41 मिनट में तौल हो जाएगी।\n• कोलार मंडी पास है लेकिन वहां 2 घंटे से ज्यादा का लंबा जाम है।\n• बैरसिया जाने से आपका लगभग 1.5 घंटा और डीजल बचेगा!',
      [{ text: 'समझ गया (OK)' }]
    );
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  // Helper for rich Hindi Mandi info
  const getHindiMandiDetails = (centre) => {
    if (centre.name.includes('Berasia') || centre.recommended) {
      return {
        rank: '🏆 नंबर 1 पसंद',
        hindiName: 'बैरसिया उपार्जन केंद्र',
        location: 'NH-46 जंक्शन • 8.4 km',
        speedTag: '⚡ 1.5 घंटे बचेंगे (सुपरफास्ट तौल)',
        crowdBadge: '🟢 बहुत कम भीड़ (तौल ~41 मिनट में)',
        crowdBg: '#DCFCE7',
        crowdColor: '#15803D',
        isBest: true,
      };
    }
    if (centre.name.includes('Kolar') || centre.wait > 100) {
      return {
        rank: '📍 सबसे पास',
        hindiName: 'कोलार कृषि उपज मंडी',
        location: 'भोपाल • 5.2 km',
        speedTag: '⚠️ पास है लेकिन 2+ घंटे का जाम है',
        crowdBadge: '🔴 भारी भीड़ (~2.3 घंटे लंबा इंतजार)',
        crowdBg: '#FEE2E2',
        crowdColor: '#B91C1C',
        isBest: false,
      };
    }
    return {
      rank: '🛣️ वैकल्पिक केंद्र',
      hindiName: 'सूखी सेवनिया उपार्जन केंद्र',
      location: 'वेयरहाउस रोड • 11.8 km',
      speedTag: '🛣️ दूरी अधिक है लेकिन कांटा खाली है',
      crowdBadge: '🟡 कम भीड़ (~27 मिनट इंतजार)',
      crowdBg: '#FEF3C7',
      crowdColor: '#92400E',
      isBest: false,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. TOP HEADER WITH VOICE BUTTON ─── */}
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

          {/* Voice Assistant Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handlePlayVoiceGuide}
            activeOpacity={0.8}
            accessibilityLabel="आवाज से समझें"
          >
            <MaterialCommunityIcons name="volume-high" size={17} color={COLORS.primaryDark} />
            <Text style={styles.voiceButtonText}>सुनें</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── 2. STEPPER PROGRESS ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <MaterialCommunityIcons name="check" size={12} color={COLORS.white} />
            </View>
            <Text style={styles.stepLabelDone}>फसल</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.primary} />

          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>2</Text>
            </View>
            <Text style={styles.stepLabelActive}>मंडी</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color="#CBD5E1" />

          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>समय</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color="#CBD5E1" />

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
        {/* ─── 3. INTERACTIVE AI ADVICE CARD ─── */}
        <View style={styles.adviceBanner}>
          <View style={styles.adviceIconCircle}>
            <MaterialCommunityIcons name="lightning-bolt" size={22} color="#854D0E" />
          </View>
          <View style={styles.adviceContent}>
            <View style={styles.adviceTagRow}>
              <Text style={styles.adviceTag}>💡 स्मार्ट सलाह (AI Recommendation)</Text>
            </View>
            <Text style={styles.adviceTitle}>
              बैरसिया केंद्र चुनें — 1.5 घंटा बचेगा और तौल तुरंत होगी!
            </Text>
          </View>
        </View>

        {/* ─── 4. LIST OF MANDIS ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>उपलब्ध उपार्जन केंद्र ({centres.length})</Text>
          <Text style={styles.sectionTipText}>👆 पसंद की मंडी पर टैप करें</Text>
        </View>

        <View style={styles.cardsList}>
          {centres.map((centre) => {
            const isSelected = selectedCentre?.id === centre.id;
            const details = getHindiMandiDetails(centre);

            return (
              <TouchableOpacity
                key={centre.id}
                style={[
                  styles.mandiCard,
                  isSelected ? styles.mandiCardSelected : styles.mandiCardUnselected,
                  details.isBest && !isSelected && styles.mandiCardBestBorder,
                ]}
                onPress={() => handleSelectCentre(centre)}
                activeOpacity={0.88}
              >
                {/* Header Row: Rank Badge & Name */}
                <View style={styles.cardTopRow}>
                  <View style={styles.mandiTitleContainer}>
                    <View style={styles.nameWithRankRow}>
                      <Text style={[styles.mandiHindiName, isSelected && styles.mandiHindiNameSelected]}>
                        🏪 {details.hindiName}
                      </Text>
                    </View>
                    <Text style={styles.mandiSubLocation}>
                      📍 {details.location}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.rankBadge,
                      details.isBest ? styles.rankBadgeBest : styles.rankBadgeNormal,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankBadgeText,
                        details.isBest ? styles.rankBadgeTextBest : styles.rankBadgeTextNormal,
                      ]}
                    >
                      {details.rank}
                    </Text>
                  </View>
                </View>

                {/* Speed / Saving Highlight Tag */}
                <View style={[styles.speedTagBox, { backgroundColor: details.crowdBg }]}>
                  <Text style={[styles.speedTagText, { color: details.crowdColor }]}>
                    {details.speedTag}
                  </Text>
                </View>

                {/* Live Crowd & Wait Time Meter */}
                <View style={styles.meterContainer}>
                  <View style={styles.meterRow}>
                    <MaterialCommunityIcons
                      name={details.isBest ? 'clock-check-outline' : 'clock-alert-outline'}
                      size={16}
                      color={details.crowdColor}
                    />
                    <Text style={[styles.meterLabel, { color: details.crowdColor }]}>
                      {details.crowdBadge}
                    </Text>
                  </View>
                </View>

                {/* Distance & Slots Quick Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="map-marker-distance" size={15} color={COLORS.textSecondary} />
                    <Text style={styles.statLabel}>दूरी:</Text>
                    <Text style={styles.statValue}>{centre.distance} km</Text>
                  </View>

                  <View style={styles.statDot} />

                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="calendar-check" size={15} color={COLORS.primary} />
                    <Text style={styles.statLabel}>खाली स्लॉट:</Text>
                    <Text style={[styles.statValue, { color: COLORS.primary }]}>
                      {centre.availableSlots} टोकन
                    </Text>
                  </View>
                </View>

                {/* Card Bottom: Selection Pill & Why Explanation */}
                <View style={styles.cardBottomBar}>
                  {details.isBest ? (
                    <TouchableOpacity
                      style={styles.whyLink}
                      onPress={() => handleOpenExplain(centre)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="information" size={15} color={COLORS.primary} />
                      <Text style={styles.whyLinkText}>यह क्यों सुझाई?</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}

                  <View style={[styles.selectBadge, isSelected ? styles.selectBadgeActive : styles.selectBadgeInactive]}>
                    <MaterialCommunityIcons
                      name={isSelected ? 'check-circle' : 'circle-outline'}
                      size={16}
                      color={isSelected ? COLORS.white : COLORS.textSecondary}
                    />
                    <Text style={[styles.selectBadgeText, isSelected && styles.selectBadgeTextActive]}>
                      {isSelected ? 'यह मंडी चुनी गई' : 'चुनने के लिए दबाएं'}
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
            <MaterialCommunityIcons name="check-circle" size={16} color="#15803D" />
            <Text style={styles.selectedMandiStripText} numberOfLines={1}>
              <Text style={{ fontWeight: '900', color: COLORS.primaryDark }}>
                {getHindiMandiDetails(selectedCentre).hindiName}
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
          <Text style={styles.ctaButtonText}>आगे: तारीख व समय चुनें →</Text>
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  headerTitleText: {
    fontSize: 20,
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
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  voiceButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },

  /* ─── 2. STEPPER ─── */
  stepperBar: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    backgroundColor: '#15803D',
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
    color: '#15803D',
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
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDE047',
    marginBottom: 14,
    gap: 10,
    ...SHADOWS.sm,
  },
  adviceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceContent: {
    flex: 1,
  },
  adviceTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  adviceTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#854D0E',
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#713F12',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionTipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  /* ─── 4. MANDI CARDS ─── */
  cardsList: {
    gap: 12,
  },
  mandiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  mandiCardUnselected: {
    borderColor: '#E2E8F0',
  },
  mandiCardSelected: {
    borderColor: '#15803D',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    ...SHADOWS.md,
  },
  mandiCardBestBorder: {
    borderColor: '#FDE047',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mandiTitleContainer: {
    flex: 1,
    paddingRight: 6,
  },
  nameWithRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mandiHindiName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  mandiHindiNameSelected: {
    color: '#15803D',
  },
  mandiSubLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rankBadgeBest: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rankBadgeNormal: {
    backgroundColor: '#F1F5F9',
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  rankBadgeTextBest: {
    color: '#854D0E',
  },
  rankBadgeTextNormal: {
    color: COLORS.textSecondary,
  },

  /* Speed Tag */
  speedTagBox: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    marginBottom: 8,
  },
  speedTagText: {
    fontSize: 12,
    fontWeight: '800',
  },

  /* Meter Row */
  meterContainer: {
    marginBottom: 6,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  meterLabel: {
    fontSize: 12,
    fontWeight: '800',
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },

  /* Card Bottom Bar */
  cardBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  whyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  whyLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  selectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  selectBadgeActive: {
    backgroundColor: '#15803D',
  },
  selectBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  selectBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  selectBadgeTextActive: {
    color: COLORS.white,
    fontWeight: '900',
  },

  /* ─── 5. STICKY BOTTOM BAR ─── */
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...SHADOWS.lg,
  },
  selectedMandiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 8,
  },
  selectedMandiStripText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
});
