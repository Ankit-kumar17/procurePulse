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

export default function CalendarScreen({ route, navigation }) {
  const { crop, variety, season, land, quantity, centre } = route.params || {};

  // Mock April 2026 Calendar Grid with availability color-coding
  const [selectedDate, setSelectedDate] = useState('2026-04-18');

  const daysInMonth = [
    { day: 14, dateStr: '2026-04-14', weekday: 'Tue', status: 'full', color: COLORS.error, slots: 0 },
    { day: 15, dateStr: '2026-04-15', weekday: 'Wed', status: 'full', color: COLORS.error, slots: 0 },
    { day: 16, dateStr: '2026-04-16', weekday: 'Thu', status: 'filling', color: COLORS.warning, slots: 4 },
    { day: 17, dateStr: '2026-04-17', weekday: 'Fri', status: 'filling', color: COLORS.warning, slots: 6 },
    { day: 18, dateStr: '2026-04-18', weekday: 'Sat', status: 'available', color: COLORS.success, slots: 48, optimal: true },
    { day: 19, dateStr: '2026-04-19', weekday: 'Sun', status: 'filling', color: COLORS.warning, slots: 12 },
    { day: 20, dateStr: '2026-04-20', weekday: 'Mon', status: 'full', color: COLORS.error, slots: 0 },
    { day: 21, dateStr: '2026-04-21', weekday: 'Tue', status: 'available', color: COLORS.success, slots: 35 },
    { day: 22, dateStr: '2026-04-22', weekday: 'Wed', status: 'available', color: COLORS.success, slots: 40 },
    { day: 23, dateStr: '2026-04-23', weekday: 'Thu', status: 'filling', color: COLORS.warning, slots: 15 },
    { day: 24, dateStr: '2026-04-24', weekday: 'Fri', status: 'available', color: COLORS.success, slots: 50 },
    { day: 25, dateStr: '2026-04-25', weekday: 'Sat', status: 'available', color: COLORS.success, slots: 32 },
  ];

  const selectedDayObj = daysInMonth.find((d) => d.dateStr === selectedDate) || daysInMonth[4];

  const handleNext = () => {
    if (selectedDayObj.status === 'full') {
      Alert.alert('Date Fully Booked', 'Please choose a date with available slots (Green or Amber).');
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
      dateFormatted: `Saturday, 18 April 2026`,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Select Date"
        subtitle="Step 3 of 4: Month Availability View"
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Wizard Step Indicator */}
      <View style={styles.wizardBar}>
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>✓</Text>
          <Text style={styles.wizardStepText}>Land</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={styles.wizardStep}>
          <Text style={styles.wizardStepNum}>✓</Text>
          <Text style={styles.wizardStepText}>Centre</Text>
        </View>
        <View style={styles.wizardLine} />
        <View style={[styles.wizardStep, styles.wizardStepActive]}>
          <Text style={styles.wizardStepNumActive}>3</Text>
          <Text style={styles.wizardStepTextActive}>Date & Slot</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selected Centre Summary Pill */}
        <View style={styles.centrePill}>
          <MaterialCommunityIcons name="storefront" size={20} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pillTitle} numberOfLines={1}>{centre?.name || 'Berasia Procurement Hub'}</Text>
            <Text style={styles.pillSub}>{centre?.distance || 8.4} km away • {centre?.wait || 41}m wait</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendLabel}>Available (&gt;20 slots)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendLabel}>Filling Fast (&lt;15 slots)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendLabel}>Full / Holiday</Text>
          </View>
        </View>

        {/* Month Calendar Card */}
        <Card title="April 2026 / अप्रैल 2026" icon="calendar-month" iconColor={COLORS.primary}>
          <Text style={styles.instructionText}>
            Select an optimal date. Green dates offer fastest intake & minimal truck queue.
          </Text>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              const isFull = item.status === 'full';

              return (
                <TouchableOpacity
                  key={item.dateStr}
                  style={[
                    styles.dayBox,
                    isSelected && styles.dayBoxSelected,
                    isFull && styles.dayBoxFull,
                  ]}
                  onPress={() => setSelectedDate(item.dateStr)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.weekdayText, isSelected && styles.textSelected]}>
                    {item.weekday}
                  </Text>
                  <Text style={[styles.dayNum, isSelected && styles.textSelected]}>
                    {item.day}
                  </Text>
                  <View style={[styles.statusPill, { backgroundColor: item.color }]}>
                    <Text style={styles.statusPillText}>
                      {isFull ? 'FULL' : `${item.slots} left`}
                    </Text>
                  </View>
                  {item.optimal && (
                    <View style={styles.optimalStar}>
                      <MaterialCommunityIcons name="star-circle" size={14} color={COLORS.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Selected Date Summary Card */}
        <Card
          title={`Selected Date: ${selectedDayObj.day} April 2026 (${selectedDayObj.weekday})`}
          icon="calendar-check"
          iconColor={COLORS.primary}
          badge={selectedDayObj.status.toUpperCase()}
          badgeColor={selectedDayObj.color}
        >
          <View style={styles.dateSummaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.sumLabel}>Available Capacity</Text>
              <Text style={[styles.sumVal, { color: selectedDayObj.color }]}>
                {selectedDayObj.slots} Slot Tokens
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.sumLabel}>Predicted Weather</Text>
              <Text style={styles.sumVal}>☀️ Clear & Sunny (32°C)</Text>
            </View>
          </View>

          {selectedDayObj.optimal && (
            <View style={styles.optimalAdviceBox}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={COLORS.accentDark} />
              <Text style={styles.optimalAdviceText}>
                <Text style={{ fontWeight: '700' }}>AI Insight: </Text>
                Saturday 18th April has 3 digital scales operational with minimum backlog.
              </Text>
            </View>
          )}
        </Card>

        <Button
          title="Proceed to Time Slot"
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
  centrePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    ...SHADOWS.sm,
  },
  pillTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  pillSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dayBox: {
    width: '23%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: 'relative',
  },
  dayBoxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  dayBoxFull: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
    opacity: 0.65,
  },
  weekdayText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 2,
  },
  textSelected: {
    color: COLORS.white,
  },
  statusPill: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusPillText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
  },
  optimalStar: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  dateSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: {},
  sumLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sumVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  optimalAdviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '44',
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 8,
    marginTop: SPACING.xs,
  },
  optimalAdviceText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 15,
  },
});
