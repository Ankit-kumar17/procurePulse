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
  const [expandedErrorId, setExpandedErrorId] = useState(null);

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
      'नमस्ते किसान भाई!\n\n• ₹27,300 आपके खाते में आ चुके हैं।\n• ₹18,200 बैंक द्वारा 24-48 घंटे में जमा होंगे।\n• ₹27,200 बैंक विवरण के कारण रुका है, कृपया "दोबारा पैसा भेजें" दबाएं।',
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

  // Helper to format crop names without nested parentheses
  const getCleanCropInfo = (rawCrop) => {
    if (rawCrop.includes('Wheat') || rawCrop.includes('गेहूं')) {
      const variety = rawCrop.includes('Lokwan')
        ? 'Lokwan'
        : rawCrop.includes('Sharbati')
        ? 'Sharbati'
        : 'A-Grade';
      return { hindi: '🌾 गेहूं', eng: variety };
    }
    if (rawCrop.includes('Chana') || rawCrop.includes('चना') || rawCrop.includes('Gram')) {
      return { hindi: '🌱 चना', eng: 'Desi Chana' };
    }
    return { hindi: rawCrop, eng: '' };
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
    if (rawDate === '2026-03-29') return '29 मार्च 2026';
    if (rawDate === '2026-04-05') return '05 अप्रैल 2026';
    if (rawDate === '2026-02-14') return '14 फरवरी 2026';
    return rawDate;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. COMPACT HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>₹ भुगतान इतिहास</Text>
            <Text style={styles.headerSubText}>खाते में आया पैसा व रसीदें</Text>
          </View>

          {/* Voice Assistant Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handlePlayVoiceGuide}
            activeOpacity={0.8}
            accessibilityLabel="आवाज से सुनें"
          >
            <MaterialCommunityIcons name="volume-high" size={17} color={COLORS.primaryDark} />
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
              <Text style={styles.bankTagText}>भारतीय स्टेट बैंक (SBI ••••8392)</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="shield-check" size={12} color={COLORS.success} />
              <Text style={styles.verifiedBadgeText}>सत्यापित</Text>
            </View>
          </View>

          <View style={styles.passbookBody}>
            <Text style={styles.passbookLabel}>कुल मिला पैसा (Total Credited)</Text>
            <Text style={styles.passbookAmount}>₹{totalReceived.toLocaleString('en-IN')}</Text>
          </View>

          {/* 3 Status Overview Pills */}
          <View style={styles.overviewPillsRow}>
            <View style={[styles.overviewPill, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.overviewPillText, { color: '#15803D' }]}>
                🟢 ₹{totalReceived.toLocaleString('en-IN')} मिला
              </Text>
            </View>
            <View style={[styles.overviewPill, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.overviewPillText, { color: '#B45309' }]}>
                🟡 ₹{totalPending.toLocaleString('en-IN')} आने वाला
              </Text>
            </View>
            <View style={[styles.overviewPill, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.overviewPillText, { color: '#B91C1C' }]}>
                🔴 ₹{totalFailed.toLocaleString('en-IN')} रुका है
              </Text>
            </View>
          </View>
        </View>

        {/* ─── 3. SECTION HEADER ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🌾 बिक्री और भुगतान सूची</Text>
          <Text style={styles.sectionSub}>आपकी फसल बिक्री का रिकॉर्ड ({payments.length})</Text>
        </View>

        {/* ─── 4. CLEAN WHITE PAYMENT CARDS ─── */}
        <View style={styles.cardsList}>
          {payments.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isFailed = item.status === 'FAILED';
            const isInitiated = item.status === 'INITIATED';

            const cropInfo = getCleanCropInfo(item.crop);
            const mandiName = getCleanMandiName(item.centre);
            const formattedDate = getCleanDate(item.procurementDate);

            // Quantity formatting
            const kgVal = item.quantity?.split('(')[0]?.trim() || item.quantity;
            const qtlVal = item.quantity?.includes('Qtl')
              ? item.quantity.split('(')[1]?.replace(')', '')
              : '';

            return (
              <View key={item.id} style={styles.cleanCard}>
                {/* Top Row: Crop & Clean Status Badge */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cropTitleBox}>
                    <Text style={styles.cropTitle}>{cropInfo.hindi}</Text>
                    {cropInfo.eng ? (
                      <Text style={styles.cropSubtitle}>{cropInfo.eng}</Text>
                    ) : null}
                  </View>

                  {isSuccess && (
                    <View style={styles.statusTagSuccess}>
                      <Text style={styles.statusTagTextSuccess}>🟢 ₹{item.netAmount.toLocaleString('en-IN')} मिला</Text>
                    </View>
                  )}

                  {isInitiated && (
                    <View style={styles.statusTagPending}>
                      <Text style={styles.statusTagTextPending}>🟡 ₹{item.netAmount.toLocaleString('en-IN')} आ रहा है</Text>
                    </View>
                  )}

                  {isFailed && (
                    <View style={styles.statusTagFailed}>
                      <Text style={styles.statusTagTextFailed}>🔴 ₹{item.netAmount.toLocaleString('en-IN')} रुका है</Text>
                    </View>
                  )}
                </View>

                {/* Details Row */}
                <View style={styles.cardMetaRow}>
                  <Text style={styles.metaItem}>📍 {mandiName}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaItem}>📅 {formattedDate}</Text>
                </View>

                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityVal}>
                    ⚖️ {kgVal} {qtlVal ? `(${qtlVal})` : ''}
                  </Text>
                </View>

                {/* Pending Note */}
                {isInitiated && (
                  <View style={styles.pendingNote}>
                    <Text style={styles.pendingNoteText}>
                      ⏳ बैंक द्वारा 24 से 48 घंटे में सीधे खाते में जमा होगा।
                    </Text>
                  </View>
                )}

                {/* Failed Error Note & Action */}
                {isFailed && (
                  <View style={styles.failedContainer}>
                    <Text style={styles.failedMainText}>
                      ⚠️ बैंक खाता / IFSC में त्रुटि के कारण रुका है
                    </Text>
                    <Text style={styles.failedSubText}>
                      कृपया नीचे बटन दबाकर दोबारा भुगतान प्रक्रिया शुरू करें:
                    </Text>

                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={() => handleRetry(item.id)}
                      disabled={retryingId === item.id}
                      activeOpacity={0.85}
                    >
                      {retryingId === item.id ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                      ) : (
                        <View style={styles.retryButtonContent}>
                          <MaterialCommunityIcons name="refresh" size={16} color={COLORS.white} />
                          <Text style={styles.retryButtonText}>दोबारा पैसा भेजें (Retry)</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.errorExpandBtn}
                      onPress={() => setExpandedErrorId(expandedErrorId === item.id ? null : item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.errorExpandText}>
                        ⓘ {expandedErrorId === item.id ? 'विवरण छिपाएं' : 'तकनीकी कारण देखें'}
                      </Text>
                    </TouchableOpacity>

                    {expandedErrorId === item.id && (
                      <View style={styles.techErrorBox}>
                        <Text style={styles.techErrorText}>
                          {item.failureReason || 'IFSC code mismatch during PFMS routing.'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.divider} />

                {/* View Slip Action */}
                <TouchableOpacity
                  style={styles.slipActionRow}
                  onPress={() => handleOpenReceipt(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.slipActionText}>📄 रसीद देखें →</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── 5. DETAILED WEIGHMENT & PAYOUT MODAL ─── */}
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
                  <View style={[
                    styles.receiptStatusPill,
                    { backgroundColor: selectedReceipt.status === 'SUCCESS' ? '#DCFCE7' : '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.receiptStatusPillText,
                      { color: selectedReceipt.status === 'SUCCESS' ? '#15803D' : '#92400E' }
                    ]}>
                      {selectedReceipt.status === 'SUCCESS' ? '✓ जमा हुआ' : 'प्रक्रिया में'}
                    </Text>
                  </View>
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>तौल पर्ची</Text>
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
                    <Text style={styles.totalVal}>₹{selectedReceipt.netAmount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                <View style={styles.bankVerifyBox}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankVerifyTitle}>आधार सीडेड SBI खाते में जमा</Text>
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
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  voiceButtonText: {
    fontSize: 12,
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
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
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
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.success,
    marginTop: 2,
  },
  overviewPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 4,
  },
  overviewPill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
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
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  /* ─── 4. CARDS LIST ─── */
  cardsList: {
    gap: 14,
  },
  cleanCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cropTitleBox: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.text,
  },
  cropSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  statusTagSuccess: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagTextSuccess: {
    fontSize: 12,
    fontWeight: '900',
    color: '#15803D',
  },
  statusTagPending: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagTextPending: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
  },
  statusTagFailed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagTextFailed: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B91C1C',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  metaItem: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  quantityContainer: {
    marginTop: 4,
  },
  quantityVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  pendingNote: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingNoteText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
  },
  failedContainer: {
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  failedMainText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.error,
  },
  failedSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...SHADOWS.sm,
  },
  retryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
  },
  errorExpandBtn: {
    alignSelf: 'center',
    paddingTop: 6,
  },
  errorExpandText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  techErrorBox: {
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  techErrorText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
    marginBottom: 8,
  },
  slipActionRow: {
    alignItems: 'center',
  },
  slipActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
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
