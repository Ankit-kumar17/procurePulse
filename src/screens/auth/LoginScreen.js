import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { APP_CONFIG } from '../../utils/constants';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!mobile || mobile.length < 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    const result = await login(mobile, otp);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Something went wrong');
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    Alert.alert('OTP Sent', 'Simulated OTP: 123456 has been sent to ' + mobile);
  };

  const topPadding = Math.max(insets.top, 24) + SPACING.md;
  const bottomPadding = Math.max(insets.bottom, 20) + SPACING.lg;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="grain" size={42} color={COLORS.accent} />
          </View>
          <Text style={styles.brandTitle}>ProcurePulse</Text>
          <Text style={styles.brandSubtitle}>e-Uparjan 2.0 Farmer Portal</Text>
          <Text style={styles.heroDescription}>
            Smart Wheat Procurement, Slot Booking & Live Gate Queue Tracking
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Farmer Login / किसान लॉगिन</Text>
            <Text style={styles.cardSubtitle}>
              Sign in with your registered mobile number
            </Text>
          </View>

          <Input
            label="Mobile Number / मोबाइल नंबर"
            placeholder="Enter 10-digit mobile"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            icon="cellphone"
            maxLength={10}
            helperText="Pre-filled for SIH 2026 Demo"
          />

          <View style={styles.otpRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="Enter OTP / ओटीपी दर्ज करें"
                placeholder="6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                icon="shield-key"
                maxLength={6}
                helperText="Pre-filled demo OTP: 123456"
              />
            </View>
          </View>

          <Button
            title="Login to Dashboard"
            variant="primary"
            size="lg"
            icon="login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <View style={styles.demoNoteBox}>
            <MaterialCommunityIcons name="information" size={18} color={COLORS.primary} />
            <Text style={styles.demoNoteText}>
              SIH Demo Mode: Pre-configured with sample farmer profile (Ramesh Kumar, Bhopal).
            </Text>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerPrompt}>New Farmer? </Text>
            <Text style={styles.registerBold}>Register New Land & Account</Text>
          </TouchableOpacity>
        </View>

        {/* Non-Smartphone / CSC Assistance Box */}
        <View style={styles.assistanceBox}>
          <MaterialCommunityIcons name="phone-classic" size={20} color={COLORS.accentDark} />
          <View style={styles.assistanceTextWrap}>
            <Text style={styles.assistanceTitle}>Without Smartphone / कीपैड फोन उपयोगकर्ता</Text>
            <Text style={styles.assistanceDesc}>
              Farmers without smartphones can book slots via nearest CSC Kiosk, MPOnline, or Toll-Free IVR ({APP_CONFIG.helpline}).
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    ...SHADOWS.gold,
    marginBottom: SPACING.sm,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accentDark,
    marginTop: 2,
  },
  heroDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: '85%',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  loginBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  demoNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.infoLight,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: 8,
  },
  demoNoteText: {
    fontSize: 11,
    color: COLORS.primary,
    flex: 1,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  registerPrompt: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerBold: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  assistanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.4)',
    gap: 10,
  },
  assistanceTextWrap: {
    flex: 1,
  },
  assistanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  assistanceDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 3,
    lineHeight: 16,
  },
});
