import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';
import ExplainModal from '../../components/ExplainModal';
import { useFarmer } from '../../context/FarmerContext';

export default function CentreRecommendationScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity } = route.params || {};
  const { centres } = useFarmer();
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

  return (
    <View style={styles.container}>
      <Header
        title="Smart Centre Recommendation"
        subtitle="Step 2 of 4: AI Queue & Distance Optimization"
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Wizard Step Indicator */}
      <View style={styles.wizardBar}>
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>✓</Text>
          <Text style={styles.wizardStepText}>Crop & Land</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={[styles.wizardStep, styles.wizardStepActive]}>
          <Text style={styles.wizardStepNumActive}>2</Text>
          <Text style={styles.wizardStepTextActive}>Centre AI</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>3</Text>
          <Text style={styles.wizardStepText}>Date & Slot</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recommendation Engine Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIconBox}>
            <MaterialCommunityIcons name="brain" size={24} color={COLORS.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>ProcurePulse AI Dispatcher</Text>
            <Text style={styles.aiBannerDesc}>
              Centres dynamically ranked by minimizing transit travel + live weighbridge wait times.
            </Text>
          </View>
        </View>

        <Text style={styles.listHeading}>Recommended Procurement Centres</Text>

        {centres.map((centre) => {
          const isSelected = selectedCentre?.id === centre.id;
          return (
            <Card
              key={centre.id}
              highlight={isSelected}
              goldBorder={centre.recommended}
              style={[
                styles.centreCard,
                isSelected && styles.centreCardSelected,
              ]}
              onPress={() => handleSelectCentre(centre)}
            >
              {/* Top Row: Title + Badges */}
              <View style={styles.centreHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleWithBadge}>
                    <Text style={styles.centreName}>{centre.name}</Text>
                  </View>
                  <Text style={styles.centreAddress}>{centre.address}</Text>
                </View>

                {centre.recommended && (
                  <View style={styles.recommendedBadge}>
                    <MaterialCommunityIcons name="star" size={14} color={COLORS.primaryDark} />
                    <Text style={styles.recommendedText}>AI Recommended</Text>
                  </View>
                )}
              </View>

              {/* Metrics Grid */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="map-marker-distance" size={18} color={COLORS.primary} />
                  <Text style={styles.metricVal}>{centre.distance} km</Text>
                  <Text style={styles.metricLabel}>Distance</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={centre.wait > 100 ? COLORS.error : COLORS.success}
                  />
                  <Text
                    style={[
                      styles.metricVal,
                      { color: centre.wait > 100 ? COLORS.error : COLORS.success },
                    ]}
                  >
                    {centre.wait} mins
                  </Text>
                  <Text style={styles.metricLabel}>Pred. Wait</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="warehouse" size={18} color={COLORS.info} />
                  <Text style={styles.metricVal}>{centre.availableSlots} Slots</Text>
                  <Text style={styles.metricLabel}>Daily Left</Text>
                </View>
              </View>

              {/* AI Reasoning Strip */}
              <View style={styles.reasoningBox}>
                <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.primary} />
                <Text style={styles.reasoningText} numberOfLines={2}>
                  {centre.reasoning}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardBtnRow}>
                {centre.recommended && (
                  <TouchableOpacity
                    style={styles.whyBtn}
                    onPress={() => handleOpenExplain(centre)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name="help-circle-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.whyBtnText}>Why this recommendation?</Text>
                  </TouchableOpacity>
                )}

                <Button
                  title={isSelected ? 'Selected ✓' : 'Select Centre'}
                  variant={isSelected ? 'gold' : 'outline'}
                  size="sm"
                  onPress={() => handleSelectCentre(centre)}
                  style={styles.selectBtn}
                />
              </View>
            </Card>
          );
        })}

        <Button
          title={`Proceed to Date Selection (${selectedCentre?.name?.split('(')[0] || 'Selected'})`}
          variant="primary"
          size="lg"
          iconRight="arrow-right"
          onPress={handleProceed}
          style={{ marginTop: SPACING.md }}
        />
      </ScrollView>

      {/* Explainability Modal */}
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
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '44',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
    gap: 12,
  },
  aiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  aiBannerDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  centreCard: {
    marginBottom: SPACING.md,
  },
  centreCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#FCFAF5',
  },
  centreHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  centreName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  centreAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3,
    marginLeft: 6,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  reasoningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(27,58,92,0.05)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  reasoningText: {
    fontSize: 11,
    color: COLORS.primary,
    flex: 1,
    lineHeight: 15,
  },
  cardBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  whyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  whyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  selectBtn: {
    marginLeft: 'auto',
    minWidth: 110,
  },
});
