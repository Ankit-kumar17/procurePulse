import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
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

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  const { nowServing, yourTokenNumber, farmersAhead, hasDelayAlert, delayMinutes, estimatedTurnTime } = queueState;

  const isMyTurn = farmersAhead === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <View style={styles.liveDot} />
            <Text style={styles.headerTitleText}>लाइव टोकन व कतार</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.voiceBtn} onPress={handlePlayVoiceGuide} activeOpacity={0.8}>
              <MaterialCommunityIcons name="volume-high" size={16} color={COLORS.primaryDark} />
              <Text style={styles.voiceBtnText}>सुनें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} onPress={handleCallCentre} activeOpacity={0.8}>
              <MaterialCommunityIcons name="phone" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mandi Strip */}
        <View style={styles.mandiCard}>
          <View style={styles.mandiInfo}>
            <Text style={styles.mandiNameText}>
              🏪 {activeBooking?.centre?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}
            </Text>
            <Text style={styles.mandiSubText}>
              📍 {activeBooking?.centreAddress || 'NH-46 जंक्शन, बैरसिया, भोपाल'}
            </Text>
          </View>
          <TouchableOpacity style={styles.dirBtn} onPress={handleOpenMap} activeOpacity={0.75}>
            <MaterialCommunityIcons name="directions" size={16} color={COLORS.primary} />
            <Text style={styles.dirBtnText}>रास्ता</Text>
          </TouchableOpacity>
        </View>

        {/* ─── DELAY ALERT IF ACTIVE ─── */}
        {hasDelayAlert && (
          <View style={styles.delayBanner}>
            <View style={styles.delayTop}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
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
        <View style={styles.queueHeroCard}>
          <View style={styles.queueTokensRow}>
            {/* Now Serving */}
            <View style={styles.tokenBoxServing}>
              <Text style={styles.tokenServingLabel}>🟢 अभी तौल चल रही है</Text>
              <Text style={styles.tokenServingNum}>#{nowServing}</Text>
              <Text style={styles.tokenServingSub}>कांटे पर मौजूद</Text>
            </View>

            {/* Divider */}
            <View style={styles.tokenDivider} />

            {/* Your Token */}
            <View style={styles.tokenBoxYour}>
              <Text style={styles.tokenYourLabel}>🎫 आपका टोकन</Text>
              <Text style={styles.tokenYourNum}>#{yourTokenNumber}</Text>
              <Text style={styles.tokenYourSub}>गेट पास टोकन</Text>
            </View>
          </View>

          {/* Turn status */}
          <View style={styles.turnStatusStrip}>
            {isMyTurn ? (
              <View style={styles.myTurnBox}>
                <MaterialCommunityIcons name="check-decagram" size={24} color="#15803D" />
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
        </View>

        {/* ─── 3. DEPARTURE GUIDANCE CARD ─── */}
        <View style={styles.departureCard}>
          <View style={styles.departureHeader}>
            <MaterialCommunityIcons name="tractor" size={22} color="#15803D" />
            <Text style={styles.departureTitle}>घर से निकलने का सही समय</Text>
          </View>

          <Text style={styles.departureTimeBig}>11:15 AM (लगभग {formatCountdown(secondsRemaining)} बाद)</Text>
          <Text style={styles.departureSub}>
            इस समय निकलने पर आप सीधे 11:35 AM पर कांटे पर पहुंचेंगे और बिना इंतजार तौल होगी।
          </Text>
        </View>

        {/* ─── 4. WEIGHBRIDGE FACILITY STATUS ─── */}
        <View style={styles.facilityCard}>
          <Text style={styles.facilityCardTitle}>मंडी तौल व्यवस्था (Live Updates):</Text>
          <View style={styles.facilityGrid}>
            <View style={styles.facilityItem}>
              <Text style={styles.facilityVal}>🟢 चालू (2 कांटे)</Text>
              <Text style={styles.facilityLabel}>इलेक्ट्रॉनिक वे-ब्रिज</Text>
            </View>
            <View style={styles.facilityItem}>
              <Text style={styles.facilityVal}>⚡ तेज़ (3 मिनट/नमूना)</Text>
              <Text style={styles.facilityLabel}>नमी परीक्षण लैब</Text>
            </View>
          </View>
        </View>

        {/* Advance Token Demo Button */}
        <TouchableOpacity style={styles.demoAdvanceBtn} onPress={advanceQueueToken} activeOpacity={0.7}>
          <MaterialCommunityIcons name="fast-forward" size={16} color={COLORS.primary} />
          <Text style={styles.demoAdvanceText}>टोकन आगे बढ़ाएं (Demo Test)</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  voiceBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  callBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
    gap: 12,
  },

  mandiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#DDE4EC',
  },
  mandiInfo: {
    flex: 1,
  },
  mandiNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  mandiSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  dirBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* Delay Banner */
  delayBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  delayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  delayTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B91C1C',
    flex: 1,
    marginLeft: 6,
  },
  delayDesc: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 16,
  },

  /* Queue Hero */
  queueHeroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  queueTokensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tokenBoxServing: {
    flex: 1,
    alignItems: 'center',
  },
  tokenServingLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  tokenServingNum: {
    fontSize: 34,
    fontWeight: '900',
    color: '#15803D',
    marginVertical: 2,
  },
  tokenServingSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  tokenDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  tokenBoxYour: {
    flex: 1,
    alignItems: 'center',
  },
  tokenYourLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tokenYourNum: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginVertical: 2,
  },
  tokenYourSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  turnStatusStrip: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  myTurnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  myTurnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
    flex: 1,
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
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  statMetricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statMetricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#CBD5E1',
  },

  /* Departure Card */
  departureCard: {
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
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
