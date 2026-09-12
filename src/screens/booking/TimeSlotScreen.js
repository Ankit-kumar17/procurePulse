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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';
import Header from '../../components/Header';
import StepIndicator from '../../components/StepIndicator';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

export default function TimeSlotScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre, date, dateFormatted } = route.params || {};
  const { bookSlot } = useFarmer();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const slots = [
    {
      id: 's1',
      timeRange: '09:00 AM - 10:00 AM',
      period: 'सुबह (Morning)',
      available: 5,
      congestion: 'मध्यम भीड़',
      color: COLORS.warning,
      bg: COLORS.warningLight,
      recommendedArrival: '09:35 AM - 09:50 AM',
      recommended: false,
    },
    {
      id: 's2',
      timeRange: '10:00 AM - 11:00 AM',
      period: 'सुबह (Morning)',
      available: 3,
      congestion: 'भारी भीड़',
      color: COLORS.error,
      bg: COLORS.errorLight,
      recommendedArrival: '10:35 AM - 10:50 AM',
      recommended: false,
    },
    {
      id: 's3',
      timeRange: '11:00 AM - 12:00 PM',
      period: 'सुबह (Optimal)',
      available: 8,
      congestion: 'कम भीड़ (फास्ट)',
      color: COLORS.success,
      bg: COLORS.successLight,
      recommendedArrival: '11:35 AM - 11:50 AM',
      recommended: true,
    },
    {
      id: 's4',
      timeRange: '12:00 PM - 01:00 PM',
      period: 'दोपहर (Noon)',
      available: 2,
      congestion: 'भारी भीड़',
      color: COLORS.error,
      bg: COLORS.errorLight,
      recommendedArrival: '12:35 PM - 12:50 PM',
      recommended: false,
    },
    {
      id: 's5',
      timeRange: '02:00 PM - 03:00 PM',
      period: 'दोपहर (Afternoon)',
      available: 12,
      congestion: 'कम भीड़ (फास्ट)',
      color: COLORS.success,
      bg: COLORS.successLight,
      recommendedArrival: '02:35 PM - 02:50 PM',
      recommended: false,
    },
    {
      id: 's6',
      timeRange: '03:00 PM - 04:00 PM',
      period: 'शाम (Evening)',
      available: 6,
      congestion: 'मध्यम भीड़',
      color: COLORS.warning,
      bg: COLORS.warningLight,
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
      centreName: centre?.name || 'Berasia Cooperative Procurement Hub',
      centreAddress: centre?.address || 'Near NH-46 Junction, Berasia Hub',
      date: date || '2026-04-18',
      timeSlot: selectedSlot.timeRange,
      crop: crop || 'Wheat (Sharbati)',
      landKhasra: land?.khasra || '123/1',
      quantity: quantity || '2000 kg',
      recommendedArrival: selectedSlot.recommendedArrival,
    };

    const result = await bookSlot(bookingPayload);
    setLoading(false);

    if (result.success) {
      navigation.navigate('BookingConfirmation', {
        booking: result.booking,
      });
    } else {
      Alert.alert('त्रुटि', 'स्लॉट बुक नहीं हो सका। कृपया पुनः प्रयास करें।');
    }
  };

  const bookingSteps = ['फसल व खेत', 'मंडी चुनें', 'तारीख व समय', 'पुष्टि'];

  return (
    <View style={styles.container}>
      {/* ─── 1. HEADER ─── */}
      <Header
        title="समय स्लॉट चुनें"
        subtitle="चरण 4 / 4 • तौल का समय"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* ─── 2. PROGRESS STEPPER ─── */}
      <StepIndicator steps={bookingSteps} currentStep={4} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Summary Strip */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="calendar" size={16} color={COLORS.primary} />
            <Text style={styles.summaryText}>{dateFormatted || '18 अप्रैल (शनि)'}</Text>
          </View>
          <Text style={styles.summaryDot}>•</Text>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="storefront" size={16} color={COLORS.primary} />
            <Text style={styles.summaryText} numberOfLines={1}>{centre?.name?.split('(')[0] || 'बैरसिया केंद्र'}</Text>
          </View>
        </View>

        {/* AI Recommendation Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerRow}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS.accentDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI सलाह: 11:00 AM – 12:00 PM सबसे उपयुक्त है</Text>
              <Text style={styles.aiDesc}>इस समय केंद्र पर तुलाई सबसे तेज होती है और औसत प्रतीक्षा समय सिर्फ 15 मिनट है।</Text>
            </View>
          </View>
        </View>

        {/* Slot Cards List */}
        <View style={styles.slotsList}>
          {slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;

            return (
              <TouchableOpacity
                key={slot.id}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.88}
              >
                <Card
                  selected={isSelected}
                  style={styles.slotCard}
                >
                  <View style={styles.slotHeaderRow}>
                    <View style={styles.slotTimeBox}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={20}
                        color={isSelected ? COLORS.primary : COLORS.text}
                      />
                      <Text style={[styles.slotTimeText, isSelected && styles.slotTimeTextSelected]}>
                        {slot.timeRange}
                      </Text>
                    </View>

                    <Badge
                      label={slot.congestion}
                      variant={slot.color === COLORS.success ? 'success' : slot.color === COLORS.warning ? 'warning' : 'error'}
                    />
                  </View>

                  <View style={styles.slotDivider} />

                  <View style={styles.slotFooterRow}>
                    <View style={styles.arrivalBox}>
                      <Text style={styles.arrivalLabel}>अनुशंसित आगमन समय:</Text>
                      <Text style={styles.arrivalVal}>{slot.recommendedArrival}</Text>
                    </View>

                    <View style={[styles.availPill, { backgroundColor: slot.bg }]}>
                      <Text style={[styles.availText, { color: slot.color }]}>
                        {slot.available} स्लॉट खाली
                      </Text>
                    </View>
                  </View>

                  {slot.recommended && (
                    <View style={styles.optimalRibbon}>
                      <MaterialCommunityIcons name="star" size={13} color={COLORS.accentDark} />
                      <Text style={styles.optimalText}>सबसे तेज तुलाई (Fast Weighing)</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── STICKY BOTTOM CONFIRM BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.selectedPillRow}>
          <Text style={styles.selectedPillText}>
            चयनित समय: <Text style={{ fontWeight: '900', color: COLORS.primary }}>{selectedSlot?.timeRange}</Text>
          </Text>
        </View>

        <Button
          title="स्लॉट बुक करें व टोकन पाएं →"
          variant="primary"
          size="lg"
          icon="check-circle"
          loading={loading}
          fullWidth
          onPress={handleConfirmBooking}
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
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.sm + 2,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  summaryDot: {
    marginHorizontal: 8,
    color: COLORS.textMuted,
  },
  summaryText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.text,
  },
  aiBanner: {
    backgroundColor: COLORS.accentLight,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F8E4A0',
  },
  aiBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.accentDark,
  },
  aiDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  slotsList: {
    gap: SPACING.sm + 2,
  },
  slotCard: {
    padding: SPACING.md,
    overflow: 'hidden',
  },
  slotHeaderRow: {
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
    ...TYPOGRAPHY.title,
    fontSize: 16,
    color: COLORS.text,
  },
  slotTimeTextSelected: {
    color: COLORS.primary,
  },
  slotDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  slotFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrivalBox: {
    flex: 1,
  },
  arrivalLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  arrivalVal: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.text,
    marginTop: 1,
  },
  availPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  availText: {
    fontSize: 11,
    fontWeight: '800',
  },
  optimalRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
  },
  optimalText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingTop: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  selectedPillRow: {
    marginBottom: SPACING.xs,
    alignItems: 'center',
  },
  selectedPillText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});
