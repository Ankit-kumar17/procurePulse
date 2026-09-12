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

  // April 2026 Calendar Grid with availability color-coding
  const [selectedDate, setSelectedDate] = useState('2026-04-18');

  const daysInMonth = [
    { day: 14, dateStr: '2026-04-14', weekday: 'मंगल', weekdayEng: 'Tue', status: 'full', color: COLORS.error, slots: 0 },
    { day: 15, dateStr: '2026-04-15', weekday: 'बुध', weekdayEng: 'Wed', status: 'full', color: COLORS.error, slots: 0 },
    { day: 16, dateStr: '2026-04-16', weekday: 'गुरु', weekdayEng: 'Thu', status: 'filling', color: COLORS.warning, slots: 4 },
    { day: 17, dateStr: '2026-04-17', weekday: 'शुक्र', weekdayEng: 'Fri', status: 'filling', color: COLORS.warning, slots: 6 },
    { day: 18, dateStr: '2026-04-18', weekday: 'शनि', weekdayEng: 'Sat', status: 'available', color: COLORS.success, slots: 48, optimal: true },
    { day: 19, dateStr: '2026-04-19', weekday: 'रवि', weekdayEng: 'Sun', status: 'filling', color: COLORS.warning, slots: 12 },
    { day: 20, dateStr: '2026-04-20', weekday: 'सोम', weekdayEng: 'Mon', status: 'full', color: COLORS.error, slots: 0 },
    { day: 21, dateStr: '2026-04-21', weekday: 'मंगल', weekdayEng: 'Tue', status: 'available', color: COLORS.success, slots: 35 },
    { day: 22, dateStr: '2026-04-22', weekday: 'बुध', weekdayEng: 'Wed', status: 'available', color: COLORS.success, slots: 40 },
    { day: 23, dateStr: '2026-04-23', weekday: 'गुरु', weekdayEng: 'Thu', status: 'filling', color: COLORS.warning, slots: 15 },
    { day: 24, dateStr: '2026-04-24', weekday: 'शुक्र', weekdayEng: 'Fri', status: 'available', color: COLORS.success, slots: 50 },
    { day: 25, dateStr: '2026-04-25', weekday: 'शनि', weekdayEng: 'Sat', status: 'available', color: COLORS.success, slots: 32 },
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
            <Text style={styles.headerTitleText}>तारीख चुनें</Text>
            <Text style={styles.headerSubText}>चरण 3 / 4 • मंडी आने की तारीख</Text>
          </View>

          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="grain" size={16} color={COLORS.accent} />
            <Text style={styles.brandBadgeText}>e-Uparjan</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. STEPPER TRACKER ─── */}
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
        {/* ─── 3. SELECTED MANDI SUMMARY PILL ─── */}
        <View style={styles.mandiSummaryPill}>
          <View style={styles.mandiIconBox}>
            <MaterialCommunityIcons name="storefront" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mandiPillTitle} numberOfLines={1}>
              🏪 {centre?.name?.split('(')[0]?.trim() || 'Berasia Cooperative Procurement Hub'}
            </Text>
            <Text style={styles.mandiPillSub}>
              📍 {centre?.distance || 8.4} km दूरी • ⏰ {centre?.wait || 41} मिनट इंतजार
            </Text>
          </View>
        </View>

        {/* ─── 4. CALENDAR MONTH CARD ─── */}
        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <View style={styles.monthTitleRow}>
              <MaterialCommunityIcons name="calendar-month" size={22} color={COLORS.primary} />
              <Text style={styles.monthTitle}>अप्रैल 2026 (April 2026)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendDotBox}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.legendText}>खाली</Text>
              </View>
              <View style={styles.legendDotBox}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.legendText}>कम</Text>
              </View>
              <View style={styles.legendDotBox}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
                <Text style={styles.legendText}>भरा</Text>
              </View>
            </View>
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              const isFull = item.status === 'full';

              return (
                <TouchableOpacity
                  key={item.dateStr}
                  style={[
                    styles.dayTile,
                    isSelected && styles.dayTileSelected,
                    isFull && styles.dayTileFull,
                  ]}
                  onPress={() => {
                    if (isFull) {
                      Alert.alert('तारीख भर चुकी है', 'इस दिन सभी स्लॉट बुक हैं। कृपया हरी या पीली तारीख चुनें।');
                    } else {
                      setSelectedDate(item.dateStr);
                    }
                  }}
                  activeOpacity={isFull ? 1 : 0.8}
                >
                  <Text style={[styles.weekdayLabel, isSelected && styles.textWhite]}>
                    {item.weekday}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.textWhite]}>
                    {item.day}
                  </Text>
                  <View style={[styles.slotsBadge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : item.color }]}>
                    <Text style={[styles.slotsBadgeText, { color: isSelected ? COLORS.white : (isFull ? COLORS.white : (item.status === 'filling' ? '#78350F' : COLORS.white)) }]}>
                      {isFull ? 'फुल' : `${item.slots}`}
                    </Text>
                  </View>
                  {item.optimal && (
                    <View style={styles.starBadge}>
                      <MaterialCommunityIcons name="star" size={10} color={COLORS.primaryDark} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── 5. DATE SUMMARY ─── */}
        <View style={styles.dateSummaryCard}>
          <View style={styles.dateSummaryHeader}>
            <MaterialCommunityIcons name="calendar-check" size={22} color={COLORS.success} />
            <Text style={styles.dateSummaryTitle}>
              {selectedDayObj.day} अप्रैल 2026, {selectedDayObj.weekday}वार
            </Text>
          </View>

          <View style={styles.dateStatsRow}>
            <View style={styles.dateStatBox}>
              <Text style={styles.dateStatLabel}>उपलब्ध स्लॉट</Text>
              <Text style={[styles.dateStatValue, { color: selectedDayObj.color }]}>
                {selectedDayObj.slots} स्लॉट खाली
              </Text>
            </View>
            <View style={styles.dateStatDivider} />
            <View style={styles.dateStatBox}>
              <Text style={styles.dateStatLabel}>मौसम</Text>
              <Text style={styles.dateStatValue}>☀️ साफ (32°C)</Text>
            </View>
          </View>

          {selectedDayObj.optimal && (
            <View style={styles.aiInsightBox}>
              <MaterialCommunityIcons name="star-outline" size={16} color={COLORS.accentDark} />
              <Text style={styles.aiInsightText}>
                <Text style={{ fontWeight: '800' }}>सलाह: </Text>
                शनिवार 18 अप्रैल को 3 डिजिटल कांटे चालू रहेंगे और तौल सबसे तेज होगी।
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─── 6. STICKY BOTTOM ACTION CTA ─── */}
      <View style={[styles.bottomStickyBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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

  /* ─── 3. MANDI PILL ─── */
  mandiSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
    ...SHADOWS.sm,
  },
  mandiIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mandiPillTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  mandiPillSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },

  /* ─── 4. CALENDAR CARD ─── */
  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  monthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDotBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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

  /* ─── DAYS GRID ─── */
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayTile: {
    width: '22.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: 'relative',
  },
  dayTileSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.md,
  },
  dayTileFull: {
    opacity: 0.5,
    backgroundColor: '#F1F5F9',
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 2,
  },
  slotsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  slotsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textWhite: {
    color: COLORS.white,
  },
  starBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ─── 5. DATE SUMMARY ─── */
  dateSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  dateSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  dateSummaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  dateStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dateStatBox: {
    flex: 1,
  },
  dateStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dateStatValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },
  dateStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  aiInsightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF9C3',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 10,
    gap: 6,
  },
  aiInsightText: {
    fontSize: 11,
    color: '#854D0E',
    flex: 1,
    lineHeight: 16,
  },

  /* ─── 6. STICKY CTA ─── */
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
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
