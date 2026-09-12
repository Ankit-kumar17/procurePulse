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
      hindiName: 'गेहूं (Wheat)',
      variety: 'Sharbati A-Grade',
      msp: '₹2,275 / क्विंटल',
      mspRate: 2275,
      active: true,
      icon: 'barley',
    },
    {
      id: 'chana',
      name: 'Gram / Chana (चना)',
      hindiName: 'चना (Gram)',
      variety: 'Desi Chana',
      msp: '₹5,440 / क्विंटल',
      mspRate: 5440,
      active: true,
      icon: 'seed',
    },
  ];

  const landHoldings = farmer?.landHoldings || [
    { id: 'L01', khasra: '123/1', area: 2.5, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' },
    { id: 'L02', khasra: '145/4', area: 1.2, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' },
  ];

  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [selectedLand, setSelectedLand] = useState(landHoldings[0]);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 6;

  const handleNext = () => {
    if (!selectedCrop || !selectedLand) {
      Alert.alert('कृपया चयन करें', 'कृपया फसल और खेत का चयन करें।');
      return;
    }

    navigation.navigate('CentreRecommendation', {
      crop: selectedCrop.name,
      variety: selectedCrop.variety,
      season: 'Rabi 2026-27 (Active)',
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

      {/* ─── 1. HEADER ─── */}
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
            <Text style={styles.headerTitleText}>फसल व खेत चुनें</Text>
            <Text style={styles.headerSubText}>चरण 1 / 4 • स्लॉट बुकिंग</Text>
          </View>

          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. PROGRESS STEPPER ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <Text style={styles.stepActive}>● फसल</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepFuture}>○ मंडी</Text>
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
        {/* ─── STEP 1: CROP SELECTION ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>1. कौन सी फसल बेचना चाहते हैं?</Text>
          
          <View style={styles.cropsGrid}>
            {crops.map((crop) => {
              const isSelected = selectedCrop?.id === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={[
                    styles.cropCard,
                    isSelected ? styles.cropCardSelected : styles.cropCardNormal,
                  ]}
                  onPress={() => setSelectedCrop(crop)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cropTopRow}>
                    <MaterialCommunityIcons
                      name={crop.icon}
                      size={26}
                      color={isSelected ? '#15803D' : COLORS.primary}
                    />
                    {isSelected && (
                      <View style={styles.checkPill}>
                        <Text style={styles.checkPillText}>✓ चुनी गई</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cropTitleText}>{crop.hindiName}</Text>
                  <Text style={styles.cropVarietyText}>{crop.variety}</Text>
                  <Text style={styles.cropMspText}>सरकारी दर: {crop.msp}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── STEP 2: LAND SELECTION ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>2. किस खेत से फसल बेच रहे हैं?</Text>

          <View style={styles.landList}>
            {landHoldings.map((land) => {
              const isSelected = selectedLand?.id === land.id;
              return (
                <TouchableOpacity
                  key={land.id}
                  style={[
                    styles.landCard,
                    isSelected ? styles.landCardSelected : styles.landCardNormal,
                  ]}
                  onPress={() => setSelectedLand(land)}
                  activeOpacity={0.85}
                >
                  <View style={styles.landHeaderRow}>
                    <Text style={styles.landTitle}>खसरा #{land.khasra}</Text>
                    {isSelected ? (
                      <View style={styles.checkPill}>
                        <Text style={styles.checkPillText}>✓ चुना गया</Text>
                      </View>
                    ) : (
                      <Text style={styles.unselectedText}>चुनें</Text>
                    )}
                  </View>
                  <Text style={styles.landSub}>
                    रकबा: {land.area} हेक्टेयर ({land.village}, {land.tehsil})
                  </Text>
                  <Text style={styles.landWeight}>
                    अनुमानित उत्पादन: {land.area * 800} kg ({land.area * 8} क्विंटल)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── STEP 3: ESTIMATED PAYOUT SUMMARY ─── */}
        <View style={styles.payoutCard}>
          <View style={styles.payoutTop}>
            <MaterialCommunityIcons name="calculator" size={20} color="#15803D" />
            <Text style={styles.payoutTitle}>अनुमानित सरकारी भुगतान (MSP Value)</Text>
          </View>
          <Text style={styles.payoutAmount}>₹{calculatedPayout.toLocaleString('en-IN')}</Text>
          <Text style={styles.payoutSub}>
            {calculatedKg.toLocaleString('en-IN')} kg ({calculatedQuintals} क्विंटल) × ₹{selectedCrop.mspRate}/Qtl
          </Text>
        </View>
      </ScrollView>

      {/* ─── STICKY BOTTOM BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaButtonText}>आगे: मंडी चुनें →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
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

  /* ─── 2. PROGRESS STEPPER ─── */
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
    gap: 12,
  },

  /* ─── SECTION CARD ─── */
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },

  /* ─── CROPS ─── */
  cropsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  cropCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1.5,
  },
  cropCardNormal: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  cropCardSelected: {
    borderColor: '#15803D',
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  cropTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  checkPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  checkPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  cropTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  cropVarietyText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  cropMspText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '800',
    marginTop: 4,
  },

  /* ─── LANDS ─── */
  landList: {
    gap: 8,
  },
  landCard: {
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1.5,
  },
  landCardNormal: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  landCardSelected: {
    borderColor: '#15803D',
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  landHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  landTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  unselectedText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  landSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  landWeight: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 4,
  },

  /* ─── PAYOUT SUMMARY ─── */
  payoutCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  payoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  payoutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  payoutAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#15803D',
    marginVertical: 2,
  },
  payoutSub: {
    fontSize: 11,
    color: '#166534',
  },

  /* ─── STICKY BOTTOM BAR ─── */
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
