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
import { Header, Card, Badge, Button } from '../../components';
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
      {/* ─── 1. COMPACT FOREST GREEN HEADER ─── */}
      <Header
        title="लाइव टोकन व कतार"
        subtitle="वास्तविक समय टोकन स्थिति"
        onVoiceGuidePress={handlePlayVoiceGuide}
        rightIcon="phone"
        onRightPress={handleCallCentre}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mandi Location Strip - White Card */}
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
              <TouchableOpacity onPress={() => triggerManualDelayAlert(false)} activeOpacity={0.7}>
                <MaterialCommunityIcons name="close" size={18} color={COLORS.errorDark} />
              </TouchableOpacity>
            </View>
            <Text style={styles.delayDesc}>
              कांटे पर नमी जांच के कारण थोड़ा समय लग रहा है। कृपया घर से 15 मिनट देरी से निकलें।
            </Text>
          </View>
        )}

        {/* ─── 2. MAIN QUEUE STATUS CARD (Crisp White Card with High-Contrast Typography) ─── */}
        <Card style={styles.queueMainCard}>
          <View style={styles.tokensComparisonRow}>
            {/* Currently Serving Token */}
            <View style={styles.servingTokenCol}>
              <Badge label="तौल चल रही है" variant="success" size="sm" icon="check-circle" />
              <Text style={styles.servingTokenNum}>#{nowServing}</Text>
              <Text style={styles.servingTokenCaption}>कांटे पर मौजूद</Text>
            </View>

            {/* Vertical Divider */}
            <View style={styles.tokenVerticalDivider} />

            {/* User's Own Token (The Visual Hero) */}
            <View style={styles.userTokenCol}>
              <Badge label="⭐ आपका टोकन" variant="gold" size="sm" />
              <Text style={styles.userTokenNum}>#{yourTokenNumber}</Text>
              <Text style={styles.userTokenCaption}>गेट पास टोकन</Text>
            </View>
          </View>

          {/* Turn Status & Estimated Time Strip */}
          <View style={styles.turnStatusStrip}>
            {isMyTurn ? (
              <View style={styles.myTurnBanner}>
                <MaterialCommunityIcons name="check-decagram" size={22} color={COLORS.success} />
                <Text style={styles.myTurnText}>🎉 आपकी बारी आ गई! सीधे कांटे पर जाएं।</Text>
              </View>
            ) : (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{farmersAhead}</Text>
                  <Text style={styles.statLabel}>किसान आपसे आगे</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{estimatedTurnTime}</Text>
                  <Text style={styles.statLabel}>अनुमानित समय</Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* ─── 3. ARRIVAL RECOMMENDATION CARD (Light Neutral #F3F7F1) ─── */}
        <View style={styles.arrivalAdviceCard}>
          <View style={styles.arrivalHeader}>
            <MaterialCommunityIcons name="tractor" size={20} color={COLORS.primary} />
            <Text style={styles.arrivalTitle}>घर से निकलने का सही समय</Text>
          </View>

          <Text style={styles.arrivalTimeText}>
            11:15 AM <Text style={styles.arrivalCountdownText}>({formatCountdown(secondsRemaining)} बाद)</Text>
          </Text>

          <Text style={styles.arrivalSubText}>
            इस समय निकलने पर आप सीधे 11:35 AM पर कांटे पर पहुंचेंगे और बिना इंतजार तौल होगी।
          </Text>
        </View>

        {/* ─── 4. WEIGHBRIDGE FACILITY STATUS (White Card) ─── */}
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

        {/* Demo Advance Token Button */}
        <Button
          title="टोकन आगे बढ़ाएं (Demo Test)"
          icon="fast-forward"
          size="md"
          variant="secondary"
          onPress={advanceQueueToken}
          style={{ marginTop: SPACING.xs }}
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
    gap: SPACING.sm,
  },
  mandiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  mandiInfo: {
    flex: 1,
    marginRight: 8,
  },
  mandiNameText: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    color: COLORS.text,
  },
  mandiSubText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  delayBanner: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F7C7C7',
  },
  delayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  delayTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.errorDark,
    flex: 1,
    marginLeft: 6,
  },
  delayDesc: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.errorDark,
    lineHeight: 16,
  },

  /* ─── 2. MAIN QUEUE STATUS CARD ─── */
  queueMainCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  tokensComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xs,
  },
  servingTokenCol: {
    alignItems: 'center',
    flex: 1,
  },
  servingTokenNum: {
    ...TYPOGRAPHY.metricHero,
    fontSize: 30,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  servingTokenCaption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  tokenVerticalDivider: {
    width: 1,
    height: 64,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.sm,
  },
  userTokenCol: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.accentLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#F8E4A0',
  },
  userTokenNum: {
    ...TYPOGRAPHY.metricHero,
    fontSize: 32,
    color: COLORS.accentDark,
    marginVertical: 2,
  },
  userTokenCaption: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  turnStatusStrip: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm + 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  myTurnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#C0E2CD',
  },
  myTurnText: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.successDark,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    ...TYPOGRAPHY.metricLarge,
    fontSize: 22,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.divider,
  },

  /* ─── 3. ARRIVAL RECOMMENDATION CARD ─── */
  arrivalAdviceCard: {
    backgroundColor: '#F3F7F1',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#DDE7DD',
    ...SHADOWS.sm,
  },
  arrivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  arrivalTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.primary,
  },
  arrivalTimeText: {
    ...TYPOGRAPHY.title,
    fontSize: 18,
    color: COLORS.primaryDark,
    marginVertical: 2,
  },
  arrivalCountdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  arrivalSubText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },

  /* ─── 4. FACILITY CARD ─── */
  facilityCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  facilityCardTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
  },
  facilityGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  facilityItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  facilityLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
