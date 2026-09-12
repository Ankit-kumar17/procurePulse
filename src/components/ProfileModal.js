import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import InfoRow from './InfoRow';
import Button from './Button';
import Badge from './Badge';

export default function ProfileModal({
  visible,
  onClose,
  farmer,
  onLogout,
}) {
  if (!visible) return null;

  const handleCallHelpline = () => {
    Alert.alert(
      '📞 सीएम किसान हेल्पलाइन (181)',
      'क्या आप 181 टोल-फ्री किसान हेल्पलाइन पर कॉल करना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'हाँ, कॉल करें',
          onPress: () => {
            Linking.openURL('tel:181').catch(() => {
              Alert.alert('हेल्पलाइन नंबर', 'कृपया डायल करें: 181 या 1800-233-0000');
            });
          },
        },
      ]
    );
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      'लॉगआउट',
      'क्या आप ProcurePulse से लॉगआउट करना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'लॉगआउट',
          style: 'destructive',
          onPress: () => {
            onClose();
            if (onLogout) onLogout();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarBox}>
                <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.farmerName}>{farmer?.name || 'रमेश कुमार'}</Text>
                <Text style={styles.farmerId}>किसान पंजीयन: {farmer?.farmerId || 'MP-FR-2026-0001'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
            {/* Account Details */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>खाता विवरण</Text>
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
                icon="bank"
                label="बैंक खाता (DBT)"
                value="SBI ••••8392 (सत्यापित ✓)"
                showDivider={true}
              />
              <InfoRow
                icon="shield-check"
                label="समग्र आईडी"
                value="198472910"
                showDivider={false}
              />
            </View>

            {/* Language & Support Options */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>सुविधाएं व सहायता</Text>

              <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
                <View style={styles.optionLeft}>
                  <MaterialCommunityIcons name="translate" size={20} color={COLORS.primary} />
                  <Text style={styles.optionText}>भाषा (Language)</Text>
                </View>
                <Badge label="हिन्दी (सक्रिय)" variant="success" size="sm" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.optionRow} onPress={handleCallHelpline} activeOpacity={0.7}>
                <View style={styles.optionLeft}>
                  <MaterialCommunityIcons name="phone" size={20} color={COLORS.primary} />
                  <Text style={styles.optionText}>सीएम किसान हेल्पलाइन</Text>
                </View>
                <Text style={styles.optionHighlight}>181 (टोल-फ्री)</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Action */}
            <Button
              title="लॉगआउट करें (Logout)"
              icon="logout"
              variant="danger"
              size="md"
              fullWidth
              onPress={handleLogoutConfirm}
              style={{ marginTop: SPACING.md, marginBottom: SPACING.sm }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingBottom: SPACING.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmerName: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.text,
  },
  farmerId: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  sheetBody: {
    padding: SPACING.md,
  },
  sectionBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  optionHighlight: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});
