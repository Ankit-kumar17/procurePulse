import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Loader from '../../components/Loader';
import { useFarmer } from '../../context/FarmerContext';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { farmer, bookings, payments, isLoadingData, refreshData } = useFarmer();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const activeBooking = bookings.find((b) => b.status === 'BOOKED') || bookings[0];

  const totalReceived = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'INITIATED')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const handleLogout = () => {
    Alert.alert(
      'लॉगआउट',
      'क्या आप ProcurePulse से लॉगआउट करना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        { text: 'लॉगआउट', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handlePlayVoiceGuide = () => {
    Alert.alert(
      '🔊 होम सहायक (Voice Guide)',
      `नमस्ते ${farmer?.name?.split(' ')[0] || 'किसान'} भाई!\n\n• आपका स्लॉट 18 अप्रैल को बैरसिया उपार्जन केंद्र पर बुक है।\n• टोकन नंबर: ${activeBooking?.token || 'MP-WHT-2026-1049'}\n• कुल ₹${totalReceived.toLocaleString('en-IN')} का भुगतान खाते में आ चुका है।`,
      [{ text: 'समझ गया (OK)' }]
    );
  };

  if (isLoadingData && !farmer) {
    return <Loader message="किसान प्रोफाइल लोड हो रही है..." />;
  }

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. TOP HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.farmerProfileBox}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="grain" size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.greetingText}>
                नमस्ते, {farmer?.name?.split(' ')[0] || 'रमेश'} जी 🙏
              </Text>
              <Text style={styles.subGreetingText}>
                ई-उपार्जन 2.0 • रबी 2026-27
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={handlePlayVoiceGuide}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="volume-high" size={17} color={COLORS.primaryDark} />
              <Text style={styles.voiceBtnText}>सुनें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <MaterialCommunityIcons name="logout" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoadingData} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        {/* ─── 2. ACTIVE BOOKING STATUS HERO CARD ─── */}
        {activeBooking ? (
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.confirmedBadge}>
                <MaterialCommunityIcons name="check-circle" size={14} color="#15803D" />
                <Text style={styles.confirmedBadgeText}>बुकिंग पक्की है</Text>
              </View>

              <TouchableOpacity
                style={styles.gatePassBtn}
                onPress={() => navigation.navigate('LiveQueue')}
                activeOpacity={0.75}
              >
                <MaterialCommunityIcons name="qrcode-scan" size={14} color={COLORS.primary} />
                <Text style={styles.gatePassBtnText}>गेट पास</Text>
              </TouchableOpacity>
            </View>

            {/* Token ID */}
            <Text style={styles.tokenLabel}>टोकन नंबर (Token ID)</Text>
            <Text style={styles.tokenValue}>{activeBooking.token}</Text>

            {/* Details List */}
            <View style={styles.bookingDetailsBox}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="storefront" size={16} color={COLORS.primary} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {activeBooking.centre?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  {activeBooking.date || '18 अप्रैल 2026'} • {activeBooking.timeSlot || '11:00 AM - 12:00 PM'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="scale-balance" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  {activeBooking.quantity || '2,000 kg (20 क्विंटल)'} • {activeBooking.crop || 'गेहूं'}
                </Text>
              </View>
            </View>

            {/* Departure Guidance Banner */}
            <View style={styles.departureBanner}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#92400E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.departureTitle}>पहुंचने का समय: 11:35 AM – 11:50 AM</Text>
                <Text style={styles.departureSub}>घर से 11:15 AM पर निकलें ताकि सीधे तौल कांटे पर पहुंचे।</Text>
              </View>
            </View>

            {/* Live Queue Action */}
            <TouchableOpacity
              style={styles.heroActionBtn}
              onPress={() => navigation.navigate('LiveQueue')}
              activeOpacity={0.88}
            >
              <MaterialCommunityIcons name="radar" size={18} color={COLORS.white} />
              <Text style={styles.heroActionBtnText}>लाइव कतार व अपनी बारी देखें →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noBookingCard}>
            <MaterialCommunityIcons name="calendar-plus" size={36} color={COLORS.primary} />
            <Text style={styles.noBookingTitle}>कोई स्लॉट बुक नहीं है</Text>
            <Text style={styles.noBookingSub}>मंडी में फसल बेचने के लिए तारीख व समय चुनें।</Text>
            <TouchableOpacity
              style={styles.bookSlotBtn}
              onPress={() => navigation.navigate('BookSlot')}
              activeOpacity={0.88}
            >
              <Text style={styles.bookSlotBtnText}>➕ नया स्लॉट बुक करें</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── 3. QUICK ACTION TILES ─── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeading}>त्वरित सेवाएं (Quick Services)</Text>
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => navigation.navigate('BookSlot')}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#0284C7" />
            </View>
            <Text style={styles.tileTitle}>स्लॉट बुकिंग</Text>
            <Text style={styles.tileSub}>फसल बेचें</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => navigation.navigate('LiveQueue')}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="radar" size={24} color="#D97706" />
            </View>
            <Text style={styles.tileTitle}>लाइव कतार</Text>
            <Text style={styles.tileSub}>टोकन स्थिति</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => navigation.navigate('Payments')}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#DCFCE7' }]}>
              <MaterialCommunityIcons name="cash-multiple" size={24} color="#16A34A" />
            </View>
            <Text style={styles.tileTitle}>भुगतान</Text>
            <Text style={styles.tileSub}>खाते का पैसा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickTile}
            onPress={() => navigation.navigate('Grievance')}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIconBox, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="bullhorn" size={24} color="#DC2626" />
            </View>
            <Text style={styles.tileTitle}>सहायता (181)</Text>
            <Text style={styles.tileSub}>शिकायत दर्ज करें</Text>
          </TouchableOpacity>
        </View>

        {/* ─── 4. PASSBOOK SUMMARY BANNER ─── */}
        <TouchableOpacity
          style={styles.passbookStrip}
          onPress={() => navigation.navigate('Payments')}
          activeOpacity={0.85}
        >
          <View style={styles.passbookLeft}>
            <MaterialCommunityIcons name="bank-check" size={24} color="#15803D" />
            <View>
              <Text style={styles.passbookTitle}>कुल मिला पैसा: ₹{totalReceived.toLocaleString('en-IN')}</Text>
              <Text style={styles.passbookSub}>SBI ••••8392 में जमा • {totalPending > 0 ? `₹${totalPending.toLocaleString('en-IN')} आ रहा है` : 'सभी भुगतान पूर्ण'}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* ─── 5. COLLAPSIBLE FARMER PROFILE CARD ─── */}
        <View style={styles.farmerCard}>
          <View style={styles.farmerHeader}>
            <View style={styles.farmerAvatar}>
              <MaterialCommunityIcons name="account-check" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.farmerNameText}>{farmer?.name || 'रमेश कुमार'}</Text>
              <Text style={styles.farmerIdText}>किसान क्र.: {farmer?.farmerId || 'MP-FR-2026-0001'}</Text>
            </View>
            <TouchableOpacity
              style={styles.expandToggleBtn}
              onPress={() => setDetailsExpanded(!detailsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandToggleText}>
                {detailsExpanded ? 'कम देखें' : 'और जानकारी'}
              </Text>
              <MaterialCommunityIcons
                name={detailsExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {detailsExpanded && (
            <View style={styles.expandedSection}>
              <View style={styles.divider} />
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>गांव व तहसील</Text>
                <Text style={styles.infoVal}>{farmer?.address || 'पिपलिया, बैरसिया, भोपाल'}</Text>
              </View>
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>खसरा व जमीन</Text>
                <Text style={styles.infoVal}>खसरा #123/1 (2.5 हेक्टेयर)</Text>
              </View>
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>समग्र आईडी</Text>
                <Text style={styles.infoVal}>198472910 ✓ सत्यापित</Text>
              </View>
            </View>
          )}
        </View>
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
  farmerProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.4)',
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.white,
  },
  subGreetingText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },
  headerRightActions: {
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
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  voiceBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  logoutBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
    gap: 14,
  },

  /* ─── 2. HERO BOOKING CARD ─── */
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  gatePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gatePassBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tokenLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tokenValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 0.5,
    marginVertical: 2,
  },
  bookingDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 10,
    marginVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  departureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  departureTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400E',
  },
  departureSub: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 1,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
    ...SHADOWS.md,
  },
  heroActionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
  },

  /* No Booking Card */
  noBookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  noBookingTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 8,
  },
  noBookingSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  bookSlotBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
  },
  bookSlotBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
  },

  /* ─── 3. SECTION & GRID ─── */
  sectionTitleRow: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickTile: {
    width: '48.2%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    alignItems: 'flex-start',
    ...SHADOWS.sm,
  },
  tileIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  tileSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },

  /* ─── 4. PASSBOOK STRIP ─── */
  passbookStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  passbookTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
  },
  passbookSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1,
  },

  /* ─── 5. FARMER CARD ─── */
  farmerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE4EC',
  },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  farmerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmerNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  farmerIdText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  expandToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  expandedSection: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
});
