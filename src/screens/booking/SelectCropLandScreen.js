import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../utils/theme';
import { Header, Card, Badge, Button, StepIndicator, MetricCard, InfoRow } from '../../components';
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

  const bookingSteps = ['फसल व खेत', 'मंडी चुनें', 'तारीख व समय', 'पुष्टि'];

  return (
    <View style={styles.container}>
      {/* ─── 1. HEADER ─── */}
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        title="फसल व खेत चुनें"
        subtitle="चरण 1 / 4 • स्लॉट बुकिंग"
      />

      {/* ─── 2. PROGRESS STEPPER ─── */}
      <View style={styles.stepperContainer}>
        <StepIndicator steps={bookingSteps} currentStep={1} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── STEP 1: CROP SELECTION ─── */}
        <Card style={styles.sectionCard}>
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
                      color={isSelected ? COLORS.success : COLORS.primary}
                    />
                    {isSelected ? (
                      <Badge label="चुनी गई" variant="success" size="sm" icon="check" />
                    ) : (
                      <Text style={styles.unselectedText}>चुनें</Text>
                    )}
                  </View>
                  <Text style={styles.cropTitleText}>{crop.hindiName}</Text>
                  <Text style={styles.cropVarietyText}>{crop.variety}</Text>
                  <Text style={styles.cropMspText}>सरकारी दर: {crop.msp}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* ─── STEP 2: LAND SELECTION ─── */}
        <Card style={styles.sectionCard}>
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
                      <Badge label="चुना गया" variant="success" size="sm" icon="check" />
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
        </Card>

        {/* ─── STEP 3: ESTIMATED PAYOUT SUMMARY ─── */}
        <Card variant="success" style={styles.payoutCard}>
          <View style={styles.payoutTop}>
            <MaterialCommunityIcons name="calculator" size={20} color={COLORS.success} />
            <Text style={styles.payoutTitle}>अनुमानित सरकारी भुगतान (MSP Value)</Text>
          </View>
          <Text style={styles.payoutAmount}>₹{calculatedPayout.toLocaleString('en-IN')}</Text>
          <Text style={styles.payoutSub}>
            {calculatedKg.toLocaleString('en-IN')} kg ({calculatedQuintals} क्विंटल) × ₹{selectedCrop.mspRate}/Qtl
          </Text>
        </Card>
      </ScrollView>

      {/* ─── STICKY BOTTOM BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button
          title="आगे: मंडी चुनें →"
          size="lg"
          variant="primary"
          fullWidth
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepperContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionCard: {
    marginBottom: SPACING.md,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  cropsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  cropCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
  },
  cropCardNormal: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  cropCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.success,
  },
  cropTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cropTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  cropVarietyText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  cropMspText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  unselectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  landList: {
    gap: 10,
  },
  landCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
  },
  landCardNormal: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  landCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: COLORS.success,
  },
  landHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  landTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  landSub: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  landWeight: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  payoutCard: {
    padding: SPACING.md + 2,
    marginBottom: SPACING.lg,
  },
  payoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  payoutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.successDark,
  },
  payoutAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.success,
    marginVertical: 2,
  },
  payoutSub: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
});
