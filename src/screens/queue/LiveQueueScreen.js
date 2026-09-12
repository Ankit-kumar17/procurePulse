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
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);

  // Auto-delay alert after 30 seconds as specified in PRD 7.6
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
    return `${m}म ${s < 10 ? '0' : ''}${s}से`;
  };

  const handleCallCentre = () => {
    Alert.alert('📞 मंडी हेल्पलाइन', 'Berasia Procurement Hub\n+91 755 2891043');
  };

  const handleOpenMap = () => {
    Alert.alert('🗺 रास्ता', 'GPS Navigation खुल रहा है...\nBerasia Cooperative Procurement Hub');
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  const { nowServing, yourTokenNumber, farmersAhead, hasDelayAlert, delayMinutes, newETA, estimatedTurnTime } = queueState;

  // Determine action state
  const isMyTurn = farmersAhead === 0;
  const isApproaching = farmersAhead <= 2 && !isMyTurn;

  // Farmer dots for visual queue
  const farmerDots = Array.from({ length: Math.min(farmersAhead, 6) });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── COMPACT HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoDot}>
            <MaterialCommunityIcons name="grain" size={18} color={COLORS.accent} />
          </View>
          <View>
            <Text style={styles.appName}>ProcurePulse</Text>
            <Text style={styles.appSub}>e-Uparjan 2.0 · MP</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={handleCallCentre}>
          <MaterialCommunityIcons name="phone" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Page title strip */}
      <View style={styles.pageTitleStrip}>
        <MaterialCommunityIcons name="tractor" size={20} color={COLORS.accent} />
        <Text style={styles.pageTitle}>मंडी की लाइव स्थिति</Text>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ─── 1. MANDI LOCATION ─── */}
        <View style={styles.mandiCard}>
          <View style={styles.mandiLeft}>
            <MaterialCommunityIcons name="map-marker" size={28} color={COLORS.error} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.mandiName}>
                {activeBooking?.centre?.toUpperCase() || 'BERASIA MANDI'}
              </Text>
              <Text style={styles.mandiSub}>
                {activeBooking?.centreAddress || 'Near NH-46, Berasia, Bhopal'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.dirBtn} onPress={handleOpenMap}>
            <MaterialCommunityIcons name="directions" size={20} color={COLORS.primary} />
            <Text style={styles.dirBtnText}>रास्ता देखें</Text>
          </TouchableOpacity>
        </View>

        {/* ─── 2. DELAY / STATUS ALERT ─── */}
        {hasDelayAlert ? (
          <View style={styles.delayCard}>
            {/* STOP signal */}
            <View style={styles.delayTopRow}>
              <View style={styles.stopSign}>
                <MaterialCommunityIcons name="hand-back-right" size={32} color="#fff" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.delayHeading}>मंडी में देरी है</Text>
                <Text style={styles.delayEnglish}>There is a delay at the mandi</Text>
              </View>
              <TouchableOpacity onPress={() => triggerManualDelayAlert(false)} style={styles.dismissX}>
                <MaterialCommunityIcons name="close" size={18} color="#991B1B" />
              </TouchableOpacity>
            </View>

            {/* Big delay number */}
            <View style={styles.delayTimeBox}>
              <Text style={styles.delayMinutesNum}>{delayMinutes}</Text>
              <Text style={styles.delayMinutesLabel}>मिनट की देरी</Text>
            </View>

            {/* Instruction rows */}
            <View style={styles.delayInstructionRow}>
              <MaterialCommunityIcons name="close-octagon" size={22} color="#DC2626" />
              <Text style={styles.delayInstructionText}>अभी घर से मत निकलें</Text>
            </View>

            <View style={styles.newEtaBox}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#92400E" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.newEtaLabel}>आपका नया समय</Text>
                <Text style={styles.newEtaTime}>{newETA}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.ackBtn}
              onPress={() => Alert.alert('✓ समझ गए', `आपकी नई मंडी का समय: ${newETA} है।\nतब निकलें।`)}
            >
              <Text style={styles.ackBtnText}>समय समझ गया  ✓</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ON-TIME green advisory */
          <View style={styles.onTimeCard}>
            <View style={styles.onTimeLeft}>
              <MaterialCommunityIcons name="check-circle" size={28} color={COLORS.success} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.onTimeTitle}>सब ठीक है</Text>
                <Text style={styles.onTimeSub}>No delay at mandi</Text>
              </View>
            </View>
            <View style={styles.countdownPill}>
              <Text style={styles.countdownVal}>{formatCountdown(secondsRemaining)}</Text>
              <Text style={styles.countdownLabel}>निकलने में</Text>
            </View>
          </View>
        )}

        {/* ─── 3. MY TOKEN — PRIMARY HERO ─── */}
        <View style={styles.tokenHeroCard}>
          <View style={styles.tokenHeroHeader}>
            <MaterialCommunityIcons name="ticket-confirmation" size={22} color={COLORS.accent} />
            <Text style={styles.tokenHeroLabel}>आपका टोकन</Text>
            <Text style={styles.tokenHeroLabelEn}>YOUR TOKEN</Text>
          </View>

          <Text style={styles.tokenHeroNumber}>#{yourTokenNumber}</Text>

          {/* Farmer dots visual */}
          <View style={styles.farmerDotsRow}>
            {farmerDots.map((_, i) => (
              <MaterialCommunityIcons key={i} name="account-cowboy-hat" size={26} color="#D97706" style={{ marginRight: 4 }} />
            ))}
            {farmersAhead > 6 && (
              <Text style={styles.moreFarmers}>+{farmersAhead - 6}</Text>
            )}
            {farmersAhead > 0 && (
              <MaterialCommunityIcons name="chevron-right" size={22} color={COLORS.textMuted} />
            )}
            <MaterialCommunityIcons name="tractor" size={28} color={COLORS.primary} />
          </View>

          <Text style={styles.farmersAheadText}>
            {farmersAhead === 0
              ? '🟢 आप अगले हैं!'
              : `आपसे पहले ${farmersAhead} किसान हैं`}
          </Text>
        </View>

        {/* ─── 4. LIVE QUEUE FLOW ─── */}
        <View style={styles.queueFlowCard}>
          {/* Now serving */}
          <View style={styles.queueRow}>
            <View style={[styles.queueBadge, styles.queueBadgeGreen]}>
              <View style={styles.queueGreenDot} />
              <Text style={styles.queueBadgeText}>अभी चल रहा है</Text>
            </View>
            <Text style={styles.queueTokenNum}>#{nowServing}</Text>
          </View>

          {/* Arrow */}
          <View style={styles.queueArrowWrap}>
            <View style={styles.queueArrowLine} />
            <MaterialCommunityIcons name="chevron-down" size={22} color={COLORS.textMuted} />
          </View>

          {/* Farmers between */}
          {farmersAhead > 0 && (
            <>
              <View style={styles.queueBetweenRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#D97706" />
                <Text style={styles.queueBetweenText}>{farmersAhead} किसान बाकी</Text>
              </View>
              <View style={styles.queueArrowWrap}>
                <View style={styles.queueArrowLine} />
                <MaterialCommunityIcons name="chevron-down" size={22} color={COLORS.textMuted} />
              </View>
            </>
          )}

          {/* Your token */}
          <View style={styles.queueRow}>
            <View style={[styles.queueBadge, styles.queueBadgeYellow]}>
              <MaterialCommunityIcons name="ticket-confirmation" size={14} color="#92400E" />
              <Text style={[styles.queueBadgeText, { color: '#92400E' }]}>आपका नंबर</Text>
            </View>
            <Text style={[styles.queueTokenNum, { color: COLORS.primary }]}>#{yourTokenNumber}</Text>
          </View>

          {/* ETA strip */}
          <View style={styles.etaStrip}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.primary} />
            <Text style={styles.etaLabel}>आपकी बारी का समय</Text>
            <Text style={styles.etaTime}>
              {hasDelayAlert ? newETA : estimatedTurnTime}
            </Text>
          </View>
        </View>

        {/* ─── 5. WHAT SHOULD I DO? ─── */}
        <View style={[
          styles.actionCard,
          isMyTurn ? styles.actionCardGreen : hasDelayAlert ? styles.actionCardRed : isApproaching ? styles.actionCardOrange : styles.actionCardBlue
        ]}>
          <Text style={styles.actionCardTitle}>अभी क्या करें?</Text>

          {isMyTurn ? (
            <>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="check-circle" size={28} color={COLORS.success} />
                <Text style={styles.actionText}>अब आपकी बारी है!</Text>
              </View>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="tractor" size={28} color={COLORS.primary} />
                <Text style={styles.actionText}>तुरंत तौल केंद्र पर जाएं</Text>
              </View>
            </>
          ) : hasDelayAlert ? (
            <>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="hand-back-right" size={28} color="#DC2626" />
                <Text style={[styles.actionText, { color: '#991B1B' }]}>अभी घर से मत निकलें</Text>
              </View>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="clock-outline" size={28} color="#B45309" />
                <Text style={[styles.actionText, { color: '#92400E' }]}>{newETA} के बाद आएं</Text>
              </View>
            </>
          ) : isApproaching ? (
            <>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="tractor" size={28} color={COLORS.primary} />
                <Text style={styles.actionText}>अब मंडी के लिए निकल सकते हैं</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="home-clock" size={28} color={COLORS.primary} />
                <Text style={styles.actionText}>घर पर रुकें, समय आने पर निकलें</Text>
              </View>
              <View style={styles.actionRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.textSecondary} />
                <Text style={[styles.actionText, { color: COLORS.textSecondary, fontSize: 15 }]}>
                  {hasDelayAlert ? newETA : estimatedTurnTime} पर आएं
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ─── 6. GATE PASS ─── */}
        <TouchableOpacity
          style={styles.gatePassBtn}
          onPress={() => Alert.alert('🎫 गेट पास', `Token: ${activeBooking?.token || '#MP-WHT-2026-0019'}\nQR Code खुल रहा है...`)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={30} color={COLORS.white} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.gatePassTitle}>गेट पास दिखाएं</Text>
            <Text style={styles.gatePassSub}>Show Gate Pass / QR</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* ─── 7. MANDI FACILITIES (Collapsible) ─── */}
        <View style={styles.facilitiesCard}>
          <TouchableOpacity
            style={styles.facilitiesHeader}
            onPress={() => setFacilitiesExpanded(!facilitiesExpanded)}
          >
            <MaterialCommunityIcons name="store" size={20} color={COLORS.primary} />
            <Text style={styles.facilitiesTitle}>मंडी में उपलब्ध</Text>
            <MaterialCommunityIcons
              name={facilitiesExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {facilitiesExpanded && (
            <View style={styles.facilitiesList}>
              {[
                { icon: 'water-check', label: 'Moisture Testing Lab' },
                { icon: 'scale-bathroom', label: 'Electronic Weighbridge (×2)' },
                { icon: 'seat', label: 'Farmer Rest Shed & RO Water' },
                { icon: 'clipboard-account', label: 'DBT Grievance Desk' },
              ].map((f, i) => (
                <View key={i} style={styles.facilityRow}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.success} />
                  <Text style={styles.facilityText}>{f.label}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.callCentreRow} onPress={handleCallCentre}>
                <MaterialCommunityIcons name="phone" size={16} color={COLORS.primary} />
                <Text style={styles.callCentreText}>मंडी से बात करें · +91 755 2891043</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ─── SIH 2026 JUDGE SIMULATION CONTROLS ─── */}
        <View style={styles.simCard}>
          <View style={styles.simHeader}>
            <MaterialCommunityIcons name="tune-vertical" size={18} color="#166534" />
            <Text style={styles.simTitle}>SIH 2026 — Judge Simulation Controls</Text>
          </View>
          <Text style={styles.simDesc}>Trigger live mandi dynamics for demo:</Text>
          <View style={styles.simBtnRow}>
            <TouchableOpacity
              style={[styles.simBtn, hasDelayAlert ? styles.simBtnOutline : styles.simBtnDanger]}
              onPress={() => triggerManualDelayAlert(!hasDelayAlert)}
            >
              <MaterialCommunityIcons
                name={hasDelayAlert ? 'refresh' : 'alert-circle'}
                size={16}
                color={hasDelayAlert ? '#166534' : '#fff'}
              />
              <Text style={[styles.simBtnText, hasDelayAlert && { color: '#166534' }]}>
                {hasDelayAlert ? 'Reset Delay' : 'Simulate 47m Bottleneck'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simBtnGold} onPress={advanceQueueToken}>
              <MaterialCommunityIcons name="skip-next" size={16} color={COLORS.primaryDark} />
              <Text style={[styles.simBtnText, { color: COLORS.primaryDark }]}>Advance Queue +1</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scroll: {
    padding: SPACING.md,
    paddingBottom: 80,
  },

  // ── Header ──
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.5)',
  },
  appName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  appSub: {
    color: COLORS.accentLight,
    fontSize: 11,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page title strip
  pageTitleStrip: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...SHADOWS.md,
  },
  pageTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220,38,38,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  liveText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ── Mandi Card ──
  mandiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  mandiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mandiName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  mandiSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  dirBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // ── Delay Card ──
  delayCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  delayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopSign: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#991B1B',
  },
  delayHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#991B1B',
  },
  delayEnglish: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
  dismissX: {
    padding: 6,
    alignSelf: 'flex-start',
  },
  delayTimeBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  delayMinutesNum: {
    fontSize: 72,
    fontWeight: '900',
    color: '#DC2626',
    lineHeight: 78,
  },
  delayMinutesLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991B1B',
    marginTop: 4,
  },
  delayInstructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  delayInstructionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991B1B',
  },
  newEtaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  newEtaLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  newEtaTime: {
    fontSize: 32,
    fontWeight: '900',
    color: '#B45309',
    marginTop: 2,
  },
  ackBtn: {
    backgroundColor: '#DC2626',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ackBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },

  // ── On-time card ──
  onTimeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    ...SHADOWS.sm,
  },
  onTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  onTimeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.success,
  },
  onTimeSub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
  },
  countdownPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  countdownVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accent,
  },
  countdownLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ── Token Hero ──
  tokenHeroCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  tokenHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tokenHeroLabel: {
    color: COLORS.accentLight,
    fontSize: 18,
    fontWeight: '700',
  },
  tokenHeroLabelEn: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tokenHeroNumber: {
    fontSize: 96,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 104,
    letterSpacing: -2,
  },
  farmerDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  moreFarmers: {
    color: '#D97706',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 4,
  },
  farmersAheadText: {
    color: COLORS.accentLight,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },

  // ── Queue Flow ──
  queueFlowCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  queueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  queueBadgeGreen: {
    backgroundColor: '#DCFCE7',
  },
  queueBadgeYellow: {
    backgroundColor: '#FEF3C7',
  },
  queueGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  queueBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  queueTokenNum: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.text,
  },
  queueArrowWrap: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  queueArrowLine: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.borderLight,
  },
  queueBetweenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  queueBetweenText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  etaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: RADIUS.md,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  etaLabel: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  etaTime: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // ── What to do? ──
  actionCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  actionCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  actionCardRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionCardOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDE68A',
  },
  actionCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    lineHeight: 24,
  },

  // ── Gate Pass ──
  gatePassBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 20,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  gatePassTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  gatePassSub: {
    color: COLORS.accentLight,
    fontSize: 12,
    marginTop: 2,
  },

  // ── Facilities ──
  facilitiesCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  facilitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  facilitiesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  facilitiesList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
    gap: 8,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  facilityText: {
    fontSize: 13,
    color: COLORS.text,
  },
  callCentreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  callCentreText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ── SIH Simulation ──
  simCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  simTitle: {
    fontSize: 12,
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
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  simBtnDanger: {
    backgroundColor: '#DC2626',
  },
  simBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#166534',
  },
  simBtnGold: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});
