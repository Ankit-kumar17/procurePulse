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
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!mobile || mobile.length < 10) {
      Alert.alert('अमान्य मोबाइल नंबर', 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!otp || otp.length < 4) {
      Alert.alert('ओटीपी दर्ज करें', 'कृपया 6 अंकों का ओटीपी दर्ज करें।');
      return;
    }

    setLoading(true);
    const result = await login(mobile, otp);
    setLoading(false);

    if (!result.success) {
      Alert.alert('लॉगिन विफल', result.error || 'लॉगिन में समस्या हुई, पुनः प्रयास करें।');
    }
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
            <MaterialCommunityIcons name="grain" size={38} color={COLORS.accent} />
          </View>
          <Text style={styles.brandTitle}>ProcurePulse</Text>
          <Text style={styles.brandSubtitle}>ई-उपार्जन 2.0 किसान सेवा</Text>
          <Text style={styles.heroDescription}>
            गेहूं व फसल उपार्जन, स्लॉट बुकिंग एवं लाइव गेट टोकन प्रणाली
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>किसान लॉगिन (Login)</Text>
            <Text style={styles.cardSubtitle}>
              पंजीकृत मोबाइल नंबर से लॉगिन करें
            </Text>
          </View>

          <Input
            label="मोबाइल नंबर (Mobile Number)"
            placeholder="10 अंकों का मोबाइल नंबर"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            icon="cellphone"
            maxLength={10}
            helperText="डेमो हेतु नंबर पहले से भरा है"
          />

          <Input
            label="ओटीपी (Enter OTP)"
            placeholder="6-अंकों का ओटीपी"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            icon="shield-key"
            maxLength={6}
            helperText="डेमो ओटीपी: 123456"
          />

          <Button
            title="लॉगिन करें (Login) →"
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
              डेमो खाता: रमेश कुमार (भोपाल किसान प्रोफाइल)
            </Text>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>या</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerPrompt}>नया किसान पंजीकरण? </Text>
            <Text style={styles.registerBold}>नया खाता बनाएं</Text>
          </TouchableOpacity>
        </View>

        {/* Toll-Free Help */}
        <View style={styles.assistanceBox}>
          <MaterialCommunityIcons name="phone-classic" size={20} color="#854D0E" />
          <View style={styles.assistanceTextWrap}>
            <Text style={styles.assistanceTitle}>कीपैड फोन उपयोगकर्ता व सहायता</Text>
            <Text style={styles.assistanceDesc}>
              बिना स्मार्टफोन वाले किसान नजदीकी CSC / MPOnline केंद्र या टोल-फ्री हेल्पलाइन {APP_CONFIG.helpline} से स्लॉट बुक कर सकते हैं।
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
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentDark,
    marginTop: 2,
  },
  heroDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: SPACING.md,
    lineHeight: 17,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE4EC',
    ...SHADOWS.sm,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  loginBtn: {
    marginTop: 10,
  },
  demoNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: RADIUS.sm,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoNoteText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 10,
    fontWeight: '700',
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  registerPrompt: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  registerBold: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  assistanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: RADIUS.md,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  assistanceTextWrap: {
    flex: 1,
  },
  assistanceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  assistanceDesc: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 15,
    marginTop: 2,
  },
});
