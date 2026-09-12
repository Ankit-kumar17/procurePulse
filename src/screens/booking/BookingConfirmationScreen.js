import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function BookingConfirmationScreen({ route, navigation }) {
  const { booking } = route.params || {};

  const handleShare = async () => {
    try {
      await Share.share({
        message: `ProcurePulse Gate Pass Token: ${booking?.token}\nCentre: ${booking?.centre}\nDate: ${booking?.date}\nArrival Window: ${booking?.recommendedArrival}\nQuantity: ${booking?.quantity}`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Slot',
      'Would you like to modify your procurement date or arrival window?',
      [
        { text: 'Keep Current', style: 'cancel' },
        {
          text: 'Choose New Date',
          onPress: () => navigation.navigate('Calendar', { ...booking })
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gate Pass & Token Confirmed"
        subtitle="e-Uparjan Digital Gate Slip"
        rightIcon="share-variant"
        onRightPress={handleShare}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.successIconCircle}>
            <MaterialCommunityIcons name="check-bold" size={32} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.successTitle}>Slot Confirmed & Gate Pass Ready!</Text>
          <Text style={styles.successSubtitle}>
            Present this QR code at Mandi Gate No. 2 for instant weighbridge priority.
          </Text>

          {/* Token Box */}
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>PROCUREMENT TOKEN ID</Text>
            <Text style={styles.tokenValue}>{booking?.token || 'MP-WHT-2026-0001'}</Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QRCode
              value={booking?.qrData || `PROCUREPULSE:TOKEN=${booking?.token || 'MP-WHT-2026-0001'}`}
              size={170}
              color={COLORS.primaryDark}
              backgroundColor="white"
            />
            <Text style={styles.qrHelper}>Scan at Mandi Entry Gate Scanner</Text>
          </View>
        </View>

        {/* Dynamic Arrival Window Highlight */}
        <View style={styles.dynamicArrivalCard}>
          <View style={styles.dynamicArrivalHeader}>
            <MaterialCommunityIcons name="clock-alert-outline" size={24} color={COLORS.accentDark} />
            <Text style={styles.dynamicArrivalHeading}>Dynamic Arrival Window</Text>
          </View>

          <View style={styles.arrivalWindowBadge}>
            <Text style={styles.arrivalWindowText}>
              {booking?.recommendedArrival || '11:35 AM – 11:50 AM'}
            </Text>
          </View>

          <Text style={styles.arrivalExplanation}>
            Why this window? Our live queue model predicts the previous batch will clear by 11:35 AM.
            Arriving during this 15-minute slot ensures you roll straight to the scale without tractor idling.
          </Text>
        </View>

        {/* Booking Details Card */}
        <Card title="Appointment Specifications" icon="file-document-outline" iconColor={COLORS.primary}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Centre</Text>
            <Text style={styles.specVal}>{booking?.centre || 'Centre B'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Address</Text>
            <Text style={styles.specVal}>{booking?.centreAddress || 'Near NH-46 Junction, Berasia Hub'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Date & Slot</Text>
            <Text style={styles.specVal}>{booking?.date} ({booking?.timeSlot})</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Allocated Land</Text>
            <Text style={styles.specVal}>{booking?.landKhasra || 'Khasra 123/1'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Commodity & Quantity</Text>
            <Text style={styles.specVal}>{booking?.quantity || '2000 kg'} ({booking?.crop || 'Wheat'})</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Gate Entry Status</Text>
            <Badge label="Gate Pass Active" variant="success" size="sm" icon="check" />
          </View>
        </Card>

        {/* Actions */}
        <Button
          title="Track Live Queue & Delay Alerts"
          variant="gold"
          size="lg"
          icon="radar"
          onPress={() => navigation.navigate('LiveQueue')}
          style={{ marginTop: SPACING.sm }}
        />

        <View style={styles.secondaryBtnRow}>
          <Button
            title="Can't Make It? Reschedule"
            variant="outline"
            size="md"
            icon="calendar-sync"
            onPress={handleReschedule}
            style={{ flex: 1 }}
          />

          <Button
            title="Dashboard"
            variant="ghost"
            size="md"
            icon="home"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
            style={{ flex: 1 }}
          />
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
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.gold,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: '90%',
  },
  tokenBox: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  tokenLabel: {
    color: COLORS.accentLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tokenValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  qrContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  qrHelper: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  dynamicArrivalCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  dynamicArrivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.xs,
  },
  dynamicArrivalHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  arrivalWindowBadge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  arrivalWindowText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  arrivalExplanation: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    maxWidth: '65%',
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
  },
});
