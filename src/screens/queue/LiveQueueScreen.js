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
import { Header, Card, Badge, Button, MetricCard, InfoRow } from '../../components';
import { useFarmer } from '../../context/FarmerContext';

export default function LiveQueueScreen({ navigation }) {
  const { bookings, queueState, triggerManualDelayAlert, advanceQueueToken } = useFarmer();
  const activeBooking = bookings.find((b) => b.status === 'BOOKED') || bookings[0];
  const insets = useSafeAreaInsets();

  const [secondsRemaining, setSecondsRemaining] = useState(1320); // 22 minutes

  // Auto-delay alert simulation
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      triggerManualDelayAlert(true);
    }, 30000);
    return () => clearTimeout(delayTimer);
  }, []);

  // 1-second ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m} मिनट ${s < 10 ? '0' : ''}${s} सेकंड`;
  };

  const handleCallCentre = () => {
    Alert.alert('📞 मंडी सहायता', 'बैरसिया उपार्जन केंद्र सहायता नंबर:\n+91 755 2891043\n\n(सुबह 8:00 से शाम 6:00)');
  };

  const handleOpenMap = () => {
    Alert.alert('🗺 रास्ता (GPS)', 'बैरसिया उपार्जन केंद्र (NH-46 जंक्शन) का नक्शा खुल रहा है...');
  };

  const handlePlayVoiceGuide = () => {
    Alert.alert(
      '🔊 लाइव कतार सहायक (Voice Guide)',
      `नमस्ते किसान भाई!\n\n• अभी टोकन #${queueState.nowServing} की तौल चल रही है।\n• आपका टोकन #${queueState.yourTokenNumber} है।\n• आपसे पहले ${queueState.farmersAhead} किसान कतार में हैं।\n• आपकी बारी लगभग ${queueState.estimatedTurnTime} बजे आएगी।`,
      [{ text: 'समझ गया (OK)' }]
    );
  };

  const { nowServing, yourTokenNumber, farmersAhead, hasDelayAlert, delayMinutes, estimatedTurnTime } = queueState;
  const isMyTurn = farmersAhead === 0;

  return (
    <View style={styles.container}>
      {/* ─── 1. HEADER ─── */}
      <Header
        title="लाइव टोकन व कतार"
        subtitle="वास्तविक समय टोकन स्थिति (Live Updates)"
        onVoiceGuidePress={handlePlayVoiceGuide}
        rightIcon="phone"
        onRightPress={handleCallCentre}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mandi Strip */}
        <Card style={styles.mandiCard}>
          <View style={styles.mandiInfo}>
            <Text style={styles.mandiNameText}>
              🏪 {activeBooking?.centre?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}
            </Text>
            <Text style={styles.mandiSubText}>
              📍 {activeBooking?.centreAddress || 'NH-46 जंक्शन, बैरसिया, भोपाल'}
            </Text>
          </View>
          <Button
            title="रास्ता"
            icon="directions"
            size="sm"
            variant="soft"
            onPress={handleOpenMap}
          />
        </Card>

        {/* ─── DELAY ALERT IF ACTIVE ─── */}
        {hasDelayAlert && (
          <View style={styles.delayBanner}>
            <View style={styles.delayTop}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.delayTitle}>मंडी में {delayMinutes} मिनट की देरी है</Text>
              <TouchableOpacity onPress={() => triggerManualDelayAlert(false)}>
                <MaterialCommunityIcons name="close" size={18} color="#991B1B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.delayDesc}>
              कांटे पर नमी जांच के कारण थोड़ा समय लग रहा है। कृपया घर से 15 मिनट देरी से निकलें।
            </Text>
          </View>
        )}

        {/* ─── 2. MAIN QUEUE STATUS HERO ─── */}
        <Card variant="hero" style={styles.queueHeroCard}>
          <View style={styles.queueTokensRow}>
            {/* Now Serving */}
            <View style={styles.tokenBoxServing}>
              <Badge label="तौल जारी है" variant="success" size="sm" icon="check-circle" />
              <Text style={styles.tokenServingNum}>#{nowServing}</Text>
              <Text style={styles.tokenServingSub}>कांटे पर मौजूद</Text>
            </View>

            {/* Divider */}
            <View style={styles.tokenDivider} />

            {/* Your Token */}
            <View style={styles.tokenBoxYour}>
              <Badge label="आपका टोकन" variant="gold" size="sm" icon="ticket-account" />
              <Text style={styles.tokenYourNum}>#{yourTokenNumber}</Text>
              <Text style={styles.tokenYourSub}>गेट पास टोकन</Text>
            </View>
          </View>

          {/* Turn status */}
          <View style={styles.turnStatusStrip}>
            {isMyTurn ? (
              <View style={styles.myTurnBox}>
                <MaterialCommunityIcons name="check-decagram" size={24} color={COLORS.success} />
                <Text style={styles.myTurnText}>🎉 आपकी बारी आ गई! सीधे कांटे पर जाएं।</Text>
              </View>
            ) : (
              <View style={styles.waitingStatusBox}>
                <View style={styles.statMetric}>
                  <Text style={styles.statMetricNum}>{farmersAhead}</Text>
                  <Text style={styles.statMetricLabel}>किसान आपसे आगे</Text>
                </View>
                <View style={styles.statMetricDivider} />
                <View style={styles.statMetric}>
                  <Text style={styles.statMetricNum}>{estimatedTurnTime}</Text>
                  <Text style={styles.statMetricLabel}>अनुमानित समय</Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* ─── 3. DEPARTURE GUIDANCE CARD ─── */}
        <Card variant="success" style={styles.departureCard}>
          <View style={styles.departureHeader}>
            <MaterialCommunityIcons name="tractor" size={22} color={COLORS.success} />
            <Text style={styles.departureTitle}>घर से निकलने का सही समय</Text>
          </View>

          <Text style={styles.departureTimeBig}>11:15 AM (लगभग {formatCountdown(secondsRemaining)} बाद)</Text>
          <Text style={styles.departureSub}>
            इस समय निकलने पर आप सीधे 11:35 AM पर कांटे पर पहुंचेंगे और बिना इंतजार तौल होगी।
          </Text>
        </Card>

        {/* ─── 4. WEIGHBRIDGE FACILITY STATUS ─── */}
        <Card style={styles.facilityCard}>
          <Text style={styles.facilityCardTitle}>मंडी तौल व्यवस्था (Live Updates):</Text>
          <View style={styles.facilityGrid}>
            <View style={styles.facilityItem}>
              <Badge label="🟢 2 कांटे चालू" variant="success" size="md" />
              <Text style={styles.facilityLabel}>इलेक्ट्रॉनिक वे-ब्रिज</Text>
            </View>
            <View style={styles.facilityItem}>
              <Badge label="⚡ 3 मिनट / नमूना" variant="info" size="md" />
              <Text style={styles.facilityLabel}>नमी परीक्षण लैब</Text>
            </View>
          </View>
        </Card>

        {/* Advance Token Demo Button */}
        <Button
          title="टोकन आगे बढ़ाएं (Demo Test)"
          icon="fast-forward"
          size="md"
          variant="outline"
          onPress={advanceQueueToken}
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
  scrollContent: {
    padding: SPACING.md,
  },
  mandiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  mandiInfo: {
    flex: 1,
    marginRight: 8,
  },
  mandiNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  mandiSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  delayBanner: {
    backgroundColor: '#FEE2E2',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: SPACING.md,
  },
  delayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  delayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
    flex: 1,
    marginLeft: 6,
  },
  delayDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F1D1D',
    lineHeight: 16,
  },
  queueHeroCard: {
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
  },
  queueTokensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
  },
  tokenBoxServing: {
    alignItems: 'center',
    flex: 1,
  },
  tokenServingNum: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginVertical: 4,
  },
  tokenServingSub: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  tokenDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.sm,
  },
  tokenBoxYour: {
    alignItems: 'center',
    flex: 1,
  },
  tokenYourNum: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.accent,
    marginVertical: 4,
  },
  tokenYourSub: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  turnStatusStrip: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  myTurnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  myTurnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  waitingStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statMetric: {
    alignItems: 'center',
  },
  statMetricNum: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
  },
  statMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statMetricDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  departureCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  departureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  departureTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
  },
  departureTimeBig: {
    fontSize: 18,
    fontWeight: '900',
    color: '#166534',
    marginVertical: 2,
  },
  departureSub: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
  },

  /* Facility Card */
  facilityCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE4EC',
  },
  facilityCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  facilityGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  facilityItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facilityVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  facilityLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  demoAdvanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  demoAdvanceText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
