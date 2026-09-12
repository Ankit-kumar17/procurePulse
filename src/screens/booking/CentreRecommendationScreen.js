import React, { useState, useEffect } from 'react';
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
import { Header, Card, Badge, Button, StepIndicator } from '../../components';
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
      'नमस्ते किसान भाई!\n\n• बैरसिया केंद्र सबसे तेज है — यहां तौल 40 मिनट में पूरी हो जाएगी।\n• कोलार मंडी में 2 घंटे से अधिक की भारी भीड़ है।\n• हम आपको बैरसिया केंद्र चुनने की सलाह देते हैं।',
      [{ text: 'समझ गया (OK)' }]
    );
  };

  // Clean Hindi metadata helper
  const getMandiDetails = (centre) => {
    if (centre.name.includes('Berasia') || centre.recommended) {
      return {
        hindiName: 'बेरसिया उपार्जन केंद्र',
        location: 'NH-46 जंक्शन · 8.4 km',
        waitBadge: 'कम भीड़ • लगभग 41 मिनट इंतजार',
        badgeVariant: 'success',
        slotsText: '📅 48 स्लॉट उपलब्ध',
      };
    }
    if (centre.name.includes('Kolar') || centre.wait > 100) {
      return {
        hindiName: 'कोलार कृषि उपज मंडी',
        location: 'मंडी कॉम्प्लेक्स, भोपाल · 5.2 km',
        waitBadge: 'बहुत भीड़ • लगभग 2.3 घंटे इंतजार',
        badgeVariant: 'error',
        slotsText: '📅 12 स्लॉट उपलब्ध',
      };
    }
    return {
      hindiName: 'सूखी सेवनिया उपार्जन केंद्र',
      location: 'वेयरहाउस रोड · 11.8 km',
      waitBadge: 'सामान्य भीड़ • लगभग 27 मिनट इंतजार',
      badgeVariant: 'warning',
      slotsText: '📅 60 स्लॉट उपलब्ध',
    };
  };

  const bookingSteps = ['फसल व खेत', 'मंडी चुनें', 'तारीख व समय', 'पुष्टि'];

  return (
    <View style={styles.container}>
      {/* ─── 1. COMPACT HEADER ─── */}
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        onVoiceGuidePress={handlePlayVoiceGuide}
        title="मंडी चुनें"
        subtitle="चरण 2 / 4 • सबसे अच्छी मंडी"
      />

      {/* ─── 2. COMPACT STEPPER ─── */}
      <View style={styles.stepperContainer}>
        <StepIndicator steps={bookingSteps} currentStep={2} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3. COMPACT AI RECOMMENDATION BANNER ─── */}
        <View style={styles.adviceBanner}>
          <Badge label="⭐ हमारी सलाह" variant="gold" size="sm" />
          <Text style={styles.adviceTitle}>
            बैरसिया मंडी चुनें — यहां इंतजार कम है और तौल जल्दी होगी
          </Text>
        </View>

        {/* ─── 4. SECTION HEADING ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏪 उपलब्ध उपार्जन केंद्र</Text>
          <Text style={styles.sectionSub}>अपनी सुविधानुसार केंद्र चुनें</Text>
        </View>

        {/* ─── 5. CLEAN WHITE MANDI CARDS ─── */}
        <View style={styles.cardsList}>
          {centres.map((centre) => {
            const isSelected = selectedCentre?.id === centre.id;
            const details = getMandiDetails(centre);

            return (
              <Card
                key={centre.id}
                selected={isSelected}
                style={styles.mandiCard}
                onPress={() => handleSelectCentre(centre)}
              >
                {/* Top Row: Mandi Name + Subtle Recommendation Badge */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.mandiName}>
                    🏪 {details.hindiName}
                  </Text>

                  {centre.recommended && (
                    <Badge label="⭐ हमारी सलाह" variant="gold" size="sm" />
                  )}
                </View>

                {/* Location & Distance */}
                <Text style={styles.locationText}>
                  📍 {details.location}
                </Text>

                {/* Waiting Time & Crowd Status Pill */}
                <View style={{ marginVertical: SPACING.xs }}>
                  <Badge
                    label={details.waitBadge}
                    variant={details.badgeVariant}
                    size="md"
                    icon={details.badgeVariant === 'success' ? 'check-circle' : 'clock-alert'}
                  />
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
                  <Button
                    title={isSelected ? 'चुनी गई ✓' : 'चुनें'}
                    size="sm"
                    variant={isSelected ? 'success' : 'outline'}
                    onPress={() => handleSelectCentre(centre)}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 6. STICKY BOTTOM ACTION BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {selectedCentre && (
          <Text style={styles.confirmationText} numberOfLines={1}>
            ✓ {getMandiDetails(selectedCentre).hindiName} चुनी गई
          </Text>
        )}

        <Button
          title="आगे: तारीख चुनें →"
          size="lg"
          variant="primary"
          fullWidth
          onPress={handleProceed}
        />
      </View>

      {/* ─── 7. EXPLAIN MODAL ─── */}
      <ExplainModal
        visible={explainModalVisible}
        centre={modalCentre}
        cropName={crop || 'गेहूं'}
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
  stepperContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  adviceBanner: {
    backgroundColor: '#FFFBEB',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: SPACING.md,
    gap: 6,
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cardsList: {
    gap: SPACING.sm,
  },
  mandiCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mandiName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
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
    color: COLORS.textSecondary,
  },
  whyLink: {
    marginTop: 3,
  },
  whyLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
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
  confirmationText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: 6,
  },
});
