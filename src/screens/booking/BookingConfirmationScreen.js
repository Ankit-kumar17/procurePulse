import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';

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

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="close" size={22} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>गेट पास व पर्ची</Text>
            <Text style={styles.headerSubText}>ई-उपार्जन 2.0 डिजिटल टोकन</Text>
          </View>

          <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare} activeOpacity={0.75}>
            <MaterialCommunityIcons name="share-variant" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── SUCCESS HERO CARD ─── */}
        <View style={styles.passCard}>
          <View style={styles.confirmedBanner}>
            <MaterialCommunityIcons name="check-circle" size={22} color="#15803D" />
            <Text style={styles.confirmedBannerText}>स्लॉट सफलतापूर्वक बुक हो गया!</Text>
          </View>

          {/* Token Box */}
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>आपका टोकन नंबर (Token ID)</Text>
            <Text style={styles.tokenValue}>{booking?.token || 'MP-WHT-2026-1049'}</Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrBox}>
            <QRCode
              value={booking?.qrData || `PROCUREPULSE:TOKEN=${booking?.token || 'MP-WHT-2026-1049'}`}
              size={150}
              color={COLORS.primaryDark}
              backgroundColor="white"
            />
            <Text style={styles.qrSub}>मंडी गेट स्कैनर पर यह कोड दिखाएं</Text>
          </View>

          {/* Booking Info Grid */}
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>उपार्जन केंद्र</Text>
              <Text style={styles.infoVal}>{booking?.centre?.split('(')[0] || 'बैरसिया उपार्जन केंद्र'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>तौल दिनांक व समय</Text>
              <Text style={styles.infoVal}>{booking?.date || '18 अप्रैल 2026'} ({booking?.timeSlot || '11:00 AM - 12:00 PM'})</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>फसल व मात्रा</Text>
              <Text style={styles.infoVal}>{booking?.crop || 'गेहूं'} • {booking?.quantity || '2,000 kg'}</Text>
            </View>
          </View>

          {/* Recommended Arrival Window */}
          <View style={styles.arrivalCallout}>
            <MaterialCommunityIcons name="clock-fast" size={22} color="#854D0E" />
            <View style={{ flex: 1 }}>
              <Text style={styles.arrivalTitle}>मंडी पहुंचने का सही समय:</Text>
              <Text style={styles.arrivalTime}>{booking?.recommendedArrival || '11:35 AM – 11:50 AM'}</Text>
              <Text style={styles.arrivalNote}>इस समय पहुंचने पर आपको कतार में खड़ा नहीं रहना पड़ेगा।</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
            <MaterialCommunityIcons name="whatsapp" size={20} color="#15803D" />
            <Text style={styles.shareBtnText}>पर्ची शेयर करें</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('LiveQueue')}
            activeOpacity={0.88}
          >
            <MaterialCommunityIcons name="radar" size={20} color={COLORS.white} />
            <Text style={styles.homeBtnText}>लाइव कतार देखें</Text>
          </TouchableOpacity>
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  headerTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerSubText: {
    fontSize: 11,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
    gap: 14,
  },

  passCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  confirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    marginBottom: 14,
  },
  confirmedBannerText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
  },
  tokenBox: {
    alignItems: 'center',
    marginBottom: 14,
  },
  tokenLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  tokenValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  qrSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  },
  infoTable: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  arrivalCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  arrivalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
    marginVertical: 1,
  },
  arrivalNote: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },

  /* Actions */
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
  },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    ...SHADOWS.md,
  },
  homeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
  },
});
