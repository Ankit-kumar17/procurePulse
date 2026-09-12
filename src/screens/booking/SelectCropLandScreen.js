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
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useFarmer } from '../../context/FarmerContext';

export default function SelectCropLandScreen({ navigation }) {
  const { farmer } = useFarmer();

  const crops = [
    { id: 'wheat', name: 'Wheat (गेहूं)', variety: 'Sharbati A-Grade', msp: '₹2,275/Qtl', active: true },
    { id: 'chana', name: 'Gram / Chana (चना)', variety: 'Desi Chana', msp: '₹5,440/Qtl', active: false },
  ];

  const landHoldings = farmer?.landHoldings || [
    { id: 'L01', khasra: '123/1', area: 2.5, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' },
    { id: 'L02', khasra: '145/4', area: 1.2, village: 'Pipariya', tehsil: 'Berasia', district: 'Bhopal' }
  ];

  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [selectedSeason, setSelectedSeason] = useState('Rabi 2026-27 (Active)');
  const [selectedLand, setSelectedLand] = useState(landHoldings[0]);

  const handleNext = () => {
    if (!selectedCrop || !selectedLand) {
      Alert.alert('Selection Required', 'Please select a crop and a land parcel.');
      return;
    }

    navigation.navigate('CentreRecommendation', {
      crop: selectedCrop.name,
      variety: selectedCrop.variety,
      season: selectedSeason,
      land: selectedLand,
      quantity: `${selectedLand.area * 800} kg (${(selectedLand.area * 8).toFixed(1)} Qtl)`
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Book Procurement Slot"
        subtitle="Step 1 of 4: Select Crop & Land Parcel"
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Wizard Step Indicator */}
      <View style={styles.wizardBar}>
        <View style={[styles.wizardStep, styles.wizardStepActive]}>
          <Text style={styles.wizardStepNumActive}>1</Text>
          <Text style={styles.wizardStepTextActive}>Crop & Land</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>2</Text>
          <Text style={styles.wizardStepText}>Centre AI</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>3</Text>
          <Text style={styles.wizardStepText}>Date & Slot</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Season & Crop Selection */}
        <Card title="Procurement Crop & Season" icon="sprout" iconColor={COLORS.primary}>
          <View style={styles.seasonBanner}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.seasonLabel}>Active Procurement Season</Text>
              <Text style={styles.seasonValue}>{selectedSeason}</Text>
            </View>
            <Badge label="MSP Active" variant="success" size="sm" />
          </View>

          <Text style={styles.subHeading}>Select Crop / फसल का चयन करें</Text>
          {crops.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropOption,
                selectedCrop.id === crop.id && styles.cropOptionSelected,
                !crop.active && styles.cropOptionDisabled,
              ]}
              onPress={() => crop.active && setSelectedCrop(crop)}
              activeOpacity={0.8}
            >
              <View style={styles.radioCircle}>
                {selectedCrop.id === crop.id && <View style={styles.radioFill} />}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cropName}>{crop.name}</Text>
                <Text style={styles.cropVariety}>Variety: {crop.variety} • MSP: {crop.msp}</Text>
              </View>
              {crop.active ? (
                <Badge label="Eligible" variant="gold" size="sm" />
              ) : (
                <Badge label="Coming Soon" variant="default" size="sm" />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Land Parcel Selection */}
        <Card
          title="Select Registered Land Parcel"
          subtitle="Revenue Records linked to your Aadhaar"
          icon="terrain"
          iconColor={COLORS.primary}
        >
          {landHoldings.map((land) => {
            const isSelected = selectedLand?.id === land.id || selectedLand?.khasra === land.khasra;
            return (
              <TouchableOpacity
                key={land.id || land.khasra}
                style={[styles.landOption, isSelected && styles.landOptionSelected]}
                onPress={() => setSelectedLand(land)}
                activeOpacity={0.8}
              >
                <View style={styles.radioCircle}>
                  {isSelected && <View style={styles.radioFill} />}
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={styles.landTitleRow}>
                    <Text style={styles.khasraNo}>Khasra #{land.khasra}</Text>
                    <Text style={styles.landAreaBadge}>{land.area} Hectares</Text>
                  </View>
                  <Text style={styles.landLoc}>
                    {land.village}, {land.tehsil}, {land.district}
                  </Text>
                  <Text style={styles.quotaCalc}>
                    Estimated Yield Quota: <Text style={{ fontWeight: '700' }}>{land.area * 800} kg</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Quota Summary Callout */}
        <View style={styles.summaryCallout}>
          <MaterialCommunityIcons name="scale" size={24} color={COLORS.accentDark} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.summaryTitle}>Selected Slot Entitlement</Text>
            <Text style={styles.summaryValue}>
              {selectedLand.area * 800} kg ({selectedCrop.name})
            </Text>
            <Text style={styles.summaryMsp}>
              Calculated MSP Payout: ₹{((selectedLand.area * 800 / 100) * 2275).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <Button
          title="Proceed to Recommended Centres"
          variant="primary"
          size="lg"
          iconRight="arrow-right"
          onPress={handleNext}
          style={{ marginTop: SPACING.sm }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  wizardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md,
  },
  wizardStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wizardStepActive: {},
  wizardStepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  wizardStepNumActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  wizardStepText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  wizardStepTextActive: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  wizardLine: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  seasonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.infoLight,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  seasonLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  seasonValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cropOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cropOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(27,58,92,0.04)',
  },
  cropOptionDisabled: {
    opacity: 0.5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  cropVariety: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  landOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  landOptionSelected: {
    borderColor: COLORS.accentDark,
    backgroundColor: 'rgba(212,168,67,0.08)',
  },
  landTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  khasraNo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  landAreaBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  landLoc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  quotaCalc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  summaryCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '33',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  summaryMsp: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '700',
    marginTop: 2,
  },
});
