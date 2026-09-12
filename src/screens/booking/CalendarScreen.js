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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';

export default function CalendarScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre } = route.params || {};
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState('2026-04-18');

  const daysInMonth = [
    { day: 14, dateStr: '2026-04-14', weekday: 'मंगल', status: 'full', color: '#B91C1C', bg: '#FEE2E2', slots: 0 },
    { day: 15, dateStr: '2026-04-15', weekday: 'बुध', status: 'full', color: '#B91C1C', bg: '#FEE2E2', slots: 0 },
    { day: 16, dateStr: '2026-04-16', weekday: 'गुरु', status: 'filling', color: '#B45309', bg: '#FEF3C7', slots: 4 },
    { day: 17, dateStr: '2026-04-17', weekday: 'शुक्र', status: 'filling', color: '#B45309', bg: '#FEF3C7', slots: 6 },
    { day: 18, dateStr: '2026-04-18', weekday: 'शनि', status: 'available', color: '#15803D', bg: '#DCFCE7', slots: 48, optimal: true },
    { day: 19, dateStr: '2026-04-19', weekday: 'रवि', status: 'filling', color: '#B45309', bg: '#FEF3C7', slots: 12 },
    { day: 20, dateStr: '2026-04-20', weekday: 'सोम', status: 'full', color: '#B91C1C', bg: '#FEE2E2', slots: 0 },
    { day: 21, dateStr: '2026-04-21', weekday: 'मंगल', status: 'available', color: '#15803D', bg: '#DCFCE7', slots: 35 },
    { day: 22, dateStr: '2026-04-22', weekday: 'बुध', status: 'available', color: '#15803D', bg: '#DCFCE7', slots: 40 },
    { day: 23, dateStr: '2026-04-23', weekday: 'गुरु', status: 'filling', color: '#B45309', bg: '#FEF3C7', slots: 15 },
    { day: 24, dateStr: '2026-04-24', weekday: 'शुक्र', status: 'available', color: '#15803D', bg: '#DCFCE7', slots: 50 },
    { day: 25, dateStr: '2026-04-25', weekday: 'शनि', status: 'available', color: '#15803D', bg: '#DCFCE7', slots: 32 },
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
            <Text style={styles.headerTitleText}>तारीख चुनें</Text>
            <Text style={styles.headerSubText}>चरण 3 / 4 • मंडी आने की तारीख</Text>
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
          <Text style={styles.stepActive}>● समय</Text>
          <Text style={styles.stepArrow}>→</Text>
          <Text style={styles.stepFuture}>○ पक्का</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Mandi Reminder Strip */}
        <View style={styles.mandiReminderBox}>
          <MaterialCommunityIcons name="storefront" size={16} color={COLORS.primary} />
          <Text style={styles.mandiReminderText} numberOfLines={1}>
            मंडी: <Text style={{ fontWeight: '800' }}>{centre?.name?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}</Text>
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#15803D' }]} />
            <Text style={styles.legendText}>खाली (उपलब्ध)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#B45309' }]} />
            <Text style={styles.legendText}>भर रही है</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#B91C1C' }]} />
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
          ✓ {selectedDayObj.day} अप्रैल ({selectedDayObj.weekday}) • {selectedDayObj.slots} स्लॉट उपलब्ध
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaButtonText}>आगे: समय स्लॉट चुनें →</Text>
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
  },

  mandiReminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    marginBottom: 10,
  },
  mandiReminderText: {
    fontSize: 12,
    color: COLORS.text,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  monthHeader: {
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },

  /* Calendar Grid */
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCard: {
    width: '31.5%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dayCardSelected: {
    borderColor: '#15803D',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  dayCardFull: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
  },
  weekdayText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  weekdayTextSelected: {
    color: '#15803D',
    fontWeight: '800',
  },
  dayNumText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 2,
  },
  dayNumTextSelected: {
    color: '#15803D',
  },
  slotBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
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
