import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';

export default function SelectCropLandScreen({ navigation }) {
  const { farmer } = useFarmer();
  const insets = useSafeAreaInsets();

  const crops = [
    {
      id: 'wheat',
      name: 'Wheat (गेहूं)',
      hindiName: 'गेहूं',
      engName: 'Wheat',
      variety: 'Sharbati A-Grade',
      msp: '₹2,275 / क्विंटल',
      mspRate: 2275,
      active: true,
      icon: 'barley',
    },
    {
      id: 'chana',
      name: 'Gram / Chana (चना)',
      hindiName: 'चना',
      engName: 'Gram / Chana',
      variety: 'Desi Chana',
      msp: '₹5,440 / क्विंटल',
      mspRate: 5440,
      active: false,
      icon: 'seed',
    },
  ];

  const landHoldings = farmer?.landHoldings || [
    { id: 'L01', khasra: '123/1', area: 2.5, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' },
    { id: 'L02', khasra: '145/4', area: 1.2, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' },
  ];

  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [selectedSeason, setSelectedSeason] = useState('Rabi 2026-27 (Active)');
  const [selectedLand, setSelectedLand] = useState(landHoldings[0]);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  const handleNext = () => {
    if (!selectedCrop || !selectedLand) {
      Alert.alert('कृपया चयन करें', 'कृपया फसल और खेत का चयन करें।');
      return;
    }

    navigation.navigate('CentreRecommendation', {
      crop: selectedCrop.name,
      variety: selectedCrop.variety,
      season: selectedSeason,
      land: selectedLand,
      quantity: `${selectedLand.area * 800} kg (${(selectedLand.area * 8).toFixed(1)} Qtl)`,
    });
  };

  const calculatedKg = selectedLand ? selectedLand.area * 800 : 0;
  const calculatedQuintals = (calculatedKg / 100).toFixed(1);
  const calculatedPayout = Math.round((calculatedKg / 100) * (selectedCrop?.mspRate || 2275));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── COMPACT TOP HEADER ─── */}
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
            <Text style={styles.headerTitleText}>फसल बेचने का समय लें</Text>
            <Text style={styles.headerSubText}>चरण 1 / 4 • फसल व खेत का चयन</Text>
          </View>

          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="grain" size={16} color={COLORS.accent} />
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 4-STEP WIZARD PROGRESS TRACKER ─── */}
      <View style={styles.wizardBar}>
        <View style={[styles.stepItem, styles.stepItemActive]}>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <MaterialCommunityIcons name="barley" size={14} color={COLORS.white} />
          </View>
          <Text style={styles.stepLabelActive}>① फसल व खेत</Text>
        </View>

        <View style={[styles.stepConnector, styles.stepConnectorActive]} />

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>2</Text>
          </View>
          <Text style={styles.stepLabel}>② मंडी</Text>
        </View>

        <View style={styles.stepConnector} />

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <Text style={styles.stepLabel}>③ समय</Text>
        </View>

        <View style={styles.stepConnector} />

        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNum}>4</Text>
          </View>
          <Text style={styles.stepLabel}>④ पक्का</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── ACTIVE SEASON NOTICE ─── */}
        <View style={styles.seasonNotice}>
          <MaterialCommunityIcons name="calendar-check" size={20} color={COLORS.primary} />
          <View style={styles.seasonNoticeContent}>
            <Text style={styles.seasonNoticeTitle}>चालू खरीद सत्र (Rabi 2026-27)</Text>
            <Text style={styles.seasonNoticeSub}>शासकीय उपार्जन केन्द्रों पर समर्थन मूल्य (MSP) पर तौल</Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>सक्रिय</Text>
          </View>
        </View>

        {/* ─── STEP 1: CROP SELECTION ─── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumberCircle}>
            <Text style={styles.sectionNumberText}>1</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionMainTitle}>🌾 कौन सी फसल बेचनी है?</Text>
            <Text style={styles.sectionSubTitle}>Select your crop for procurement</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {crops.map((crop) => {
            const isSelected = selectedCrop.id === crop.id;
            return (
              <TouchableOpacity
                key={crop.id}
                style={[
                  styles.cropCard,
                  isSelected && styles.cropCardSelected,
                  !crop.active && styles.cropCardDisabled,
                ]}
                onPress={() => {
                  if (crop.active) {
                    setSelectedCrop(crop);
                  } else {
                    Alert.alert('सूचना', `${crop.hindiName} की खरीद जल्द ही शुरू होगी।`);
                  }
                }}
                activeOpacity={crop.active ? 0.8 : 1}
              >
                <View style={[styles.cropIconBox, isSelected && styles.cropIconBoxSelected]}>
                  <MaterialCommunityIcons
                    name={crop.icon}
                    size={28}
                    color={crop.active ? (isSelected ? COLORS.primary : COLORS.accentDark) : COLORS.textMuted}
                  />
                </View>

                <View style={styles.cropDetails}>
                  <View style={styles.cropNameRow}>
                    <Text style={[styles.cropHindiName, isSelected && styles.cropHindiNameSelected]}>
                      {crop.hindiName}
                    </Text>
                    <Text style={styles.cropEngName}>({crop.engName})</Text>
                  </View>

                  <Text style={styles.cropVarietyText}>
                    किस्म: {crop.variety}
                  </Text>

                  <View style={styles.mspRow}>
                    <Text style={styles.mspLabel}>MSP:</Text>
                    <Text style={styles.mspValue}>{crop.msp}</Text>
                  </View>
                </View>

                <View style={styles.cropStatusCol}>
                  {crop.active ? (
                    <View style={[styles.eligibilityBadge, isSelected && styles.eligibilityBadgeSelected]}>
                      <MaterialCommunityIcons
                        name={isSelected ? "check-circle" : "check"}
                        size={15}
                        color={isSelected ? COLORS.white : COLORS.success}
                      />
                      <Text style={[styles.eligibilityText, isSelected && styles.eligibilityTextSelected]}>
                        {isSelected ? 'चुनी गई' : 'पात्र'}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.comingSoonBadge}>
                      <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS.textSecondary} />
                      <Text style={styles.comingSoonText}>जल्द शुरू</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── STEP 2: LAND PARCEL SELECTION ─── */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <View style={styles.sectionNumberCircle}>
            <Text style={styles.sectionNumberText}>2</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionMainTitle}>🌱 आपका खेत चुनें</Text>
            <Text style={styles.sectionSubTitle}>किस खेत का अनाज बेच रहे हैं?</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {landHoldings.map((land) => {
            const isSelected = selectedLand?.id === land.id || selectedLand?.khasra === land.khasra;
            const yieldKg = land.area * 800;
            return (
              <TouchableOpacity
                key={land.id || land.khasra}
                style={[
                  styles.landCard,
                  isSelected && styles.landCardSelected,
                ]}
                onPress={() => setSelectedLand(land)}
                activeOpacity={0.8}
              >
                <View style={styles.landCardTop}>
                  <View style={styles.landHeaderLeft}>
                    <View style={[styles.radioOutline, isSelected && styles.radioOutlineSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={[styles.khasraTitle, isSelected && styles.khasraTitleSelected]}>
                        खसरा नं. {land.khasra}
                      </Text>
                      <Text style={styles.khasraLocation}>
                        📍 {land.village}, {land.tehsil} ({land.district})
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.areaBadge, isSelected && styles.areaBadgeSelected]}>
                    <MaterialCommunityIcons
                      name="texture-box"
                      size={14}
                      color={isSelected ? COLORS.white : COLORS.primary}
                    />
                    <Text style={[styles.areaBadgeText, isSelected && styles.areaBadgeTextSelected]}>
                      {land.area} हेक्टेयर
                    </Text>
                  </View>
                </View>

                <View style={styles.landCardDivider} />

                <View style={styles.landCardBottom}>
                  <View style={styles.quotaBox}>
                    <MaterialCommunityIcons name="scale" size={18} color={COLORS.accentDark} />
                    <Text style={styles.quotaLabel}>अनुमानित अनाज कोटा:</Text>
                    <Text style={styles.quotaValue}>{yieldKg.toLocaleString('en-IN')} kg</Text>
                    <Text style={styles.quotaSub}>({(yieldKg / 100).toFixed(1)} क्विंटल)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Revenue Record Subtle Assurance */}
        <View style={styles.govAssuranceBanner}>
          <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.success} />
          <Text style={styles.govAssuranceText}>
            म.प्र. भू-अभिलेख एवं आधार से सत्यापित पंजीकृत भूमि रिकॉर्ड
          </Text>
        </View>

        {/* ─── LIVE CALCULATION & SUMMARY CARD ─── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="scale-balance" size={22} color={COLORS.accentDark} />
            <Text style={styles.summaryHeading}>⚖️ आप इतना अनाज बेच सकते हैं</Text>
          </View>

          <View style={styles.summaryMainRow}>
            <View style={styles.summaryQuantityBox}>
              <Text style={styles.summaryBigNumber}>
                {calculatedKg.toLocaleString('en-IN')}
                <Text style={styles.summaryBigUnit}> kg</Text>
              </Text>
              <Text style={styles.summarySubCrop}>
                {selectedCrop.hindiName} ({calculatedQuintals} क्विंटल)
              </Text>
            </View>

            <View style={styles.summaryDividerVert} />

            <View style={styles.summaryPayoutBox}>
              <Text style={styles.summaryPayoutLabel}>अनुमानित MSP राशि</Text>
              <Text style={styles.summaryPayoutAmount}>
                ₹{calculatedPayout.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.summaryPayoutRate}>
                @{selectedCrop.msp}
              </Text>
            </View>
          </View>

          {/* Quick Selection Confirmation Strip */}
          <View style={styles.summaryStrip}>
            <Text style={styles.summaryStripLabel}>आपने चुना:</Text>
            <View style={styles.summaryChips}>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipText}>🌾 {selectedCrop.hindiName}</Text>
              </View>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipText}>🌱 खसरा {selectedLand?.khasra}</Text>
              </View>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipText}>⚖️ {calculatedKg} kg</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ─── STICKY BOTTOM ACTION CTA ─── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <View style={styles.actionButtonContent}>
            <View>
              <Text style={styles.actionButtonMainText}>आगे: मंडी केंद्र चुनें →</Text>
              <Text style={styles.actionButtonSubText}>चरण 2: AI दूरी व कम कतार वाली मंडी</Text>
            </View>
            <View style={styles.actionButtonIconCircle}>
              <MaterialCommunityIcons name="arrow-right" size={22} color={COLORS.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* ─── COMPACT HEADER ─── */
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
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '500',
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

  /* ─── 4-STEP WIZARD TRACKER ─── */
  wizardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stepItemActive: {},
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepLabelActive: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.primary,
  },

  /* ─── CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
  },

  /* ─── SEASON NOTICE ─── */
  seasonNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.md,
    gap: 8,
  },
  seasonNoticeContent: {
    flex: 1,
  },
  seasonNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  seasonNoticeSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  activePill: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },

  /* ─── SECTION HEADERS ─── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.sm + 2,
  },
  sectionNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  sectionMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  /* ─── CARD GROUPS ─── */
  cardGroup: {
    gap: 10,
  },

  /* ─── CROP CARDS ─── */
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cropCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7FF',
    ...SHADOWS.md,
  },
  cropCardDisabled: {
    opacity: 0.55,
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  cropIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  cropIconBoxSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  cropDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cropNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  cropHindiName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  cropHindiNameSelected: {
    color: COLORS.primary,
  },
  cropEngName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cropVarietyText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mspRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  mspLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  mspValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  cropStatusCol: {
    alignItems: 'flex-end',
  },
  eligibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  eligibilityBadgeSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  eligibilityText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.success,
  },
  eligibilityTextSelected: {
    color: COLORS.white,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  /* ─── LAND PARCEL CARDS ─── */
  landCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  landCardSelected: {
    borderColor: COLORS.accentDark,
    backgroundColor: '#FFFDF5',
    ...SHADOWS.md,
  },
  landCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  landHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOutlineSelected: {
    borderColor: COLORS.accentDark,
    backgroundColor: '#FFFBEB',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accentDark,
  },
  khasraTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  khasraTitleSelected: {
    color: COLORS.primary,
  },
  khasraLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  areaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaBadgeSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  areaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  areaBadgeTextSelected: {
    color: COLORS.white,
  },
  landCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  landCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quotaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quotaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  quotaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quotaSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /* ─── GOV ASSURANCE ─── */
  govAssuranceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 4,
  },
  govAssuranceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  /* ─── LIVE CALCULATION & SUMMARY CARD ─── */
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.accentLight,
    ...SHADOWS.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    paddingBottom: 8,
    marginBottom: 10,
  },
  summaryHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  summaryMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryQuantityBox: {
    flex: 1,
  },
  summaryBigNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  summaryBigUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  summarySubCrop: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryDividerVert: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  summaryPayoutBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryPayoutLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  summaryPayoutAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.success,
    marginTop: 2,
  },
  summaryPayoutRate: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    flexWrap: 'wrap',
  },
  summaryStripLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  summaryChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  summaryChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  /* ─── STICKY BOTTOM CTA ─── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.md,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonMainText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  actionButtonSubText: {
    fontSize: 11,
    color: COLORS.accentLight,
    marginTop: 2,
  },
  actionButtonIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
