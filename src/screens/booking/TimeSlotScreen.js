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
      period: 'सुबह (Morning)',
      available: 5,
      congestion: 'मध्यम भीड़',
      color: '#B45309',
      bg: '#FEF3C7',
      recommendedArrival: '09:35 AM - 09:50 AM',
      recommended: false,
    },
    {
      id: 's2',
      timeRange: '10:00 AM - 11:00 AM',
      period: 'सुबह (Morning)',
      available: 3,
      congestion: 'भारी भीड़',
      color: '#B91C1C',
      bg: '#FEE2E2',
      recommendedArrival: '10:35 AM - 10:50 AM',
      recommended: false,
    },
    {
      id: 's3',
      timeRange: '11:00 AM - 12:00 PM',
      period: 'सुबह (Optimal)',
      available: 8,
      congestion: 'कम भीड़ (फास्ट)',
      color: '#15803D',
      bg: '#DCFCE7',
      recommendedArrival: '11:35 AM - 11:50 AM',
      recommended: true,
    },
    {
      id: 's4',
      timeRange: '12:00 PM - 01:00 PM',
      period: 'दोपहर (Noon)',
      available: 2,
      congestion: 'भारी भीड़',
      color: '#B91C1C',
      bg: '#FEE2E2',
      recommendedArrival: '12:35 PM - 12:50 PM',
      recommended: false,
    },
    {
      id: 's5',
      timeRange: '02:00 PM - 03:00 PM',
      period: 'दोपहर (Afternoon)',
      available: 12,
      congestion: 'कम भीड़ (फास्ट)',
      color: '#15803D',
      bg: '#DCFCE7',
      recommendedArrival: '02:35 PM - 02:50 PM',
      recommended: false,
    },
    {
      id: 's6',
      timeRange: '03:00 PM - 04:00 PM',
      period: 'शाम (Evening)',
      available: 6,
      congestion: 'मध्यम भीड़',
      color: '#B45309',
      bg: '#FEF3C7',
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

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 6;

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
            <Text style={styles.headerTitleText}>समय स्लॉट चुनें</Text>
            <Text style={styles.headerSubText}>चरण 4 / 4 • तौल का समय</Text>
          </View>

          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. PROGRESS STEPPER ─── */}
      <View style={styles.stepperBar}>
        <View style={styles.stepperRow}>
          <Text style={styles.stepDone}>✓ फसल</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepDone}>✓ मंडी</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepDone}>✓ तारीख</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepActive}>● समय</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Reminder Card */}
        <View style={styles.reminderCard}>
          <MaterialCommunityIcons name="calendar-check" size={20} color="#15803D" />
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderDate}>{dateFormatted || '18 अप्रैल 2026 (शनिवार)'}</Text>
            <Text style={styles.reminderMandi}>{centre?.name?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>उपलब्ध समय स्लॉट (Time Slots):</Text>

        {/* Slot Grid */}
        <View style={styles.slotsGrid}>
          {slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;

            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotCard,
                  isSelected ? styles.slotCardSelected : styles.slotCardNormal,
                ]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.85}
              >
                <View style={styles.slotHeaderRow}>
                  <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                    ⏰ {slot.timeRange}
                  </Text>
                  {slot.recommended && (
                    <View style={styles.recBadge}>
                      <Text style={styles.recBadgeText}>⭐ तेज तौल</Text>
                    </View>
                  )}
                </View>

                <View style={styles.slotMetaRow}>
                  <View style={[styles.congestionPill, { backgroundColor: slot.bg }]}>
                    <Text style={[styles.congestionText, { color: slot.color }]}>
                      {slot.congestion}
                    </Text>
                  </View>
                  <Text style={styles.availableText}>{slot.available} स्लॉट बाकी</Text>
                </View>

                <View style={styles.arrivalBox}>
                  <Text style={styles.arrivalText}>
                    पहुंचने का समय: <Text style={{ fontWeight: '800' }}>{slot.recommendedArrival}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── STICKY BOTTOM BAR ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.confirmationText}>
          ✓ {selectedSlot.timeRange} चुना गया
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleConfirmBooking}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.ctaButtonText}>स्लॉट पक्का करें (Confirm) →</Text>
          )}
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
  stepArrow: {
    fontSize: 12,
    color: '#CBD5E1',
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
    gap: 12,
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reminderDate: {
    fontSize: 14,
    fontWeight: '900',
    color: '#15803D',
  },
  reminderMandi: {
    fontSize: 12,
    color: '#166534',
    marginTop: 1,
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },

  slotsGrid: {
    gap: 10,
  },
  slotCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1.5,
  },
  slotCardNormal: {
    borderColor: '#E2E8F0',
  },
  slotCardSelected: {
    borderColor: '#15803D',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    ...SHADOWS.sm,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  timeTextSelected: {
    color: '#15803D',
  },
  recBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
  },
  slotMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  congestionPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  congestionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  availableText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  arrivalBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  arrivalText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /* ─── STICKY BOTTOM BAR ─── */
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
