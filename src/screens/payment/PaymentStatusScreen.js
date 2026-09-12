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
            <Text style={styles.headerTitleText}>💰 भुगतान</Text>
            <Text style={styles.headerSubText}>आपके खाते में आया पैसा</Text>
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
        {/* ─── 2. SIMPLE SUMMARY STRIP ─── */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.summaryStatusLabel}>मिला</Text>
            </View>
            <Text style={[styles.summaryAmountText, { color: COLORS.success }]}>
              ₹{totalReceived.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#D97706' }]} />
              <Text style={styles.summaryStatusLabel}>आने वाला</Text>
            </View>
            <Text style={[styles.summaryAmountText, { color: '#B45309' }]}>
              ₹{totalPending.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.error }]} />
              <Text style={styles.summaryStatusLabel}>रुका हुआ</Text>
            </View>
            <Text style={[styles.summaryAmountText, { color: COLORS.error }]}>
              ₹{totalFailed.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* ─── 3. SECTION TITLE ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionMainTitle}>🌾 बिक्री और भुगतान</Text>
          <Text style={styles.sectionSubTitle}>आपकी फसल की बिक्री का रिकॉर्ड • {payments.length} रिकॉर्ड</Text>
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
              <View key={item.id} style={styles.cleanPaymentCard}>
                {/* Top Row: Crop Name + Status Pill */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cropNameCol}>
                    <Text style={styles.cropHindiName}>{cropInfo.hindi}</Text>
                    {cropInfo.eng ? (
                      <Text style={styles.cropVarietyName}>{cropInfo.eng}</Text>
                    ) : null}
                  </View>

                  {/* Status Pills */}
                  {isSuccess && (
                    <View style={styles.pillSuccess}>
                      <MaterialCommunityIcons name="check" size={13} color="#15803D" />
                      <Text style={styles.pillTextSuccess}>पैसा मिल गया</Text>
                    </View>
                  )}

                  {isInitiated && (
                    <View style={styles.pillPending}>
                      <MaterialCommunityIcons name="clock-outline" size={13} color="#92400E" />
                      <Text style={styles.pillTextPending}>पैसा भेजा गया</Text>
                    </View>
                  )}

                  {isFailed && (
                    <View style={styles.pillFailed}>
                      <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#B91C1C" />
                      <Text style={styles.pillTextFailed}>भुगतान रुका है</Text>
                    </View>
                  )}
                </View>

                {/* Dominant Amount */}
                <View style={styles.amountContainer}>
                  <Text style={styles.amountValue}>
                    ₹{item.netAmount.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Secondary Glanceable Meta */}
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>📍 {mandiName}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>📅 {formattedDate}</Text>
                </View>

                <View style={styles.quantityRow}>
                  <Text style={styles.quantityText}>
                    ⚖️ {kgVal} {qtlVal ? `(${qtlVal})` : ''}
                  </Text>
                </View>

                {/* Pending State Message */}
                {isInitiated && (
                  <View style={styles.pendingMessageBox}>
                    <Text style={styles.pendingMessageText}>
                      🟡 24–48 घंटे में बैंक खाते में आ जाएगा।
                    </Text>
                  </View>
                )}

                {/* Failed State Message & Action */}
                {isFailed && (
                  <View style={styles.failedContainer}>
                    <Text style={styles.failedMainText}>
                      🔴 बैंक की जानकारी में समस्या है।
                    </Text>
                    <Text style={styles.failedSubText}>
                      खाता नंबर / IFSC की जांच करें।
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
                        <View style={styles.retryButtonInner}>
                          <MaterialCommunityIcons name="refresh" size={16} color={COLORS.white} />
                          <Text style={styles.retryButtonText}>दोबारा पैसा भेजें</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Expandable technical reason */}
                    <TouchableOpacity
                      style={styles.errorExpandLink}
                      onPress={() => setExpandedErrorId(expandedErrorId === item.id ? null : item.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.errorExpandText}>
                        ⓘ {expandedErrorId === item.id ? 'विवरण छिपाएं' : 'समस्या की जानकारी'}
                      </Text>
                    </TouchableOpacity>

                    {expandedErrorId === item.id && (
                      <View style={styles.technicalReasonBox}>
                        <Text style={styles.technicalReasonText}>
                          {item.failureReason || 'IFSC code mismatch during PFMS routing.'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.cardDivider} />

                {/* Footer Action */}
                <TouchableOpacity
                  style={styles.receiptActionRow}
                  onPress={() => handleOpenReceipt(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.receiptActionText}>📄 रसीद देखें →</Text>
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

  /* ─── 2. SUMMARY STRIP ─── */
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  summaryStatusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  summaryAmountText: {
    fontSize: 16,
    fontWeight: '900',
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },

  /* ─── 3. SECTION HEADER ─── */
  sectionHeader: {
    marginBottom: 14,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },

  /* ─── 4. CLEAN WHITE CARDS ─── */
  cardsList: {
    gap: 16,
  },
  cleanPaymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cropNameCol: {
    flex: 1,
  },
  cropHindiName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  cropVarietyName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },

  /* Status Pills */
  pillSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillTextSuccess: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  pillPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillTextPending: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  pillFailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillTextFailed: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B91C1C',
  },

  /* Amount */
  amountContainer: {
    marginVertical: 8,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },

  /* Meta & Quantity */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metaDot: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  quantityRow: {
    marginTop: 2,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  /* Pending Message */
  pendingMessageBox: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingMessageText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
  },

  /* Failed Container */
  failedContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: RADIUS.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  failedMainText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.error,
  },
  failedSubText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...SHADOWS.sm,
  },
  retryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
  },
  errorExpandLink: {
    alignSelf: 'center',
    paddingTop: 8,
  },
  errorExpandText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  technicalReasonBox: {
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  technicalReasonText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  /* Divider & Footer */
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 14,
    marginBottom: 10,
  },
  receiptActionRow: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  receiptActionText: {
    fontSize: 13,
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
