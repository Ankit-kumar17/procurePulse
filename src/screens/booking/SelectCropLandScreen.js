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
  const [selectedSeason] = useState('Rabi 2026-27 (Active)');
  const [selectedLand, setSelectedLand] = useState(landHoldings[0]);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  const handleNext = () => {
    if (!selectedCrop) {
      Alert.alert('कृपया चुनें', 'कृपया पहले फसल का चयन करें।');
      return;
    }
    if (!selectedLand) {
      Alert.alert('कृपया चुनें', 'कृपया पहले खेत का चयन करें।');
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

  // Determine CTA Button State
  const isFormComplete = selectedCrop && selectedLand;
  const ctaButtonText = !selectedCrop
    ? 'पहले फसल चुनें'
    : !selectedLand
    ? 'पहले खेत चुनें'
    : 'आगे: मंडी चुनें →';

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
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>फसल बेचने का स्लॉट</Text>
            <Text style={styles.headerSubText}>चरण 1 / 4 • फसल और खेत</Text>
          </View>

          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="grain" size={16} color={COLORS.accent} />
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. MINIMAL STEPPER ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>1</Text>
            </View>
            <Text style={styles.stepLabelActive}>फसल</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.primaryLight} />

          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>मंडी</Text>
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 95 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3. PROCUREMENT SEASON STATUS STRIP ─── */}
        <View style={styles.seasonStatusStrip}>
          <View style={styles.seasonStatusLeft}>
            <MaterialCommunityIcons name="barley" size={18} color={COLORS.accentDark} />
            <Text style={styles.seasonStatusText}>रबी खरीद 2026–27</Text>
          </View>
          <View style={styles.seasonActiveBadge}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.seasonActiveText}>खरीद चालू है</Text>
          </View>
        </View>

        {/* ─── 4. STEP 1: CROP SELECTION ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionMainTitle}>🌾 कौन सी फसल बेचनी है?</Text>
          <Text style={styles.sectionSubTitle}>अपनी फसल चुनें</Text>
        </View>

        <View style={styles.cardGroup}>
          {crops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
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
                    size={30}
                    color={crop.active ? (isSelected ? COLORS.primary : COLORS.accentDark) : COLORS.textMuted}
                  />
                </View>

                <View style={styles.cropDetails}>
                  <View style={styles.cropNameRow}>
                    <Text style={[styles.cropHindiName, isSelected && styles.cropHindiNameSelected]}>
                      {crop.hindiName}
                    </Text>
                    <Text style={styles.cropEngName}>{crop.engName}</Text>
                  </View>

                  <View style={styles.mspRow}>
                    <Text style={styles.mspLabel}>MSP</Text>
                    <Text style={[styles.mspValue, isSelected && styles.mspValueSelected]}>
                      {crop.msp}
                    </Text>
                  </View>
                </View>

                <View style={styles.cropBadgeCol}>
                  {crop.active ? (
                    isSelected ? (
                      <View style={styles.selectedBadge}>
                        <MaterialCommunityIcons name="check-bold" size={14} color={COLORS.white} />
                        <Text style={styles.selectedBadgeText}>चुनी गई</Text>
                      </View>
                    ) : (
                      <View style={styles.eligibleBadge}>
                        <Text style={styles.eligibleBadgeText}>चुनें</Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.lockedBadge}>
                      <MaterialCommunityIcons name="lock-outline" size={13} color={COLORS.textSecondary} />
                      <Text style={styles.lockedBadgeText}>जल्द आएगा</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── 5. STEP 2: LAND SELECTION ─── */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionMainTitle}>🌱 कौन सा खेत?</Text>
          <Text style={styles.sectionSubTitle}>जिस खेत का अनाज बेचना है, उसे चुनें</Text>
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
                <View style={styles.landCardContent}>
                  <View style={styles.landLeftSection}>
                    <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                      {isSelected ? (
                        <MaterialCommunityIcons name="check" size={16} color={COLORS.white} />
                      ) : (
                        <View style={styles.uncheckDot} />
                      )}
                    </View>

                    <View style={styles.landInfoBox}>
                      <Text style={[styles.khasraText, isSelected && styles.khasraTextSelected]}>
                        खसरा नं. {land.khasra}
                      </Text>
                      <Text style={styles.locationText}>
                        📍 {land.village}, {land.tehsil}
                      </Text>

                      {/* Prominent Quantity Display */}
                      <View style={styles.yieldRow}>
                        <MaterialCommunityIcons name="scale" size={17} color={COLORS.accentDark} />
                        <Text style={styles.yieldBoldText}>लगभग {yieldKg.toLocaleString('en-IN')} kg</Text>
                      </View>
                    </View>
                  </View>

                  {/* Subdued Hectare Tag */}
                  <View style={styles.hectareBadge}>
                    <Text style={styles.hectareBadgeText}>{land.area} हेक्टेयर</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── 6. SMART SUMMARY (REASSURANCE) ─── */}
        {selectedCrop && selectedLand && (
          <View style={styles.summaryBox}>
            <View style={styles.summaryTopRow}>
              <MaterialCommunityIcons name="check-decagram" size={18} color={COLORS.success} />
              <Text style={styles.summaryTitle}>आपकी जानकारी</Text>
            </View>

            <View style={styles.summaryChipsRow}>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>🌾 {selectedCrop.hindiName}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>🌱 खसरा {selectedLand.khasra}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>⚖️ {calculatedKg.toLocaleString('en-IN')} kg ({calculatedQuintals} क्विंटल)</Text>
              </View>
            </View>

            <View style={styles.summaryAmountDivider} />

            <View style={styles.summaryAmountRow}>
              <Text style={styles.summaryAmountLabel}>लगभग मिलने वाली राशि:</Text>
              <Text style={styles.summaryAmountValue}>
                ₹{calculatedPayout.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ─── 7. STICKY BOTTOM ACTION CTA ─── */}
      <View style={[styles.bottomStickyBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            !isFormComplete && styles.ctaButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isFormComplete}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaButtonText, !isFormComplete && styles.ctaButtonTextDisabled]}>
            {ctaButtonText}
          </Text>
          {isFormComplete && (
            <View style={styles.ctaArrowCircle}>
              <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.primary} />
            </View>
          )}
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
  stepLabelActive: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
  },

  /* ─── 3. SEASON STATUS STRIP ─── */
  seasonStatusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF9C3',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE047',
    marginBottom: SPACING.md,
  },
  seasonStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seasonStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  seasonActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  seasonActiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.success,
  },

  /* ─── SECTION HEADERS ─── */
  sectionHeader: {
    marginBottom: SPACING.sm + 2,
  },
  sectionMainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },

  /* ─── CARD GROUPS ─── */
  cardGroup: {
    gap: 10,
  },

  /* ─── 4. CROP CARDS ─── */
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
    width: 52,
    height: 52,
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
    marginLeft: 14,
  },
  cropNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  cropHindiName: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
  },
  cropHindiNameSelected: {
    color: COLORS.primary,
  },
  cropEngName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  mspRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
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
  mspValueSelected: {
    color: COLORS.primary,
  },
  cropBadgeCol: {
    alignItems: 'flex-end',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
  eligibleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eligibleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  lockedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  /* ─── 5. LAND PARCEL CARDS ─── */
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
  landCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  landLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: COLORS.accentDark,
    borderColor: COLORS.accentDark,
  },
  uncheckDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  landInfoBox: {
    flex: 1,
  },
  khasraText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  khasraTextSelected: {
    color: COLORS.primary,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  yieldBoldText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  hectareBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hectareBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  /* ─── 6. SMART SUMMARY (REASSURANCE) ─── */
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  summaryPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryAmountDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  summaryAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryAmountLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  summaryAmountValue: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.success,
  },

  /* ─── 7. STICKY BOTTOM ACTION CTA ─── */
  bottomStickyBar: {
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
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    paddingHorizontal: SPACING.md,
    gap: 10,
    ...SHADOWS.md,
  },
  ctaButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  ctaButtonTextDisabled: {
    color: '#64748B',
  },
  ctaArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
