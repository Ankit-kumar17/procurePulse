import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';

export default function GrievanceListScreen({ navigation }) {
  const { grievances } = useFarmer();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('ALL'); // ALL, IN_PROGRESS, RESOLVED

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

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

  // Helper to get clean Hindi category & icon
  const getCleanCategory = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('payment')) return { icon: 'cash-clock', title: '💰 भुगतान में देरी', color: '#B45309' };
    if (lower.includes('weight') || lower.includes('tare')) return { icon: 'scale-balance', title: '⚖️ तौल / वजन में अंतर', color: '#1E40AF' };
    if (lower.includes('moisture') || lower.includes('quality')) return { icon: 'water-percent', title: '💧 नमी / गुणवत्ता विवाद', color: '#0369A1' };
    if (lower.includes('slot') || lower.includes('booking')) return { icon: 'calendar-clock', title: '🌾 स्लॉट / टोकन समस्या', color: '#15803D' };
    return { icon: 'alert-circle-outline', title: '📢 सामान्य शिकायत', color: '#475569' };
  };

  // Helper to translate status
  const getCleanStatus = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower.includes('resolved') || lower.includes('हल')) {
      return { label: '🟢 समाधान हो गया', bg: '#DCFCE7', text: '#15803D', isResolved: true };
    }
    if (lower.includes('progress') || lower.includes('जांच')) {
      return { label: '🟡 जांच जारी है', bg: '#FEF3C7', text: '#B45309', isInProgress: true };
    }
    return { label: '🔵 दर्ज हुई', bg: '#E0F2FE', text: '#0369A1', isOpen: true };
  };

  // Helper to format Hindi date
  const getCleanDate = (rawDate) => {
    if (rawDate === '2026-04-10') return '10 अप्रैल 2026';
    if (rawDate === '2026-03-30') return '30 मार्च 2026';
    return rawDate;
  };

  // Clean description mapper
  const getCleanDesc = (item) => {
    if (item.id === 'GRV-2026-0041') {
      return '5 अप्रैल को बैरसिया केंद्र पर गेहूं बेचा था। ₹18,200 का भुगतान अभी तक SBI बैंक खाते में नहीं आया है।';
    }
    if (item.id === 'GRV-2026-0019') {
      return 'ट्रॉली का खाली वजन (Tare weight) कांटे पर 40 किलो अधिक दर्ज कर लिया गया था।';
    }
    return item.description;
  };

  // Clean response mapper
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. TOP HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>📢 सहायता व शिकायत</Text>
            <Text style={styles.headerSubText}>समस्या का सीधा समाधान नोडल अधिकारी द्वारा</Text>
          </View>

          {/* Voice Assistant Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handlePlayVoiceGuide}
            activeOpacity={0.8}
            accessibilityLabel="आवाज से सुनें"
          >
            <MaterialCommunityIcons name="volume-high" size={18} color={COLORS.primaryDark} />
            <Text style={styles.voiceButtonText}>सुनें</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. DIRECT HELPLINE CALL CARD (181) ─── */}
        <View style={styles.helplineCard}>
          <View style={styles.helpIconBox}>
            <MaterialCommunityIcons name="phone-in-talk" size={24} color="#854D0E" />
          </View>
          <View style={styles.helpContent}>
            <Text style={styles.helpTag}>📞 24x7 टोल-फ्री सहायता</Text>
            <Text style={styles.helpPhone}>181 / 1800-233-0000</Text>
            <Text style={styles.helpSub}>सीएम किसान हेल्पलाइन पर सीधे बात करें</Text>
          </View>
          <TouchableOpacity
            style={styles.callNowBtn}
            onPress={handleCallHelpline}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="phone" size={16} color={COLORS.white} />
            <Text style={styles.callNowBtnText}>कॉल करें</Text>
          </TouchableOpacity>
        </View>

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
              <Text style={styles.quickTileText}>तौल में गड़बड़ी</Text>
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
              <Text style={styles.quickTileText}>अन्य शिकायत</Text>
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
              <View key={item.id} style={styles.cleanCard}>
                {/* Header Row: Category & Status */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryTitle}>{catInfo.title}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusPillText, { color: statusInfo.text }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* Complaint Description */}
                <Text style={styles.cardDescText}>{desc}</Text>

                {/* Officer Official Response Box */}
                {response ? (
                  <View style={styles.responseContainer}>
                    <View style={styles.responseHeaderRow}>
                      <MaterialCommunityIcons name="account-tie" size={16} color={COLORS.primary} />
                      <Text style={styles.responseOfficerTitle}>👨‍💼 नोडल अधिकारी का समाधान:</Text>
                    </View>
                    <Text style={styles.responseText}>{response}</Text>
                  </View>
                ) : null}

                {/* Footer: Ticket ID & Date */}
                <View style={styles.cardFooter}>
                  <Text style={styles.ticketIdText}>क्र.: {item.id}</Text>
                  <Text style={styles.dateText}>📅 {dateStr}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 6. BIG BOTTOM ACTION BUTTON ─── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <TouchableOpacity
          style={styles.bigRaiseButton}
          onPress={() => navigation.navigate('GrievanceForm')}
          activeOpacity={0.88}
        >
          <MaterialCommunityIcons name="plus-circle" size={22} color={COLORS.primaryDark} />
          <Text style={styles.bigRaiseButtonText}>➕ नई शिकायत दर्ज करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerTitleBox: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 2,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  voiceButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
  },

  /* ─── 2. HELPLINE CARD ─── */
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: 16,
    gap: 10,
    ...SHADOWS.sm,
  },
  helpIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpContent: {
    flex: 1,
  },
  helpTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  helpPhone: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
    marginTop: 1,
  },
  helpSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 1,
  },
  callNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  callNowBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.white,
  },

  /* ─── 3. QUICK TILES ─── */
  quickSection: {
    marginBottom: 16,
  },
  quickSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  quickTilesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickTile: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  quickTileIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickTileText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  /* ─── 4. FILTER TABS ─── */
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },

  /* ─── 5. COMPLAINT CARDS ─── */
  cardsList: {
    gap: 12,
  },
  cleanCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  cardDescText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
    fontWeight: '500',
    marginBottom: 8,
  },
  responseContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  responseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  responseOfficerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  responseText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ticketIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  /* ─── 6. BIG BOTTOM BAR ─── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...SHADOWS.lg,
  },
  bigRaiseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.gold,
  },
  bigRaiseButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
});
