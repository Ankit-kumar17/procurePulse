import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../utils/theme';
import { Header, Card, Badge, Button, InfoRow, MetricCard } from '../../components';
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
        { text: 'लॉगआउट', style: 'destructive', onPress: logout },
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

  return (
    <View style={styles.container}>
      {/* ─── 1. TOP HEADER ─── */}
      <Header
        farmerName={farmer?.name || 'रमेश कुमार'}
        farmerId={farmer?.farmerId || 'MP-FR-2026-0001'}
        onVoiceGuidePress={handlePlayVoiceGuide}
        rightIcon="logout"
        onRightPress={handleLogout}
        title={`नमस्ते, ${farmer?.name?.split(' ')[0] || 'रमेश'} जी 🙏`}
        subtitle="ई-उपार्जन 2.0 • मध्य प्रदेश रबी 2026-27"
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoadingData} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        {/* ─── 2. ACTIVE BOOKING STATUS HERO CARD ─── */}
        {activeBooking ? (
          <Card
            variant="hero"
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <Badge
                label="बुकिंग पक्की है"
                variant="success"
                icon="check-circle"
                size="md"
              />

              <Button
                title="गेट पास"
                icon="qrcode-scan"
                size="sm"
                variant="gold"
                onPress={() => navigation.navigate('LiveQueue')}
              />
            </View>

            {/* Token ID */}
            <Text style={styles.tokenLabel}>टोकन नंबर (Token ID)</Text>
            <Text style={styles.tokenValue}>{activeBooking.token}</Text>

            {/* Booking Key-Value Details */}
            <View style={styles.bookingDetailsBox}>
              <InfoRow
                icon="storefront"
                iconColor={COLORS.primary}
                label="उपार्जन केंद्र"
                value={activeBooking.centre?.split('(')[0] || 'बैरसिया केंद्र'}
                showDivider={true}
              />
              <InfoRow
                icon="calendar-clock"
                iconColor={COLORS.primary}
                label="तारीख व समय"
                value={`${activeBooking.date || '18 अप्रैल'} • ${activeBooking.timeSlot || '11:00 AM'}`}
                showDivider={true}
              />
              <InfoRow
                icon="scale-balance"
                iconColor={COLORS.primary}
                label="फसल व मात्रा"
                value={`${activeBooking.crop || 'गेहूं'} (${activeBooking.quantity || '20 क्विंटल'})`}
                showDivider={false}
              />
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
            <Button
              title="लाइव कतार व अपनी बारी देखें →"
              icon="radar"
              size="lg"
              variant="primary"
              fullWidth
              onPress={() => navigation.navigate('LiveQueue')}
              style={styles.heroActionBtn}
            />
          </Card>
        ) : (
          <Card style={styles.noBookingCard}>
            <MaterialCommunityIcons name="calendar-plus" size={36} color={COLORS.primary} />
            <Text style={styles.noBookingTitle}>कोई स्लॉट बुक नहीं है</Text>
            <Text style={styles.noBookingSub}>मंडी में फसल बेचने के लिए तारीख व समय चुनें।</Text>
            <Button
              title="➕ नया स्लॉट बुक करें"
              size="lg"
              variant="primary"
              fullWidth
              onPress={() => navigation.navigate('BookSlot')}
              style={{ marginTop: SPACING.md }}
            />
          </Card>
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
              <Text style={styles.passbookSub}>
                SBI ••••8392 में जमा • {totalPending > 0 ? `₹${totalPending.toLocaleString('en-IN')} आ रहा है` : 'सभी भुगतान पूर्ण'}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* ─── 5. COLLAPSIBLE FARMER PROFILE CARD ─── */}
        <Card style={styles.farmerCard}>
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
              <InfoRow
                icon="home-city"
                label="गांव व तहसील"
                value={farmer?.address || 'पिपलिया, बैरसिया, भोपाल'}
                showDivider={true}
              />
              <InfoRow
                icon="terrain"
                label="खसरा व जमीन"
                value="खसरा #123/1 (2.5 हेक्टेयर)"
                showDivider={true}
              />
              <InfoRow
                icon="shield-check"
                label="समग्र आईडी"
                value="198472910 ✓ सत्यापित"
                showDivider={false}
              />
            </View>
          )}
        </Card>
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
  heroCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.md + 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tokenValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: SPACING.sm + 2,
  },
  bookingDetailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  departureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: SPACING.md,
  },
  departureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  departureSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B45309',
    marginTop: 1,
  },
  heroActionBtn: {
    backgroundColor: COLORS.accent,
  },
  noBookingCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  noBookingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  noBookingSub: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitleRow: {
    marginBottom: SPACING.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  quickTile: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  tileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  tileSub: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  passbookStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  passbookTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  passbookSub: {
    fontSize: 11,
    fontWeight: '500',
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
