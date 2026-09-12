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
  ) + 6;

  // Clean Hindi metadata helper
  const getMandiDetails = (centre) => {
    if (centre.name.includes('Berasia') || centre.recommended) {
      return {
        hindiName: 'बेरसिया उपार्जन केंद्र',
        location: 'NH-46 जंक्शन · 8.4 km',
        waitBadge: '🟢 कम भीड़ • लगभग 41 मिनट इंतजार',
        waitBg: '#DCFCE7',
        waitColor: '#15803D',
        slotsText: '📅 48 स्लॉट उपलब्ध',
      };
    }
    if (centre.name.includes('Kolar') || centre.wait > 100) {
      return {
        hindiName: 'कोलार कृषि उपज मंडी',
        location: 'मंडी कॉम्प्लेक्स, भोपाल · 5.2 km',
        waitBadge: '🔴 बहुत भीड़ • लगभग 2.3 घंटे इंतजार',
        waitBg: '#FEE2E2',
        waitColor: '#B91C1C',
        slotsText: '📅 12 स्लॉट उपलब्ध',
      };
    }
    return {
      hindiName: 'सूखी सेवनिया उपार्जन केंद्र',
      location: 'वेयरहाउस रोड · 11.8 km',
      waitBadge: '🟡 कम भीड़ • लगभग 27 मिनट इंतजार',
      waitBg: '#FEF3C7',
      waitColor: '#92400E',
      slotsText: '📅 60 स्लॉट उपलब्ध',
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. COMPACT HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel="पीछे जाएं"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>मंडी चुनें</Text>
            <Text style={styles.headerSubText}>चरण 2 / 4 • सबसे अच्छी मंडी</Text>
          </View>

          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. COMPACT STEPPER (Minimal & Clean) ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <Text style={styles.stepDone}>✓ फसल</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepActive}>● मंडी</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepFuture}>○ समय</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepFuture}>○ पक्का</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3. COMPACT AI RECOMMENDATION BANNER ─── */}
        <View style={styles.adviceBanner}>
          <Text style={styles.adviceTag}>⭐ हमारी सलाह</Text>
          <Text style={styles.adviceTitle}>
            बैरसिया मंडी चुनें — यहां इंतजार कम है और तौल जल्दी होगी
          </Text>
        </View>

        {/* ─── 4. SECTION HEADING ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏪 मंडी चुनें</Text>
          <Text style={styles.sectionSub}>आपके लिए उपलब्ध केंद्र</Text>
        </View>

        {/* ─── 5. CLEAN WHITE MANDI CARDS ─── */}
        <View style={styles.cardsList}>
          {centres.map((centre) => {
            const isSelected = selectedCentre?.id === centre.id;
            const details = getMandiDetails(centre);

            return (
              <TouchableOpacity
                key={centre.id}
                style={[
                  styles.mandiCard,
                  isSelected ? styles.mandiCardSelected : styles.mandiCardNormal,
                ]}
                onPress={() => handleSelectCentre(centre)}
                activeOpacity={0.88}
              >
                {/* Top Row: Mandi Name + Subtle Recommendation Badge */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.mandiName}>
                    🏪 {details.hindiName}
                  </Text>

                  {centre.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedBadgeText}>⭐ हमारी सलाह</Text>
                    </View>
                  )}
                </View>

                {/* Location & Distance */}
                <Text style={styles.locationText}>
                  📍 {details.location}
                </Text>

                {/* Waiting Time & Crowd Status Pill */}
                <View style={[styles.waitPill, { backgroundColor: details.waitBg }]}>
                  <Text style={[styles.waitPillText, { color: details.waitColor }]}>
                    {details.waitBadge}
                  </Text>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Bottom Row: Slots & 1-Tap Select Action */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.slotsBox}>
                    <Text style={styles.slotsText}>{details.slotsText}</Text>
                    {centre.recommended && (
                      <TouchableOpacity
                        style={styles.whyLink}
                        onPress={() => handleOpenExplain(centre)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.whyLinkText}>ⓘ यह मंडी क्यों?</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Single Clean Select Button */}
                  <TouchableOpacity
                    style={[
                      styles.selectBtn,
                      isSelected ? styles.selectBtnActive : styles.selectBtnInactive,
                    ]}
                    onPress={() => handleSelectCentre(centre)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.selectBtnText,
                        isSelected ? styles.selectBtnTextActive : styles.selectBtnTextInactive,
                      ]}
                    >
                      {isSelected ? 'चुनी गई ✓' : 'चुनें'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 6. STICKY BOTTOM ACTION BAR (Clean & Uncluttered) ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {selectedCentre && (
          <Text style={styles.confirmationText} numberOfLines={1}>
            ✓ {getMandiDetails(selectedCentre).hindiName} चुनी गई
          </Text>
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
    paddingBottom: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...SHADOWS.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  headerTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 11,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },
  brandBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentLight,
  },

  /* ─── 2. PROGRESS STEPPER (Compact & Clean) ─── */
  stepperBar: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepDone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  stepActive: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  stepFuture: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepArrow: {
    fontSize: 12,
    color: '#CBD5E1',
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
  },

  /* ─── 3. COMPACT ADVICE BANNER ─── */
  adviceBanner: {
    backgroundColor: '#FEFCE8',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: 14,
  },
  adviceTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#854D0E',
    marginBottom: 2,
  },
  adviceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#713F12',
    lineHeight: 17,
  },

  /* ─── 4. SECTION HEADING ─── */
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },

  /* ─── 5. MANDI CARDS ─── */
  cardsList: {
    gap: 12,
  },
  mandiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md + 2,
    padding: 14,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  mandiCardNormal: {
    borderColor: '#E2E8F0',
  },
  mandiCardSelected: {
    borderColor: '#15803D',
    borderWidth: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mandiName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    flex: 1,
  },
  recommendedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  waitPill: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  waitPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotsBox: {
    flex: 1,
  },
  slotsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  whyLink: {
    marginTop: 3,
  },
  whyLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  selectBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnActive: {
    backgroundColor: '#15803D',
  },
  selectBtnInactive: {
    backgroundColor: '#F1F5F9',
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  selectBtnTextActive: {
    color: COLORS.white,
  },
  selectBtnTextInactive: {
    color: COLORS.textSecondary,
  },

  /* ─── 6. STICKY BOTTOM BAR ─── */
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...SHADOWS.lg,
  },
  confirmationText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    textAlign: 'center',
    marginBottom: 6,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
});
