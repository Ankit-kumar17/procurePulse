import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import InfoRow from '../../components/InfoRow';

export default function BookingConfirmationScreen({ route, navigation }) {
  const { booking } = route.params || {};
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `म.प्र. ई-उपार्जन डिजिटल गेट पास\nटोकन क्र.: ${booking?.token || 'MP-WHT-2026-0001'}\nमंडी: ${booking?.centre}\nदिनांक: ${booking?.date}\nसमय: ${booking?.timeSlot}\nमात्रा: ${booking?.quantity}`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ─── HEADER ─── */}
      <Header
        title="गेट पास व पर्ची"
        subtitle="ई-उपार्जन 2.0 डिजिटल टोकन"
        showBack={true}
        onBackPress={() => navigation.navigate('Dashboard')}
        rightElement={
          <TouchableOpacity
            style={styles.shareHeaderBtn}
            onPress={handleShare}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── SUCCESS HERO CARD ─── */}
        <Card style={styles.passCard}>
          <View style={styles.confirmedBanner}>
            <MaterialCommunityIcons name="check-circle" size={22} color={COLORS.success} />
            <Text style={styles.confirmedBannerText}>स्लॉट सफलतापूर्वक बुक हो गया!</Text>
          </View>

          {/* Token Box */}
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>आपका टोकन नंबर (Token ID)</Text>
            <Text style={styles.tokenValue}>{booking?.token || 'MP-WHT-2026-1049'}</Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrBox}>
            <View style={styles.qrInner}>
              <QRCode
                value={booking?.qrData || `PROCUREPULSE:TOKEN=${booking?.token || 'MP-WHT-2026-1049'}`}
                size={150}
                color={COLORS.primaryDark}
                backgroundColor="white"
              />
            </View>
            <Text style={styles.qrSub}>मंडी गेट स्कैनर पर यह कोड दिखाएं</Text>
          </View>

          {/* Booking Info Grid */}
          <View style={styles.infoTable}>
            <InfoRow
              icon="storefront"
              label="उपार्जन केंद्र"
              value={booking?.centre?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}
            />
            <InfoRow
              icon="calendar-clock"
              label="तौल दिनांक व समय"
              value={`${booking?.date || '18 अप्रैल 2026'} (${booking?.timeSlot || '11:00 AM - 12:00 PM'})`}
            />
            <InfoRow
              icon="barley"
              label="फसल व मात्रा"
              value={`${booking?.crop || 'गेहूं'} • ${booking?.quantity || '2,000 kg'}`}
            />
          </View>

          {/* Recommended Arrival Window */}
          <Card variant="warning" style={styles.arrivalCallout}>
            <View style={styles.arrivalRow}>
              <MaterialCommunityIcons name="clock-fast" size={24} color="#854D0E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.arrivalTitle}>मंडी पहुंचने का सही समय:</Text>
                <Text style={styles.arrivalTime}>{booking?.recommendedArrival || '11:35 AM – 11:50 AM'}</Text>
                <Text style={styles.arrivalNote}>इस समय पहुंचने पर आपको कतार में खड़ा नहीं रहना पड़ेगा।</Text>
              </View>
            </View>
          </Card>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsColumn}>
          <Button
            title="पर्ची व्हाट्सएप पर शेयर करें"
            variant="soft"
            size="lg"
            icon="whatsapp"
            fullWidth
            onPress={handleShare}
          />

          <Button
            title="लाइव कतार देखें"
            variant="primary"
            size="lg"
            icon="radar"
            fullWidth
            onPress={() => navigation.navigate('LiveQueue')}
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
  shareHeaderBtn: {
    padding: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  passCard: {
    padding: SPACING.md,
    alignItems: 'stretch',
  },
  confirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: SPACING.md,
  },
  confirmedBannerText: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: '#15803D',
  },
  tokenBox: {
    backgroundColor: COLORS.surfaceHighlight,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  tokenLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tokenValue: {
    ...TYPOGRAPHY.display,
    fontSize: 22,
    color: COLORS.primaryDark,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  qrBox: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  qrInner: {
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  qrSub: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  infoTable: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  arrivalCallout: {
    marginTop: SPACING.sm,
    padding: SPACING.sm + 4,
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  arrivalTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: '#854D0E',
  },
  arrivalTime: {
    ...TYPOGRAPHY.title,
    fontSize: 16,
    color: '#92400E',
    marginVertical: 2,
  },
  arrivalNote: {
    ...TYPOGRAPHY.bodySmall,
    color: '#A16207',
    lineHeight: 16,
  },
  actionsColumn: {
    gap: SPACING.sm,
  },
});
