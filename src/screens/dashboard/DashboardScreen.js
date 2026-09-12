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
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { useFarmer } from '../../context/FarmerContext';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { farmer, bookings, isLoadingData, refreshData } = useFarmer();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [isFarmerDetailsExpanded, setIsFarmerDetailsExpanded] = useState(false);

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

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20) + 10;

  return (
    <View style={styles.container}>
      {/* Compact Custom Header */}
      <View style={[styles.headerContainer, { paddingTop: topPadding }]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
        
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="grain" size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.headerGreeting}>Namaste, {farmer?.name?.split(' ')[0] || 'Ramesh'} 🙏</Text>
              <Text style={styles.headerSubtitle}>ProcurePulse • Rabi Season 26-27</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoadingData} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        
        {/* Primary Booking Area */}
        {activeBooking ? (
          <View style={styles.bookingContainer}>
            {/* 1. Main Booking Card */}
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>BOOKING CONFIRMED</Text>
                </View>
                <TouchableOpacity 
                  style={styles.gatePassMiniBtn}
                  onPress={() => navigation.navigate('LiveQueue')}
                >
                  <MaterialCommunityIcons name="qrcode-scan" size={14} color={COLORS.primary} />
                  <Text style={styles.gatePassMiniText}>Gate Pass</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.tokenNumber}>{activeBooking.token}</Text>
              
              <View style={styles.bookingDetailsList}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="storefront-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailItemText} numberOfLines={1}>{activeBooking.centre}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailItemText}>{activeBooking.date} • {activeBooking.timeSlot}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="scale" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailItemText}>{activeBooking.quantity} ({activeBooking.crop})</Text>
                </View>
              </View>
            </View>

            {/* 2. Arrival Window Section */}
            <View style={styles.arrivalSection}>
              <View style={styles.arrivalTopRow}>
                <View style={styles.arrivalTitleBox}>
                  <MaterialCommunityIcons name="clock-alert-outline" size={18} color="#92400E" />
                  <Text style={styles.arrivalTitle}>Your Arrival Window</Text>
                </View>
              </View>
              <Text style={styles.arrivalTime}>{activeBooking.recommendedArrival || '11:35 AM – 11:50 AM'}</Text>
              <Text style={styles.arrivalDesc}>Please arrive during this 15-minute window.</Text>
              
              <TouchableOpacity 
                style={styles.primaryCta}
                onPress={() => navigation.navigate('LiveQueue')}
              >
                <MaterialCommunityIcons name="tractor" size={20} color={COLORS.white} />
                <Text style={styles.primaryCtaText}>I'm On My Way</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noBookingCard}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.noBookingTitle}>No Active Booking</Text>
            <Text style={styles.noBookingDesc}>Book a slot to sell your crop at the mandi.</Text>
            <Button
              title="Book Procurement Slot"
              variant="primary"
              size="md"
              onPress={() => navigation.navigate('BookSlot')}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* 3. Live Queue Preview */}
        {activeBooking && (
          <View style={styles.queuePreviewCard}>
            <View style={styles.queuePreviewHeader}>
              <View style={styles.queueTitleRow}>
                <View style={styles.redDot} />
                <Text style={styles.queuePreviewTitle}>Live Queue</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('LiveQueue')}>
                <Text style={styles.viewQueueLink}>View Live Queue →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.queueStatsRow}>
              <Text style={styles.queueStatText}>4 farmers ahead</Text>
              <Text style={styles.queueStatDivider}>•</Text>
              <Text style={styles.queueStatText}>Estimated wait: ~18 min</Text>
            </View>
          </View>
        )}

        {/* 4. Quick Actions */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('BookSlot')}>
              <View style={[styles.quickIconBox, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="map-marker-path" size={22} color="#0284C7" />
              </View>
              <Text style={styles.quickBtnText}>Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('LiveQueue')}>
              <View style={[styles.quickIconBox, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="qrcode-scan" size={22} color="#D97706" />
              </View>
              <Text style={styles.quickBtnText}>Gate Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Payments')}>
              <View style={[styles.quickIconBox, { backgroundColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="cash-multiple" size={22} color="#16A34A" />
              </View>
              <Text style={styles.quickBtnText}>Payments</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Grievance')}>
              <View style={[styles.quickIconBox, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="bullhorn" size={22} color="#DC2626" />
              </View>
              <Text style={styles.quickBtnText}>Grievance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Collapsible Farmer Details */}
        <View style={styles.sectionWrapper}>
          <View style={styles.farmerDetailsCard}>
            <View style={styles.farmerCompactRow}>
              <View style={styles.farmerAvatar}>
                <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.farmerCompactInfo}>
                <View style={styles.farmerNameRow}>
                  <Text style={styles.farmerName}>{farmer?.name || 'Ramesh Kumar'}</Text>
                  <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.success} />
                </View>
                <Text style={styles.farmerId}>Farmer ID: {farmer?.farmerId || 'MP-FR-2026-0001'}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.expandDetailsBtn}
              onPress={() => setIsFarmerDetailsExpanded(!isFarmerDetailsExpanded)}
            >
              <Text style={styles.expandDetailsText}>
                {isFarmerDetailsExpanded ? 'Hide Details' : 'View Farmer Details'}
              </Text>
              <MaterialCommunityIcons 
                name={isFarmerDetailsExpanded ? "chevron-up" : "chevron-down"} 
                size={18} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>

            {isFarmerDetailsExpanded && (
              <View style={styles.expandedDetailsContainer}>
                <View style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{farmer?.address || 'Pipariya, Berasia, Bhopal'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Crop</Text>
                  <Text style={styles.infoValue}>{farmer?.crop || 'Wheat'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Entitlement</Text>
                  <Text style={styles.infoValue}>{farmer?.entitlement || '2000 kg'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>MSP Rate</Text>
                  <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: '700' }]}>₹2,275/Qtl</Text>
                </View>

                {/* Land Holdings Summary */}
                <Text style={styles.subSectionTitle}>Land Holdings (RCMS Linked)</Text>
                {(farmer?.landHoldings || []).map((land, idx) => (
                  <View key={land.id || idx} style={styles.landRow}>
                    <Text style={styles.landText}>
                      Khasra #{land.khasra} • {land.area} Hectares
                    </Text>
                    <Text style={styles.landSubtext}>
                      {land.village}, {land.tehsil}
                    </Text>
                  </View>
                ))}

                {/* Bank / DBT Summary */}
                <Text style={styles.subSectionTitle}>Bank & DBT (Aadhaar Linked)</Text>
                <View style={styles.bankRow}>
                  <View>
                    <Text style={styles.bankText}>{farmer?.bankAccount?.bank || 'State Bank of India'}</Text>
                    <Text style={styles.bankSubtext}>A/C: {farmer?.bankAccount?.account || '30489218392'} • IFSC: {farmer?.bankAccount?.ifsc || 'SBIN0001234'}</Text>
                  </View>
                  <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                </View>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Very light neutral background
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...SHADOWS.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.5)',
  },
  headerGreeting: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Booking Area
  bookingContainer: {
    marginBottom: SPACING.md,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  gatePassMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gatePassMiniText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tokenNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  bookingDetailsList: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailItemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  
  // Arrival Section
  arrivalSection: {
    backgroundColor: '#FFFBEB',
    padding: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  arrivalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrivalTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrivalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  arrivalTime: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 4,
  },
  arrivalDesc: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 4,
    marginBottom: 12,
  },
  primaryCta: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.sm,
  },
  primaryCtaText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  
  // No Booking
  noBookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  noBookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  noBookingDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Queue Preview
  queuePreviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  queuePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  queueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  queuePreviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  viewQueueLink: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  queueStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  queueStatText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  queueStatDivider: {
    fontSize: 13,
    color: COLORS.border,
  },
  
  // Sections
  sectionWrapper: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  
  // Quick Actions Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickBtn: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // Farmer Details Collapsible
  farmerDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  farmerCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  farmerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  farmerCompactInfo: {
    flex: 1,
  },
  farmerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  farmerId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  expandDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  expandDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  expandedDetailsContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  landRow: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 6,
  },
  landText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  landSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: RADIUS.sm,
  },
  bankText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  bankSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
