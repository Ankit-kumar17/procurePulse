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

export default function TimeSlotScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre, date, dateFormatted } = route.params || {};
  const { bookSlot } = useFarmer();
  const [loading, setLoading] = useState(false);

  const slots = [
    {
      id: 's1',
      timeRange: '09:00 AM - 10:00 AM',
      period: 'Morning Band',
      available: 5,
      total: 20,
      congestion: 'Moderate',
      recommendedArrival: '09:35 AM - 09:50 AM',
      recommended: false,
    },
    {
      id: 's2',
      timeRange: '10:00 AM - 11:00 AM',
      period: 'Morning Band',
      available: 3,
      total: 20,
      congestion: 'Heavy',
      recommendedArrival: '10:35 AM - 10:50 AM',
      recommended: false,
    },
    {
      id: 's3',
      timeRange: '11:00 AM - 12:00 PM',
      period: 'Optimal Morning',
      available: 8,
      total: 20,
      congestion: 'Optimal Flow',
      recommendedArrival: '11:35 AM - 11:50 AM',
      recommended: true,
      reason: 'Fastest moisture turnaround & zero queue bottleneck'
    },
    {
      id: 's4',
      timeRange: '12:00 PM - 01:00 PM',
      period: 'Noon Band',
      available: 2,
      total: 20,
      congestion: 'Heavy',
      recommendedArrival: '12:35 PM - 12:50 PM',
      recommended: false,
    },
    {
      id: 's5',
      timeRange: '02:00 PM - 03:00 PM',
      period: 'Afternoon Band',
      available: 12,
      total: 20,
      congestion: 'Optimal Flow',
      recommendedArrival: '02:35 PM - 02:50 PM',
      recommended: false,
    },
    {
      id: 's6',
      timeRange: '03:00 PM - 04:00 PM',
      period: 'Afternoon Band',
      available: 6,
      total: 20,
      congestion: 'Moderate',
      recommendedArrival: '03:35 PM - 03:50 PM',
      recommended: false,
    }
  ];

  const [selectedSlot, setSelectedSlot] = useState(slots[2]); // Default 11:00-12:00

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Select Slot', 'Please select an arrival time slot.');
      return;
    }

    setLoading(true);
    const bookingPayload = {
      centreId: centre?.id || 2,
      centreName: centre?.name || 'Berasia Cooperative Procurement Hub (Centre B)',
      centreAddress: centre?.address || 'Near NH-46 Junction, Berasia Hub',
      date: date || '2026-04-18',
      timeSlot: selectedSlot.timeRange,
      crop: `${crop || 'Wheat'} (${variety || 'Sharbati'})`,
      landKhasra: `${land?.khasra || '123/1'} (${land?.village || 'Pipariya'})`,
      quantity: quantity || '2000 kg',
      recommendedArrival: selectedSlot.recommendedArrival,
    };

    const result = await bookSlot(bookingPayload);
    setLoading(false);

    if (result.success) {
      navigation.replace('BookingConfirmation', {
        booking: result.booking,
      });
    } else {
      Alert.alert('Booking Error', result.error || 'Failed to confirm booking.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Select Time Slot"
        subtitle="Step 4 of 4: Dynamic Arrival Window"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Context Pill */}
        <View style={styles.contextPill}>
          <View style={styles.contextItem}>
            <MaterialCommunityIcons name="calendar-range" size={18} color={COLORS.primary} />
            <Text style={styles.contextText}>{date || '2026-04-18'}</Text>
          </View>
          <View style={styles.contextDivider} />
          <View style={styles.contextItem}>
            <MaterialCommunityIcons name="storefront" size={18} color={COLORS.primary} />
            <Text style={styles.contextText} numberOfLines={1}>{centre?.name?.split('(')[0] || 'Centre B'}</Text>
          </View>
        </View>

        {/* Dynamic Arrival Explanation Callout */}
        <View style={styles.arrivalCallout}>
          <MaterialCommunityIcons name="timer-sand" size={24} color={COLORS.primaryDark} />
          <View style={{ flex: 1 }}>
            <Text style={styles.arrivalCalloutTitle}>Dynamic Slot Dispatch</Text>
            <Text style={styles.arrivalCalloutDesc}>
              Each 1-hour slot assigns you a strict 15-minute Dynamic Arrival Window to guarantee immediate weighbridge access.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Available Hourly Slots</Text>

        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isOptimal = slot.congestion === 'Optimal Flow';

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                slot.recommended && styles.slotCardRecommended,
              ]}
              onPress={() => setSelectedSlot(slot)}
              activeOpacity={0.8}
            >
              <View style={styles.slotTopRow}>
                <View style={styles.slotTimeBox}>
                  <Text style={[styles.slotTimeText, isSelected && styles.textPrimary]}>
                    {slot.timeRange}
                  </Text>
                  <Text style={styles.slotPeriod}>{slot.period}</Text>
                </View>

                <View style={styles.slotBadges}>
                  <Badge
                    label={`${slot.available} / ${slot.total} Tokens`}
                    variant={isOptimal ? 'success' : 'warning'}
                    size="sm"
                  />
                  {slot.recommended && (
                    <Badge label="AI Pick" variant="gold" size="sm" icon="star" />
                  )}
                </View>
              </View>

              <View style={styles.windowStrip}>
                <MaterialCommunityIcons name="clock-check-outline" size={16} color={COLORS.accentDark} />
                <Text style={styles.windowText}>
                  Arrival Window: <Text style={{ fontWeight: '700' }}>{slot.recommendedArrival}</Text>
                </Text>
              </View>

              {slot.reason && (
                <Text style={styles.slotReasonText}>💡 {slot.reason}</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Summary before confirm */}
        <Card title="Appointment Summary" icon="receipt" iconColor={COLORS.primary} style={{ marginTop: SPACING.sm }}>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Procurement Centre</Text>
            <Text style={styles.sumVal}>{centre?.name || 'Centre B'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Date & Time</Text>
            <Text style={styles.sumVal}>{date} • {selectedSlot?.timeRange}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Recommended Gate Arrival</Text>
            <Text style={[styles.sumVal, { color: COLORS.accentDark, fontWeight: '800' }]}>
              {selectedSlot?.recommendedArrival}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Crop & Entitlement</Text>
            <Text style={styles.sumVal}>{quantity || '2000 kg'} ({crop || 'Wheat'})</Text>
          </View>
        </Card>

        <Button
          title="Confirm Slot & Generate Gate Pass"
          variant="gold"
          size="lg"
          icon="check-decagram"
          loading={loading}
          onPress={handleConfirmBooking}
          style={{ marginTop: SPACING.md }}
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  contextDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  contextText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  arrivalCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.infoLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.25)',
    gap: 10,
    marginBottom: SPACING.md,
  },
  arrivalCalloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  arrivalCalloutDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  slotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  slotCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#FCFAF5',
  },
  slotCardRecommended: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTimeBox: {},
  slotTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  slotPeriod: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  textPrimary: {
    color: COLORS.primary,
  },
  slotBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  windowStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: SPACING.sm,
    gap: 6,
  },
  windowText: {
    fontSize: 12,
    color: COLORS.text,
  },
  slotReasonText: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sumLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sumVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    maxWidth: '60%',
  },
});
