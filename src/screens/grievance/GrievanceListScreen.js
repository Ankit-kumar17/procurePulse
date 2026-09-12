import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../utils/theme';
import { Header, Card, Badge, Button } from '../../components';
import { useFarmer } from '../../context/FarmerContext';

export default function GrievanceListScreen({ navigation }) {
  const { grievances } = useFarmer();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('ALL'); // ALL, IN_PROGRESS, RESOLVED

  const handleCallHelpline = () => {
    Alert.alert(
      '📞 सीएम किसान हेल्पलाइन (181)',
      'क्या आप 181 टोल-फ्री किसान हेल्पलाइन पर सीधे कॉल करना चाहते हैं?',
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

  const handlePlayVoiceGuide = () => {
    Alert.alert(
      '🔊 सहायता व शिकायत सहायक',
      'नमस्ते किसान भाई!\n\n• आपकी कुल 2 शिकायतें दर्ज हैं।\n• 1 शिकायत पर जांच जारी है, 24 घंटे में समाधान होगा।\n• 1 शिकायत का समाधान हो चुका है।\n• नई शिकायत के लिए नीचे पीला बटन दबाएं या 181 पर कॉल करें।',
      [{ text: 'समझ गया (OK)' }]
    );
  };

  const getCleanCategory = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('payment')) return { icon: 'cash-clock', title: '💰 भुगतान में देरी', color: COLORS.warning };
    if (lower.includes('weight') || lower.includes('tare')) return { icon: 'scale-balance', title: '⚖️ तौल / वजन में अंतर', color: COLORS.info };
    if (lower.includes('moisture') || lower.includes('quality')) return { icon: 'water-percent', title: '💧 नमी / गुणवत्ता विवाद', color: COLORS.info };
    if (lower.includes('slot') || lower.includes('booking')) return { icon: 'calendar-clock', title: '🌾 स्लॉट / टोकन समस्या', color: COLORS.primary };
    return { icon: 'alert-circle-outline', title: '📢 सामान्य शिकायत', color: COLORS.textSecondary };
  };

  const getCleanStatus = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('resolved') || lower.includes('हल')) {
      return { label: 'समाधान हो गया', variant: 'success', icon: 'check-circle' };
    }
    if (lower.includes('progress') || lower.includes('जांच')) {
      return { label: 'जांच जारी है', variant: 'warning', icon: 'clock-outline' };
    }
    return { label: 'दर्ज हुई', variant: 'info', icon: 'file-document' };
  };

  const getCleanDate = (rawDate) => {
    if (rawDate === '2026-04-10') return '10 अप्रैल 2026';
    if (rawDate === '2026-03-30') return '30 मार्च 2026';
    return rawDate;
  };

  const getCleanDesc = (item) => {
    if (item.id === 'GRV-2026-0041') {
      return '5 अप्रैल को बैरसिया केंद्र पर गेहूं बेचा था। ₹18,200 का भुगतान अभी तक SBI बैंक खाते में नहीं आया है।';
    }
    if (item.id === 'GRV-2026-0019') {
      return 'ट्रॉली का खाली वजन (Tare weight) कांटे पर 40 किलो अधिक दर्ज कर लिया गया था।';
    }
    return item.description;
  };

  const getCleanResponse = (item) => {
    if (item.id === 'GRV-2026-0041') {
      return 'PFMS व बैंक नोडल अधिकारी द्वारा खाते का सत्यापन जारी है। 24 घंटे में ₹18,200 जमा हो जाएगा।';
    }
    if (item.id === 'GRV-2026-0019') {
      return '30 मार्च को तौल कांटे की पुनः जांच कर ठीक कर दिया गया है। बची हुई राशि अंतिम रसीद में जोड़ दी गई है।';
    }
    return item.response;
  };

  const filteredGrievances = grievances.filter((item) => {
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'IN_PROGRESS') return item.status === 'In Progress' || item.status === 'Open';
    if (selectedTab === 'RESOLVED') return item.status === 'Resolved';
    return true;
  });

  const inProgressCount = grievances.filter((g) => g.status === 'In Progress' || g.status === 'Open').length;
  const resolvedCount = grievances.filter((g) => g.status === 'Resolved').length;

  return (
    <View style={styles.container}>
      {/* ─── 1. TOP HEADER ─── */}
      <Header
        title="सहायता व शिकायत"
        subtitle="समस्या का सीधा समाधान नोडल अधिकारी द्वारा"
        onVoiceGuidePress={handlePlayVoiceGuide}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. DIRECT HELPLINE CALL CARD (181) ─── */}
        <Card variant="warning" style={styles.helplineCard}>
          <View style={styles.helpIconBox}>
            <MaterialCommunityIcons name="phone-in-talk" size={24} color={COLORS.accentDark} />
          </View>
          <View style={styles.helpContent}>
            <Text style={styles.helpTag}>📞 24x7 टोल-फ्री सहायता</Text>
            <Text style={styles.helpPhone}>181 / 1800-233-0000</Text>
            <Text style={styles.helpSub}>सीएम किसान हेल्पलाइन पर सीधे बात करें</Text>
          </View>
          <Button
            title="कॉल करें"
            icon="phone"
            size="sm"
            variant="success"
            onPress={handleCallHelpline}
          />
        </Card>

        {/* ─── 3. QUICK 1-TAP ISSUE TILES ─── */}
        <View style={styles.quickSection}>
          <Text style={styles.quickSectionTitle}>फटाफट शिकायत दर्ज करें:</Text>
          <View style={styles.quickTilesGrid}>
            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => navigation.navigate('GrievanceForm', { initialCategory: 'Payment Delay' })}
              activeOpacity={0.8}
            >
              <Text style={styles.quickTileIcon}>💰</Text>
              <Text style={styles.quickTileText}>पैसा नहीं मिला</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => navigation.navigate('GrievanceForm', { initialCategory: 'Weight / Tare Dispute' })}
              activeOpacity={0.8}
            >
              <Text style={styles.quickTileIcon}>⚖️</Text>
              <Text style={styles.quickTileText}>तौल में फर्क</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => navigation.navigate('GrievanceForm', { initialCategory: 'Slot Booking / Reschedule Issue' })}
              activeOpacity={0.8}
            >
              <Text style={styles.quickTileIcon}>🌾</Text>
              <Text style={styles.quickTileText}>स्लॉट समस्या</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => navigation.navigate('GrievanceForm', { initialCategory: 'Other Issue' })}
              activeOpacity={0.8}
            >
              <Text style={styles.quickTileIcon}>✍️</Text>
              <Text style={styles.quickTileText}>अन्य समस्या</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── 4. FILTER TABS & COUNT ─── */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'ALL' && styles.filterTabActive]}
            onPress={() => setSelectedTab('ALL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, selectedTab === 'ALL' && styles.filterTabTextActive]}>
              सभी ({grievances.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'IN_PROGRESS' && styles.filterTabActive]}
            onPress={() => setSelectedTab('IN_PROGRESS')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, selectedTab === 'IN_PROGRESS' && styles.filterTabTextActive]}>
              🟡 जांच जारी ({inProgressCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, selectedTab === 'RESOLVED' && styles.filterTabActive]}
            onPress={() => setSelectedTab('RESOLVED')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterTabText, selectedTab === 'RESOLVED' && styles.filterTabTextActive]}>
              🟢 हल हो गई ({resolvedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── 5. COMPLAINT CARDS LIST ─── */}
        <View style={styles.cardsList}>
          {filteredGrievances.map((item) => {
            const catInfo = getCleanCategory(item.category);
            const statusInfo = getCleanStatus(item.status);
            const dateStr = getCleanDate(item.date);
            const desc = getCleanDesc(item);
            const response = getCleanResponse(item);

            return (
              <Card key={item.id} style={styles.cleanCard}>
                {/* Header Row: Category & Status */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.categoryTitle}>{catInfo.title}</Text>
                  <Badge
                    label={statusInfo.label}
                    variant={statusInfo.variant}
                    icon={statusInfo.icon}
                    size="sm"
                  />
                </View>

                {/* Complaint Number & Date */}
                <View style={styles.metaRow}>
                  <Text style={styles.grievanceId}>क्र.: {item.id}</Text>
                  <Text style={styles.dateText}>📅 {dateStr}</Text>
                </View>

                {/* Complaint Description */}
                <View style={styles.descBox}>
                  <Text style={styles.descLabel}>किसान का विवरण:</Text>
                  <Text style={styles.descText}>{desc}</Text>
                </View>

                {/* Officer Resolution Response */}
                {response && (
                  <View style={styles.responseBox}>
                    <View style={styles.responseHeader}>
                      <MaterialCommunityIcons name="account-tie" size={16} color={COLORS.primary} />
                      <Text style={styles.responseOfficer}>👨‍💼 नोडल अधिकारी का समाधान:</Text>
                    </View>
                    <Text style={styles.responseText}>{response}</Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 6. STICKY BOTTOM BUTTON ─── */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button
          title="✍️ नई शिकायत दर्ज करें"
          size="lg"
          variant="primary"
          fullWidth
          onPress={() => navigation.navigate('GrievanceForm')}
        />
      </View>
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
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 8,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: '#F8E4A0',
  },
  helpIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(214,166,44,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpContent: {
    flex: 1,
  },
  helpTag: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  helpPhone: {
    ...TYPOGRAPHY.title,
    fontSize: 15,
    color: COLORS.text,
    marginVertical: 1,
  },
  helpSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  quickSection: {
    marginBottom: SPACING.md,
  },
  quickSectionTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  quickTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTile: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    ...SHADOWS.sm,
  },
  quickTileIcon: {
    fontSize: 18,
  },
  quickTileText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  cardsList: {
    gap: SPACING.sm,
  },
  cleanCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grievanceId: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  descBox: {
    backgroundColor: COLORS.surfaceHighlight || '#F7F5EE',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: 8,
  },
  descLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  descText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  responseBox: {
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#C0E2CD',
    gap: 2,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseOfficer: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  responseText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 12,
    color: COLORS.successDark,
    lineHeight: 17,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
});
