import React from 'react';
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
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { useFarmer } from '../../context/FarmerContext';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { farmer, bookings, isLoadingData, refreshData } = useFarmer();
  const { logout } = useAuth();

  const activeBooking = bookings.find((b) => b.status === 'BOOKED');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of ProcurePulse?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  if (isLoadingData && !farmer) {
    return <Loader message="Loading Farmer Profile..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        farmerName={farmer?.name || 'Ramesh Kumar'}
        farmerId={farmer?.farmerId || 'MP-FR-2026-0001'}
        rightIcon="logout"
        onRightPress={handleLogout}
        title={`Namaste, ${farmer?.name?.split(' ')[0] || 'Farmer'} 🙏`}
        subtitle="Rabi Procurement Season 2026-27 is Active"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoadingData} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        {/* Profile Summary Card */}
        <Card goldBorder style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.farmerName}>{farmer?.name || 'Ramesh Kumar'}</Text>
                <Badge label="e-KYC Verified" variant="success" size="sm" icon="check-decagram" />
              </View>
              <Text style={styles.farmerIdText}>Farmer ID: {farmer?.farmerId || 'MP-FR-2026-0001'}</Text>
              <Text style={styles.profileAddress} numberOfLines={1}>
                {farmer?.address || 'Pipariya, Berasia, Bhopal'}
              </Text>
            </View>
          </View>

          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Crop</Text>
              <Text style={styles.statVal}>{farmer?.crop || 'Wheat'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Entitlement</Text>
              <Text style={styles.statVal}>{farmer?.entitlement || '2000 kg'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>MSP Rate</Text>
              <Text style={[styles.statVal, { color: COLORS.success }]}>₹2,275/Qtl</Text>
            </View>
          </View>
        </Card>

        {/* Active Booking Card with Dynamic Arrival Window */}
        {activeBooking ? (
          <Card
            title="Active Slot Booking"
            subtitle="Procurement appointment scheduled"
            icon="calendar-clock"
            iconColor={COLORS.primary}
            badge="BOOKED"
            badgeColor={COLORS.warning}
            highlight
            style={styles.activeBookingCard}
          >
            <View style={styles.bookingTopRow}>
              <View style={styles.tokenBox}>
                <Text style={styles.tokenLabel}>TOKEN NUMBER</Text>
                <Text style={styles.tokenValue}>{activeBooking.token}</Text>
              </View>
              <TouchableOpacity
                style={styles.qrShortcut}
                onPress={() => navigation.navigate('LiveQueue')}
              >
                <MaterialCommunityIcons name="qrcode-scan" size={28} color={COLORS.primary} />
                <Text style={styles.qrShortcutText}>View Gate Pass</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bookingDetailsBox}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="storefront-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.detailText} numberOfLines={1}>{activeBooking.centre}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-month-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{activeBooking.date} • {activeBooking.timeSlot}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="scale" size={18} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>Quantity: {activeBooking.quantity} ({activeBooking.crop})</Text>
              </View>
            </View>

            {/* Dynamic Arrival Window Highlight */}
            <View style={styles.dynamicArrivalBanner}>
              <MaterialCommunityIcons name="clock-alert-outline" size={22} color={COLORS.accentDark} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.arrivalTitle}>Dynamic Arrival Window</Text>
                <Text style={styles.arrivalTime}>{activeBooking.recommendedArrival || '11:35 AM – 11:50 AM'}</Text>
                <Text style={styles.arrivalNote}>
                  Arrive strictly in this 15-minute window to avoid tractor idling and gate congestion.
                </Text>
              </View>
            </View>

            <View style={styles.bookingActionRow}>
              <Button
                title="Track Live Gate Queue"
                variant="gold"
                size="md"
                icon="radar"
                onPress={() => navigation.navigate('LiveQueue')}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : (
          <Card style={styles.noBookingCard}>
            <View style={styles.noBookingContent}>
              <MaterialCommunityIcons name="calendar-plus" size={40} color={COLORS.accentDark} />
              <Text style={styles.noBookingTitle}>No Active Booking</Text>
              <Text style={styles.noBookingSubtitle}>
                Book a smart procurement slot to avoid long lines at the mandi.
              </Text>
              <Button
                title="Book Procurement Slot"
                variant="primary"
                size="md"
                icon="plus-circle"
                onPress={() => navigation.navigate('BookSlot')}
                style={{ marginTop: SPACING.md }}
              />
            </View>
          </Card>
        )}

        {/* Quick Actions Grid */}
        <Text style={styles.sectionHeading}>Quick Services / त्वरित सेवाएं</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('BookSlot')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialCommunityIcons name="calendar-check" size={26} color="#0284C7" />
            </View>
            <Text style={styles.quickTitle}>Book Slot</Text>
            <Text style={styles.quickDesc}>Smart Mandi AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('LiveQueue')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="radar" size={26} color="#D97706" />
            </View>
            <Text style={styles.quickTitle}>Live Queue</Text>
            <Text style={styles.quickDesc}>Token & Delay ETA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('Payments')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <MaterialCommunityIcons name="cash-multiple" size={26} color="#16A34A" />
            </View>
            <Text style={styles.quickTitle}>Payments</Text>
            <Text style={styles.quickDesc}>DBT Status & Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('Grievance')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="bullhorn" size={26} color="#DC2626" />
            </View>
            <Text style={styles.quickTitle}>Grievance</Text>
            <Text style={styles.quickDesc}>Complaints & Help</Text>
          </TouchableOpacity>
        </View>

        {/* My Land Holdings */}
        <Card
          title="Registered Land Holdings"
          subtitle="Revenue Records (RCMS MP Integration)"
          icon="terrain"
          iconColor={COLORS.primary}
          badge={`${farmer?.landHoldings?.length || 0} Parcels`}
          badgeColor={COLORS.primary}
        >
          {(farmer?.landHoldings || []).map((land, idx) => (
            <View key={land.id || idx} style={styles.landRow}>
              <View style={styles.landIconBox}>
                <MaterialCommunityIcons name="map-marker-radius" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.landTextBox}>
                <View style={styles.khasraTitleRow}>
                  <Text style={styles.khasraTitle}>Khasra #{land.khasra}</Text>
                  <Text style={styles.landArea}>{land.area} Hectares</Text>
                </View>
                <Text style={styles.landLocation}>
                  {land.village}, {land.tehsil}, {land.district}
                </Text>
                <Text style={styles.landCropBadge}>🌾 {land.crop || 'Wheat (Sharbati)'}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Bank & DBT Status */}
        <Card
          title="Bank & Direct Benefit Transfer (DBT)"
          subtitle="Aadhaar-Linked Account"
          icon="bank-check"
          iconColor={COLORS.success}
          badge="NPCI Linked"
          badgeColor={COLORS.success}
        >
          <View style={styles.bankDetailRow}>
            <View>
              <Text style={styles.bankName}>{farmer?.bankAccount?.bank || 'State Bank of India'}</Text>
              <Text style={styles.bankAccount}>A/C: {farmer?.bankAccount?.account || '30489218392'}</Text>
              <Text style={styles.bankIfsc}>IFSC: {farmer?.bankAccount?.ifsc || 'SBIN0001234'}</Text>
            </View>
            <View style={styles.dbtVerifiedPill}>
              <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
              <Text style={styles.dbtVerifiedText}>Active DBT</Text>
            </View>
          </View>
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
    paddingBottom: SPACING.xxl,
  },
  profileCard: {
    marginBottom: SPACING.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  farmerIdText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  profileAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  activeBookingCard: {
    marginBottom: SPACING.md,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  tokenLabel: {
    color: COLORS.accentLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tokenValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  qrShortcut: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  qrShortcutText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  bookingDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  dynamicArrivalBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  arrivalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  arrivalNote: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 3,
    lineHeight: 15,
  },
  bookingActionRow: {
    marginTop: 4,
  },
  noBookingCard: {
    marginBottom: SPACING.md,
  },
  noBookingContent: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  noBookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  noBookingSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.md,
  },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  quickIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  landRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  landIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  landTextBox: {
    flex: 1,
  },
  khasraTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  khasraTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  landArea: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  landLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  landCropBadge: {
    fontSize: 11,
    color: COLORS.accentDark,
    fontWeight: '600',
    marginTop: 3,
  },
  bankDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  bankAccount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bankIfsc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dbtVerifiedPill: {
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  dbtVerifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
});
