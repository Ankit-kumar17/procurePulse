import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useFarmer } from '../../context/FarmerContext';

export default function LiveQueueScreen({ navigation }) {
  const { bookings, queueState, triggerManualDelayAlert, advanceQueueToken } = useFarmer();
  const activeBooking = bookings.find((b) => b.status === 'BOOKED') || bookings[0];

  const [secondsRemaining, setSecondsRemaining] = useState(1320); // 22 minutes
  const [tickerCount, setTickerCount] = useState(0);

  // Auto-delay alert after 30 seconds as specified in PRD 7.6
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      triggerManualDelayAlert(true);
    }, 30000);

    return () => clearTimeout(delayTimer);
  }, []);

  // 10-second ticker to advance queue or simulate real-time live movements
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerCount((prev) => prev + 1);
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleCallCentre = () => {
    Alert.alert('Calling Mandi Desk', 'Connecting to Berasia Procurement Hub Helpline: +91 755 2891043');
  };

  const handleOpenMap = () => {
    Alert.alert('Mandi Navigation', 'Opening GPS routing to Berasia Cooperative Procurement Hub.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Live Mandi Queue & Gate Pass"
        subtitle={`Active Token: ${activeBooking?.token || 'MP-WHT-2026-0001'}`}
        rightIcon="phone"
        onRightPress={handleCallCentre}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Centre Bar */}
        <View style={styles.centreHeaderBar}>
          <View style={styles.centreIconBox}>
            <MaterialCommunityIcons name="storefront" size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.centreNameText}>{activeBooking?.centre || 'Berasia Procurement Hub'}</Text>
            <Text style={styles.centreLocText}>{activeBooking?.centreAddress || 'Near NH-46 Junction, Berasia'}</Text>
          </View>
          <Badge label="Live Ticker" variant="success" size="sm" icon="record-circle" />
        </View>

        {/* Dynamic Delay Alert Card (Simulated after 30s or manually triggered) */}
        {queueState.hasDelayAlert ? (
          <View style={styles.delayAlertCard}>
            <View style={styles.delayHeaderRow}>
              <MaterialCommunityIcons name="alert-octagon" size={28} color={COLORS.error} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.delayTitle}>DYNAMIC DELAY ALERT / विलंब चेतावनी</Text>
                <Text style={styles.delayTimestamp}>Triggered: Just Now (Moisture Testing Queue Spike)</Text>
              </View>
              <TouchableOpacity onPress={() => triggerManualDelayAlert(false)} style={styles.dismissBtn}>
                <MaterialCommunityIcons name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.delayDetailBox}>
              <Text style={styles.delayMessage}>
                ⚠️ <Text style={{ fontWeight: '800' }}>Centre delayed by {queueState.delayMinutes} mins.</Text>
                {'\n'}Revised Turn ETA: <Text style={{ fontWeight: '800', color: COLORS.error }}>{queueState.newETA}</Text>.
                {'\n'}Please delay your home tractor departure. DO NOT LEAVE YET.
              </Text>
            </View>

            <View style={styles.delayActionRow}>
              <Button
                title="Acknowledge Delay & Update ETA"
                variant="danger"
                size="sm"
                icon="check"
                onPress={() => Alert.alert('Updated', 'Your departure advisory has been recalibrated to 12:05 PM.')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          /* Recommended Departure Countdown Card */
          <Card goldBorder style={styles.departureCard}>
            <View style={styles.departureTopRow}>
              <View style={styles.departureLeft}>
                <Text style={styles.departureSub}>RECOMMENDED DEPARTURE ADVISORY</Text>
                <Text style={styles.departureTime}>Leave home by {activeBooking?.recommendedDeparture || '11:15 AM'}</Text>
                <Text style={styles.departureDesc}>
                  Calculated based on 8.4 km transit time & live gate entry pace.
                </Text>
              </View>

              <View style={styles.countdownCircle}>
                <Text style={styles.countdownVal}>{formatCountdown(secondsRemaining)}</Text>
                <Text style={styles.countdownLabel}>Time to Leave</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Live Queue Status Numbers */}
        <Card title="Live Queue Status" subtitle="Real-time automated weighbridge feeder" icon="radar" iconColor={COLORS.primary}>
          <View style={styles.queueMetricsRow}>
            <View style={[styles.queueMetricBox, { backgroundColor: '#F1F5F9' }]}>
              <Text style={styles.queueBoxLabel}>NOW SERVING</Text>
              <Text style={styles.queueBoxLargeNum}>#{queueState.nowServing}</Text>
              <Text style={styles.queueBoxSub}>Tractor at Scale</Text>
            </View>

            <View style={styles.queueArrowBox}>
              <MaterialCommunityIcons name="chevron-double-right" size={26} color={COLORS.accentDark} />
            </View>

            <View style={[styles.queueMetricBox, { backgroundColor: COLORS.primaryDark }]}>
              <Text style={[styles.queueBoxLabel, { color: COLORS.accentLight }]}>YOUR TOKEN</Text>
              <Text style={[styles.queueBoxLargeNum, { color: COLORS.white }]}>#{queueState.yourTokenNumber}</Text>
              <Text style={[styles.queueBoxSub, { color: 'rgba(255,255,255,0.7)' }]}>Token Token 19</Text>
            </View>
          </View>

          <View style={styles.queueStatsStrip}>
            <View style={styles.queueStatCol}>
              <MaterialCommunityIcons name="account-group" size={20} color={COLORS.primary} />
              <Text style={styles.queueStatVal}>{queueState.farmersAhead} Farmers</Text>
              <Text style={styles.queueStatLabel}>Ahead of You</Text>
            </View>

            <View style={styles.queueDivider} />

            <View style={styles.queueStatCol}>
              <MaterialCommunityIcons name="clock-check" size={20} color={COLORS.success} />
              <Text style={[styles.queueStatVal, { color: COLORS.success }]}>
                {queueState.hasDelayAlert ? queueState.newETA : queueState.estimatedTurnTime}
              </Text>
              <Text style={styles.queueStatLabel}>Estimated Turn</Text>
            </View>

            <View style={styles.queueDivider} />

            <View style={styles.queueStatCol}>
              <MaterialCommunityIcons name="scale-bathroom" size={20} color={COLORS.info} />
              <Text style={styles.queueStatVal}>3 Scales</Text>
              <Text style={styles.queueStatLabel}>Operational</Text>
            </View>
          </View>
        </Card>

        {/* Centre Facilities & Location Card */}
        <Card title="Procurement Hub Facilities" icon="map-marker-radius" iconColor={COLORS.primary}>
          <View style={styles.facilityList}>
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.facilityText}>Moisture Lab (Fast Turnaround)</Text>
            </View>
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.facilityText}>Dual Electronic Weighbridge</Text>
            </View>
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.facilityText}>Farmer Rest Shed & RO Water</Text>
            </View>
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.facilityText}>On-site DBT Grievance Desk</Text>
            </View>
          </View>

          <View style={styles.centreActionRow}>
            <Button
              title="Get GPS Directions"
              variant="outline"
              size="sm"
              icon="directions"
              onPress={handleOpenMap}
              style={{ flex: 1 }}
            />
            <Button
              title="Call Centre Officer"
              variant="primary"
              size="sm"
              icon="phone"
              onPress={handleCallCentre}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* SIH 2026 Interactive Simulation Controller Box */}
        <View style={styles.simControlCard}>
          <View style={styles.simHeader}>
            <MaterialCommunityIcons name="tune-vertical" size={20} color={COLORS.primaryDark} />
            <Text style={styles.simTitle}>SIH 2026 Judge Simulation Controls</Text>
          </View>
          <Text style={styles.simDesc}>
            Test live queue dynamics and sudden mandi bottlenecks instantly:
          </Text>

          <View style={styles.simBtnRow}>
            <Button
              title={queueState.hasDelayAlert ? 'Reset Delay' : 'Simulate 47m Bottleneck'}
              variant={queueState.hasDelayAlert ? 'outline' : 'danger'}
              size="sm"
              icon="alert-circle"
              onPress={() => triggerManualDelayAlert(!queueState.hasDelayAlert)}
              style={{ flex: 1 }}
            />
            <Button
              title="Advance Queue (+1)"
              variant="gold"
              size="sm"
              icon="skip-next"
              onPress={advanceQueueToken}
              style={{ flex: 1 }}
            />
          </View>
        </View>
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
  centreHeaderBar: {
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
  centreIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centreNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  centreLocText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  departureCard: {
    marginBottom: SPACING.md,
  },
  departureTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  departureLeft: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  departureSub: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.5,
  },
  departureTime: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  departureDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },
  countdownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  countdownVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
  },
  countdownLabel: {
    fontSize: 9,
    color: COLORS.white,
    marginTop: 2,
  },
  delayAlertCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: COLORS.error,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  delayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  delayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.error,
  },
  delayTimestamp: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  dismissBtn: {
    padding: 4,
  },
  delayDetailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginVertical: SPACING.xs,
  },
  delayMessage: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 18,
  },
  delayActionRow: {
    marginTop: SPACING.sm,
  },
  queueMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  queueMetricBox: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  queueBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  queueBoxLargeNum: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 4,
  },
  queueBoxSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  queueArrowBox: {
    paddingHorizontal: 8,
  },
  queueStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  queueStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  queueStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 3,
  },
  queueStatLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  queueDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  facilityList: {
    gap: 6,
    marginBottom: SPACING.md,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  facilityText: {
    fontSize: 12,
    color: COLORS.text,
  },
  centreActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  simControlCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  simTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  simDesc: {
    fontSize: 11,
    color: '#15803D',
    marginBottom: SPACING.sm,
  },
  simBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
