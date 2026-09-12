import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';

export default function PaymentStatusScreen({ navigation }) {
  const { payments, retryPayment } = useFarmer();
  const insets = useSafeAreaInsets();

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, SUCCESS, INITIATED, FAILED

  const handleOpenReceipt = (payment) => {
    setSelectedReceipt(payment);
    setReceiptModalVisible(true);
  };

  const handleRetry = async (paymentId) => {
    setRetryingId(paymentId);
    const res = await retryPayment(paymentId);
    setRetryingId(null);
    if (res.success) {
      Alert.alert(
        '✅ दोबारा पैसा भेजा गया',
        'बैंक विवरण अपडेट कर दिया गया है। PFMS द्वारा सीधे आपके आधार लिंक SBI खाते में राशि भेजी जा रही है।'
      );
    }
  };

  const handleShareReceipt = async () => {
    if (!selectedReceipt) return;
    try {
      await Share.share({
        message: `म.प्र. ई-उपार्जन भुगतान रसीद\nरसीद क्र.: ${selectedReceipt.receiptNo}\nफसल: ${selectedReceipt.crop}\nमात्रा: ${selectedReceipt.quantity}\nराशि: ₹${selectedReceipt.netAmount.toLocaleString('en-IN')}\nस्थिति: ${selectedReceipt.status}\nखाता: SBI ••••8392`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePlayVoiceGuide = () => {
    Alert.alert(
      '🔊 भुगतान सहायक (Voice Guide)',
      'नमस्ते किसान भाई!\n\n• ₹27,300 आपके खाते में जमा हो चुके हैं।\n• ₹18,200 बैंक द्वारा 24 घंटे में जमा होंगे।\n• ₹27,200 बैंक समस्या के कारण अटका है, कृपया "दोबारा भेजें" दबाएं।',
      [{ text: 'समझ गया (OK)' }]
    );
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  // Compute clean totals
  const totalReceived = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'INITIATED')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalFailed = payments
    .filter((p) => p.status === 'FAILED')
    .reduce((acc, p) => acc + p.netAmount, 0);

  // Helper to format crop names cleanly
  const getCleanCropInfo = (rawCrop) => {
    if (rawCrop.includes('Wheat') || rawCrop.includes('गेहूं')) {
      const variety = rawCrop.includes('Lokwan')
        ? 'Lokwan'
        : rawCrop.includes('Sharbati')
        ? 'Sharbati'
        : 'A-Grade';
      return { icon: '🌾', name: 'गेहूं', variety };
    }
    if (rawCrop.includes('Chana') || rawCrop.includes('चना') || rawCrop.includes('Gram')) {
      return { icon: '🌱', name: 'चना', variety: 'Desi Chana' };
    }
    return { icon: '🌾', name: rawCrop, variety: '' };
  };

  // Helper to format mandi names cleanly
  const getCleanMandiName = (rawMandi) => {
    if (rawMandi.includes('Kolar')) return 'Kolar Mandi';
    if (rawMandi.includes('Berasia')) return 'Berasia Mandi';
    if (rawMandi.includes('Sukhi')) return 'Sukhi Sevania Mandi';
    return rawMandi.split('(')[0].trim();
  };

  // Helper to format dates cleanly
  const getCleanDate = (rawDate) => {
    if (rawDate === '2026-03-29') return '29 मार्च';
    if (rawDate === '2026-04-05') return '05 अप्रैल';
    if (rawDate === '2026-02-14') return '14 फरवरी';
    return rawDate;
  };

  const filteredPayments = payments.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    return item.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. TOP HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>₹ फसल भुगतान</Text>
            <Text style={styles.headerSubText}>खाते में आया पैसा व रसीदें</Text>
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 95 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. TOTAL PASSBOOK CARD ─── */}
        <View style={styles.passbookCard}>
          <View style={styles.passbookHeader}>
            <View style={styles.bankTag}>
              <MaterialCommunityIcons name="bank" size={16} color={COLORS.primary} />
              <Text style={styles.bankTagText}>SBI खाता (••••8392)</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-circle" size={12} color="#15803D" />
              <Text style={styles.verifiedBadgeText}>सत्यापित</Text>
            </View>
          </View>

          <View style={styles.passbookBody}>
            <Text style={styles.passbookLabel}>कुल मिला पैसा (Credited)</Text>
            <Text style={styles.passbookAmount}>₹{totalReceived.toLocaleString('en-IN')}</Text>
          </View>

          {/* 3 Quick Filter / Summary Pills */}
          <View style={styles.overviewPillsRow}>
            <TouchableOpacity
              style={[
                styles.overviewPill,
                { backgroundColor: selectedFilter === 'SUCCESS' ? '#15803D' : '#DCFCE7' },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'SUCCESS' ? 'ALL' : 'SUCCESS')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'SUCCESS' ? '#FFFFFF' : '#15803D' },
                ]}
              >
                🟢 ₹{totalReceived.toLocaleString('en-IN')} मिला
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.overviewPill,
                { backgroundColor: selectedFilter === 'INITIATED' ? '#B45309' : '#FEF3C7' },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'INITIATED' ? 'ALL' : 'INITIATED')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'INITIATED' ? '#FFFFFF' : '#B45309' },
                ]}
              >
                🟡 ₹{totalPending.toLocaleString('en-IN')} आ रहा है
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.overviewPill,
                { backgroundColor: selectedFilter === 'FAILED' ? '#B91C1C' : '#FEE2E2' },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'FAILED' ? 'ALL' : 'FAILED')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'FAILED' ? '#FFFFFF' : '#B91C1C' },
                ]}
              >
                🔴 ₹{totalFailed.toLocaleString('en-IN')} अटका है
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── 3. SECTION HEADER ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>आपकी फसल बिक्री व भुगतान</Text>
          <Text style={styles.sectionSub}>
            {selectedFilter === 'ALL'
              ? `कुल रिकॉर्ड: ${payments.length}`
              : `फिल्टर लागू (${filteredPayments.length})`}
          </Text>
        </View>

        {/* ─── 4. ULTRA-EASY PAYMENT CARDS ─── */}
        <View style={styles.cardsList}>
          {filteredPayments.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isFailed = item.status === 'FAILED';
            const isInitiated = item.status === 'INITIATED';

            const cropInfo = getCleanCropInfo(item.crop);
            const mandiName = getCleanMandiName(item.centre);
            const formattedDate = getCleanDate(item.procurementDate);

            // Clean weight representation
            const kgVal = item.quantity?.split('(')[0]?.trim() || item.quantity;
            const qtlVal = item.quantity?.includes('Qtl')
              ? item.quantity.split('(')[1]?.replace(')', '')
              : '';

            return (
              <View key={item.id} style={styles.cleanCard}>
                {/* TOP ROW: Crop on Left, Rupee Amount on Right */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cropDetailsBox}>
                    <Text style={styles.cropTitle}>
                      {cropInfo.icon} {cropInfo.name}
                      {cropInfo.variety ? (
                        <Text style={styles.cropVariety}> ({cropInfo.variety})</Text>
                      ) : null}
                    </Text>
                    <Text style={styles.metaLine}>
                      📍 {mandiName} • 📅 {formattedDate}
                    </Text>
                    <Text style={styles.weightLine}>
                      ⚖️ {kgVal} {qtlVal ? `• ${qtlVal}` : ''}
                    </Text>
                  </View>

                  {/* Amount & Status Badge */}
                  <View style={styles.amountBox}>
                    <Text
                      style={[
                        styles.rupeeAmount,
                        isSuccess && { color: '#15803D' },
                        isInitiated && { color: '#B45309' },
                        isFailed && { color: '#B91C1C' },
                      ]}
                    >
                      ₹{item.netAmount.toLocaleString('en-IN')}
                    </Text>

                    {isSuccess && (
                      <View style={styles.badgeSuccess}>
                        <Text style={styles.badgeSuccessText}>🟢 मिला</Text>
                      </View>
                    )}

                    {isInitiated && (
                      <View style={styles.badgePending}>
                        <Text style={styles.badgePendingText}>🟡 आ रहा है</Text>
                      </View>
                    )}

                    {isFailed && (
                      <View style={styles.badgeFailed}>
                        <Text style={styles.badgeFailedText}>🔴 अटका है</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* ─── STATUS & ACTIONS SECTION ─── */}

                {/* Case 1: SUCCESS */}
                {isSuccess && (
                  <View style={styles.cardBottomRow}>
                    <View style={styles.successNoteRow}>
                      <MaterialCommunityIcons name="check-circle" size={15} color="#15803D" />
                      <Text style={styles.successNoteText}>बैंक खाते में जमा हो गया</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.receiptBtn}
                      onPress={() => handleOpenReceipt(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="file-document-outline" size={15} color={COLORS.primary} />
                      <Text style={styles.receiptBtnText}>रसीद देखें</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Case 2: INITIATED / PENDING */}
                {isInitiated && (
                  <View style={styles.cardBottomRow}>
                    <View style={styles.pendingNoteRow}>
                      <MaterialCommunityIcons name="clock-outline" size={15} color="#B45309" />
                      <Text style={styles.pendingNoteText}>24 घंटे में जमा होगा</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.receiptBtn}
                      onPress={() => handleOpenReceipt(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="file-document-outline" size={15} color={COLORS.primary} />
                      <Text style={styles.receiptBtnText}>रसीद देखें</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Case 3: FAILED / ACTION NEEDED (Super Simple for Farmer) */}
                {isFailed && (
                  <View style={styles.failedActionBox}>
                    <View style={styles.failedNoteRow}>
                      <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#DC2626" />
                      <Text style={styles.failedNoteText}>
                        बैंक खाते की समस्या के कारण पैसा रुका है
                      </Text>
                    </View>

                    {/* Simple 2 Buttons: [ 🔄 दोबारा भेजें ] & [ 📄 रसीद ] */}
                    <View style={styles.failedButtonsRow}>
                      <TouchableOpacity
                        style={styles.retryBtn}
                        onPress={() => handleRetry(item.id)}
                        disabled={retryingId === item.id}
                        activeOpacity={0.85}
                      >
                        {retryingId === item.id ? (
                          <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                          <>
                            <MaterialCommunityIcons name="refresh" size={16} color={COLORS.white} />
                            <Text style={styles.retryBtnText}>दोबारा भेजें (Retry)</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.receiptBtnSecondary}
                        onPress={() => handleOpenReceipt(item)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons name="file-document-outline" size={15} color={COLORS.text} />
                        <Text style={styles.receiptBtnSecondaryText}>रसीद</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 5. OFFICIAL WEIGHMENT & PAYOUT RECEIPT MODAL ─── */}
      <Modal
        visible={receiptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReceiptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptHeaderTitle}>म.प्र. ई-उपार्जन भुगतान रसीद</Text>
                <Text style={styles.receiptHeaderSub}>खाद्य एवं नागरिक आपूर्ति विभाग</Text>
              </View>
              <TouchableOpacity onPress={() => setReceiptModalVisible(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedReceipt && (
              <ScrollView style={styles.receiptBody} showsVerticalScrollIndicator={false}>
                <View style={styles.receiptBadgeRow}>
                  <View style={styles.receiptNumberBadge}>
                    <Text style={styles.receiptNumberText}>रसीद क्र.: {selectedReceipt.receiptNo}</Text>
                  </View>
                  <View
                    style={[
                      styles.receiptStatusPill,
                      {
                        backgroundColor:
                          selectedReceipt.status === 'SUCCESS' ? '#DCFCE7' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.receiptStatusPillText,
                        {
                          color:
                            selectedReceipt.status === 'SUCCESS' ? '#15803D' : '#92400E',
                        },
                      ]}
                    >
                      {selectedReceipt.status === 'SUCCESS' ? '✓ जमा हुआ' : 'प्रक्रिया में'}
                    </Text>
                  </View>
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>तौल पर्ची क्र.</Text>
                    <Text style={styles.tVal}>{selectedReceipt.weighmentSlipNo}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>उपार्जन केंद्र</Text>
                    <Text style={styles.tVal}>{selectedReceipt.centre?.split('(')[0]}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>तौल दिनांक</Text>
                    <Text style={styles.tVal}>{getCleanDate(selectedReceipt.procurementDate)}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>फसल व किस्म</Text>
                    <Text style={styles.tVal}>{selectedReceipt.crop}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>नमी स्तर</Text>
                    <Text style={[styles.tVal, { color: COLORS.success, fontWeight: '800' }]}>
                      {selectedReceipt.moistureLevel}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>कुल वजन</Text>
                    <Text style={styles.tVal}>{selectedReceipt.quantity}</Text>
                  </View>
                  <View style={[styles.tableRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>कुल शुद्ध राशि</Text>
                    <Text style={styles.totalVal}>
                      ₹{selectedReceipt.netAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                <View style={styles.bankVerifyBox}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankVerifyTitle}>आधार लिंक SBI खाते में भुगतान</Text>
                    <Text style={styles.bankVerifySub}>खाता क्र.: ••••8392</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareReceipt}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="share-variant" size={18} color={COLORS.primaryDark} />
                <Text style={styles.shareButtonText}>रसीद शेयर करें</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setReceiptModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.doneButtonText}>बंद करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 13,
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

  /* ─── 2. PASSBOOK CARD ─── */
  passbookCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    ...SHADOWS.sm,
  },
  passbookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankTagText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  passbookBody: {
    marginVertical: 10,
  },
  passbookLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  passbookAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#15803D',
    marginTop: 2,
  },
  overviewPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 6,
  },
  overviewPill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewPillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  /* ─── 3. SECTION HEADER ─── */
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  /* ─── 4. ULTRA-EASY PAYMENT CARDS ─── */
  cardsList: {
    gap: 14,
  },
  cleanCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cropDetailsBox: {
    flex: 1,
    paddingRight: 8,
  },
  cropTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  cropVariety: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  metaLine: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  weightLine: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 3,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  rupeeAmount: {
    fontSize: 19,
    fontWeight: '900',
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#15803D',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  badgePendingText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
  },
  badgeFailed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeFailedText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B91C1C',
  },

  /* ─── CARD BOTTOM ROWS (CLEAN & SEAMLESS) ─── */
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  successNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  successNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  pendingNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  receiptBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* ─── FAILED / ACTION BOX (EASY & UNCLUTTERED) ─── */
  failedActionBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  failedNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  failedNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  failedButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 8,
    ...SHADOWS.sm,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
  },
  receiptBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
  },
  receiptBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },

  /* ─── 5. MODAL ─── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  receiptCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.md,
    maxHeight: '85%',
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receiptHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  receiptHeaderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  receiptBody: {
    paddingVertical: 12,
  },
  receiptBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptNumberBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  receiptNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  receiptStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  receiptStatusPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  receiptTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.success,
  },
  bankVerifyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  bankVerifyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bankVerifySub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  doneButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
});
