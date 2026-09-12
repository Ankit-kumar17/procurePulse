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
import Header from '../../components/Header';
import StepIndicator from '../../components/StepIndicator';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

export default function CalendarScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre } = route.params || {};
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState('2026-04-18');

  const daysInMonth = [
    { day: 14, dateStr: '2026-04-14', weekday: 'मंगल', status: 'full', color: COLORS.error, bg: COLORS.errorLight, slots: 0 },
    { day: 15, dateStr: '2026-04-15', weekday: 'बुध', status: 'full', color: COLORS.error, bg: COLORS.errorLight, slots: 0 },
    { day: 16, dateStr: '2026-04-16', weekday: 'गुरु', status: 'filling', color: COLORS.warning, bg: COLORS.warningLight, slots: 4 },
    { day: 17, dateStr: '2026-04-17', weekday: 'शुक्र', status: 'filling', color: COLORS.warning, bg: COLORS.warningLight, slots: 6 },
    { day: 18, dateStr: '2026-04-18', weekday: 'शनि', status: 'available', color: COLORS.success, bg: COLORS.successLight, slots: 48, optimal: true },
    { day: 19, dateStr: '2026-04-19', weekday: 'रवि', status: 'filling', color: COLORS.warning, bg: COLORS.warningLight, slots: 12 },
    { day: 20, dateStr: '2026-04-20', weekday: 'सोम', status: 'full', color: COLORS.error, bg: COLORS.errorLight, slots: 0 },
    { day: 21, dateStr: '2026-04-21', weekday: 'मंगल', status: 'available', color: COLORS.success, bg: COLORS.successLight, slots: 35 },
    { day: 22, dateStr: '2026-04-22', weekday: 'बुध', status: 'available', color: COLORS.success, bg: COLORS.successLight, slots: 40 },
    { day: 23, dateStr: '2026-04-23', weekday: 'गुरु', status: 'filling', color: COLORS.warning, bg: COLORS.warningLight, slots: 15 },
    { day: 24, dateStr: '2026-04-24', weekday: 'शुक्र', status: 'available', color: COLORS.success, bg: COLORS.successLight, slots: 50 },
    { day: 25, dateStr: '2026-04-25', weekday: 'शनि', status: 'available', color: COLORS.success, bg: COLORS.successLight, slots: 32 },
  ];

  const selectedDayObj = daysInMonth.find((d) => d.dateStr === selectedDate) || daysInMonth[4];

  const handleNext = () => {
    if (selectedDayObj.status === 'full') {
      Alert.alert('तारीख भर चुकी है', 'कृपया खाली स्लॉट वाली तारीख (हरा या पीला रंग) चुनें।');
      return;
    }

    navigation.navigate('TimeSlot', {
      crop,
      variety,
      season,
      land,
      quantity,
      centre,
      date: selectedDate,
      dateFormatted: `${selectedDayObj.day} अप्रैल 2026 (${selectedDayObj.weekday})`,
    });
  };

  const bookingSteps = ['फसल व खेत', 'मंडी चुनें', 'तारीख व समय', 'पुष्टि'];

  return (
    <View style={styles.container}>
      {/* ─── 1. HEADER ─── */}
      <Header
        title="तारीख चुनें"
        subtitle="चरण 3 / 4 • मंडी आने की तारीख"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* ─── 2. PROGRESS STEPPER ─── */}
      <StepIndicator steps={bookingSteps} currentStep={3} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Mandi Reminder Strip */}
        <View style={styles.mandiReminderBox}>
          <MaterialCommunityIcons name="storefront" size={18} color={COLORS.primary} />
          <Text style={styles.mandiReminderText} numberOfLines={1}>
            मंडी: <Text style={{ fontWeight: '800', color: COLORS.text }}>{centre?.name?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}</Text>
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>खाली (उपलब्ध)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendText}>भर रही है</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendText}>फुल (बंद)</Text>
          </View>
        </View>

        {/* Month Title */}
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>अप्रैल 2026 (April 2026)</Text>
        </View>

        {/* Date Grid */}
        <View style={styles.calendarGrid}>
          {daysInMonth.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            const isFull = item.status === 'full';

            return (
              <TouchableOpacity
                key={item.dateStr}
                style={[
                  styles.dayCard,
                  isSelected && styles.dayCardSelected,
                  isFull && styles.dayCardFull,
                ]}
                onPress={() => {
                  if (!isFull) setSelectedDate(item.dateStr);
                }}
                activeOpacity={isFull ? 1 : 0.8}
              >
                <Text style={[styles.weekdayText, isSelected && styles.weekdayTextSelected]}>
                  {item.weekday}
                </Text>
                <Text style={[styles.dayNumText, isSelected && styles.dayNumTextSelected]}>
                  {item.day}
                </Text>

                <View style={[styles.slotBadge, { backgroundColor: item.bg }]}>
                  <Text style={[styles.slotBadgeText, { color: item.color }]}>
                    {isFull ? 'फुल' : `${item.slots} स्लॉट`}
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
          {selectedDayObj.day} अप्रैल ({selectedDayObj.weekday}) • {selectedDayObj.slots} स्लॉट उपलब्ध
        </Text>

        <Button
          title="आगे: समय स्लॉट चुनें →"
          variant="primary"
          size="lg"
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
  scrollContent: {
    padding: SPACING.md,
  },
  mandiReminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  mandiReminderText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  monthHeader: {
    marginBottom: SPACING.sm,
  },
  monthTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 16,
    color: COLORS.text,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  dayCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayCardFull: {
    opacity: 0.45,
    backgroundColor: '#EAEFEA',
  },
  weekdayText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  weekdayTextSelected: {
    color: COLORS.accentLight,
  },
  dayNumText: {
    ...TYPOGRAPHY.title,
    fontSize: 22,
    color: COLORS.text,
    marginVertical: 4,
  },
  dayNumTextSelected: {
    color: COLORS.white,
  },
  slotBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginTop: 2,
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
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
  confirmationText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
});
