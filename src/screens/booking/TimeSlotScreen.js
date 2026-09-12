import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';

export default function TimeSlotScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre, date, dateFormatted } = route.params || {};
  const { bookSlot } = useFarmer();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const slots = [
    {
      id: 's1',
      timeRange: '09:00 AM - 10:00 AM',
      period: 'सुबह (Morning Band)',
      available: 5,
      total: 20,
      congestion: 'मध्यम भीड़ (Moderate)',
      recommendedArrival: '09:35 AM - 09:50 AM',
      recommended: false,
    },
    {
      id: 's2',
      timeRange: '10:00 AM - 11:00 AM',
      period: 'सुबह (Morning Band)',
      available: 3,
      total: 20,
      congestion: 'भारी भीड़ (Heavy)',
      recommendedArrival: '10:35 AM - 10:50 AM',
      recommended: false,
    },
    {
      id: 's3',
      timeRange: '11:00 AM - 12:00 PM',
      period: '⭐ सबसे तेज समय (Optimal Morning)',
      available: 8,
      total: 20,
      congestion: 'कम भीड़ (Optimal Flow)',
      recommendedArrival: '11:35 AM - 11:50 AM',
      recommended: true,
      reason: 'तेज नमी परीक्षण व बिना रुकावट सीधी तौल',
    },
    {
      id: 's4',
      timeRange: '12:00 PM - 01:00 PM',
      period: 'दोपहर (Noon Band)',
      available: 2,
      total: 20,
      congestion: 'भारी भीड़ (Heavy)',
      recommendedArrival: '12:35 PM - 12:50 PM',
      recommended: false,
    },
    {
      id: 's5',
      timeRange: '02:00 PM - 03:00 PM',
      period: 'दोपहर (Afternoon Band)',
      available: 12,
      total: 20,
      congestion: 'कम भीड़ (Optimal Flow)',
      recommendedArrival: '02:35 PM - 02:50 PM',
      recommended: false,
    },
    {
      id: 's6',
      timeRange: '03:00 PM - 04:00 PM',
      period: 'शाम (Evening Band)',
      available: 6,
      total: 20,
      congestion: 'मध्यम भीड़ (Moderate)',
      recommendedArrival: '03:35 PM - 03:50 PM',
      recommended: false,
    },
  ];

  const [selectedSlot, setSelectedSlot] = useState(slots[2]); // Default 11:00-12:00

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('स्लॉट चुनें', 'कृपया मंडी आने का समय स्लॉट चुनें।');
      return;
    }

    setLoading(true);
    const bookingPayload = {
      centreId: centre?.id || 2,
      centreName: centre?.name || 'Berasia Cooperative Procurement Hub (Centre B)',
      centreAddress: centre?.address || 'Near NH-46 Junction, Berasia Hub',
      date: date || '2026-04-18',
      timeSlot: selectedSlot.timeRange,
      crop: `${crop || 'Wheat (गेहूं)'} - ${variety || 'Sharbati A-Grade'}`,
      landKhasra: `${land?.khasra || '123/1'} (${land?.village || 'Pipariya'})`,
      quantity: quantity || '2000 kg (20.0 Qtl)',
      recommendedArrival: selectedSlot.recommendedArrival,
    };

    try {
      const res = await bookSlot(bookingPayload);
      setLoading(false);

      if (res.success) {
        navigation.navigate('BookingConfirmation', {
          booking: res.booking,
        });
      } else {
        Alert.alert('त्रुटि', res.error || 'बुकिंग पूरी नहीं हो सकी। पुनः प्रयास करें।');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('त्रुटि', 'सर्वर से संपर्क नहीं हो सका।');
    }
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

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
            <Text style={styles.headerTitleText}>समय स्लॉट चुनें</Text>
            <Text style={styles.headerSubText}>चरण 3 / 4 • मंडी पहुँचने का समय</Text>
          </View>

          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="grain" size={16} color={COLORS.accent} />
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. STEPPER ─── */}
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
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <MaterialCommunityIcons name="check" size={12} color={COLORS.white} />
            </View>
            <Text style={styles.stepLabelDone}>मंडी</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.primaryLight} />

          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>3</Text>
            </View>
            <Text style={styles.stepLabelActive}>समय</Text>
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 105 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3. DATE & MANDI SUMMARY STRIP ─── */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>तारीख</Text>
            <Text style={styles.summaryVal}>📅 {dateFormatted || '18 अप्रैल 2026 (शनिवार)'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>उपार्जन केंद्र</Text>
            <Text style={styles.summaryVal} numberOfLines={1}>
              🏪 {centre?.name?.split('(')[0]?.trim() || 'Berasia Hub'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>उपलब्ध समय स्लॉट (Time Slots)</Text>

        {/* ─── 4. TIME SLOT CARDS ─── */}
        <View style={styles.slotsList}>
          {slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotCard,
                  isSelected && styles.slotCardSelected,
                  slot.recommended && !isSelected && styles.slotCardRecommended,
                ]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.88}
              >
                <View style={styles.slotCardHeader}>
                  <View style={styles.slotTimeBox}>
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.text}
                    />
                    <Text style={[styles.slotTimeText, isSelected && styles.slotTimeTextSelected]}>
                      {slot.timeRange}
                    </Text>
                  </View>

                  {slot.recommended ? (
                    <View style={styles.recommendedBadge}>
                      <MaterialCommunityIcons name="star" size={12} color={COLORS.primaryDark} />
                      <Text style={styles.recommendedBadgeText}>हमारी सलाह</Text>
                    </View>
                  ) : (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableBadgeText}>{slot.available} स्लॉट खाली</Text>
                    </View>
                  )}
                </View>

                {/* Arrival Window Strip */}
                <View style={[styles.arrivalStrip, isSelected && styles.arrivalStripSelected]}>
                  <MaterialCommunityIcons
                    name="truck-fast"
                    size={16}
                    color={isSelected ? COLORS.primaryDark : COLORS.textSecondary}
                  />
                  <Text style={[styles.arrivalText, isSelected && styles.arrivalTextSelected]}>
                    पहुंचने का समय: <Text style={{ fontWeight: '800' }}>{slot.recommendedArrival}</Text>
                  </Text>
                </View>

                {slot.reason && (
                  <Text style={styles.slotReasonText}>
                    💡 {slot.reason}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 5. STICKY BOTTOM ACTION CTA ─── */}
      <View style={[styles.bottomStickyBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[styles.ctaButton, loading && styles.ctaButtonLoading]}
          onPress={handleConfirmBooking}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.ctaButtonText}>स्लॉट पक्का करें और टोकन लें →</Text>
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

  /* ─── 3. SUMMARY BAR ─── */
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  summaryCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },

  /* ─── SECTION HEADING ─── */
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 10,
  },

  /* ─── 4. SLOTS LIST ─── */
  slotsList: {
    gap: 10,
  },
  slotCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  slotCardRecommended: {
    borderColor: '#FDE047',
  },
  slotCardSelected: {
    borderColor: COLORS.accentDark,
    backgroundColor: '#FFFDF5',
    ...SHADOWS.md,
  },
  slotCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  slotTimeTextSelected: {
    color: COLORS.primaryDark,
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
  availableBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  arrivalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    marginTop: 8,
  },
  arrivalStripSelected: {
    backgroundColor: '#FEF9C3',
  },
  arrivalText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  arrivalTextSelected: {
    color: '#854D0E',
  },
  slotReasonText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
    marginTop: 6,
  },

  /* ─── 5. STICKY CTA ─── */
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    ...SHADOWS.md,
  },
  ctaButtonLoading: {
    opacity: 0.8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
