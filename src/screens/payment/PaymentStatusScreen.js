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
        '✅ DBT भुगतान पुनः भेजा गया',
        'बैंक विवरण अपडेट कर दिया गया है। PFMS द्वारा सीधे आपके आधार लिंक एसबीआई खाते में राशि भेजी जा रही है।'
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
      'नमस्ते किसान भाई!\n\n• आपके खाते में अब तक ₹27,300 जमा हो चुके हैं।\n• गेहूं के ₹18,200 बैंक भेजे गए हैं, जो 24 घंटे में जमा हो जाएंगे।\n• चना के ₹27,200 के लिए "दोबारा भेजें" बटन दबाएं।',
      [{ text: 'समझ गया (OK)' }]
    );
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  const totalProcuredAmount = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.netAmount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. COMPACT HEADER WITH VOICE GUIDE ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerBrandBox}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="bank-transfer" size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.headerTitleText}>भुगतान व पासबुक</Text>
              <Text style={styles.headerSubText}>सीधे बैंक खाते में आया पैसा (DBT)</Text>
            </View>
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
        {/* ─── 2. DIGITAL PASSBOOK HERO CARD ─── */}
        <View style={styles.passbookHeroCard}>
          <View style={styles.passbookTopRow}>
            <View style={styles.bankTagRow}>
              <MaterialCommunityIcons name="bank" size={18} color={COLORS.primary} />
              <Text style={styles.bankNameText}>भारतीय स्टेट बैंक (SBI ••••8392)</Text>
            </View>
            <View style={styles.aadhaarBadge}>
              <MaterialCommunityIcons name="shield-check" size={13} color={COLORS.success} />
              <Text style={styles.aadhaarBadgeText}>आधार लिंक</Text>
            </View>
          </View>

          <View style={styles.passbookAmountRow}>
            <View>
              <Text style={styles.passbookAmountLabel}>कुल जमा राशि (रबी सत्र)</Text>
              <Text style={styles.passbookAmountValue}>
                ₹{totalProcuredAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.passbookSuccessIcon}>
              <MaterialCommunityIcons name="check-decagram" size={36} color={COLORS.success} />
            </View>
          </View>

          <View style={styles.passbookFooterNote}>
            <Text style={styles.passbookFooterText}>
              🟢 समर्थन मूल्य (MSP) का पैसा सीधे आपके बैंक खाते में भेजा गया है
            </Text>
          </View>
        </View>

        {/* ─── 3. RECORDS SECTION HEADER ─── */}
        <View style={styles.recordsHeaderRow}>
          <Text style={styles.sectionTitle}>
            🌾 फसल बिक्री एवं भुगतान रिकॉर्ड ({payments.length})
          </Text>
        </View>

        {/* ─── 4. TRAFFIC-LIGHT PAYMENT CARDS ─── */}
        <View style={styles.paymentsList}>
          {payments.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isFailed = item.status === 'FAILED';
            const isInitiated = item.status === 'INITIATED';

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.paymentCard,
                  isFailed && styles.paymentCardFailed,
                  isInitiated && styles.paymentCardInitiated,
                  isSuccess && styles.paymentCardSuccess,
                ]}
                onPress={() => handleOpenReceipt(item)}
                activeOpacity={0.88}
              >
                {/* Header Row: Crop + Traffic Light Status Badge */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cropTitleBox}>
                    <Text style={styles.cropNameText}>
                      {item.crop.includes('Wheat') ? '🌾 गेहूं' : '🌱 चना'} ({item.crop})
                    </Text>
                    <Text style={styles.mandiLocationText}>
                      📍 {item.centre.split('(')[0].trim()}
                    </Text>
                  </View>

                  {isSuccess && (
                    <View style={styles.statusBadgeSuccess}>
                      <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.white} />
                      <Text style={styles.statusBadgeTextSuccess}>जमा हो गया</Text>
                    </View>
                  )}

                  {isInitiated && (
                    <View style={styles.statusBadgeInitiated}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color="#92400E" />
                      <Text style={styles.statusBadgeTextInitiated}>बैंक भेजा गया</Text>
                    </View>
                  )}

                  {isFailed && (
                    <View style={styles.statusBadgeFailed}>
                      <MaterialCommunityIcons name="alert-circle" size={14} color={COLORS.white} />
                      <Text style={styles.statusBadgeTextFailed}>भुगतान रुका</Text>
                    </View>
                  )}
                </View>

                {/* Big Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabel}>तारीख</Text>
                    <Text style={styles.gridValue}>{item.procurementDate}</Text>
                  </View>

                  <View style={styles.gridDivider} />

                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabel}>कुल अनाज</Text>
                    <Text style={styles.gridValue}>{item.quantity}</Text>
                  </View>

                  <View style={styles.gridDivider} />

                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabel}>MSP राशि</Text>
                    <Text style={[
                      styles.gridValueAmount,
                      isSuccess && { color: COLORS.success },
                      isFailed && { color: COLORS.error },
                      isInitiated && { color: COLORS.primary },
                    ]}>
                      ₹{item.netAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Contextual Status Help Notes */}
                {isInitiated && (
                  <View style={styles.initiatedNotice}>
                    <MaterialCommunityIcons name="information" size={16} color="#92400E" />
                    <Text style={styles.initiatedNoticeText}>
                      पैसा बैंक भेजा जा चुका है, 24 से 48 घंटे में खाते में जमा होगा।
                    </Text>
                  </View>
                )}

                {/* Failed Payment Action Box */}
                {isFailed && (
                  <View style={styles.failedActionBox}>
                    <View style={styles.failedReasonRow}>
                      <MaterialCommunityIcons name="alert-circle-outline" size={18} color={COLORS.error} />
                      <Text style={styles.failedReasonText}>
                        {item.failureReason || 'IFSC कोड मिसमैच के कारण भुगतान रुका है।'}
                      </Text>
                    </View>

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
                          <Text style={styles.retryButtonText}>दोबारा खाते में भेजें (Retry DBT)</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* View Slip Link */}
                <View style={styles.viewSlipRow}>
                  <Text style={styles.viewSlipText}>📄 तौल पर्ची व सरकारी रसीद देखें →</Text>
                </View>
              </TouchableOpacity>
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
                <Text style={styles.receiptHeaderTitle}>म.प्र. ई-उपार्जन तौल व भुगतान रसीद</Text>
                <Text style={styles.receiptHeaderSub}>खाद्य एवं नागरिक आपूर्ति विभाग, म.प्र. शासन</Text>
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
                    { backgroundColor: selectedReceipt.status === 'SUCCESS' ? COLORS.successLight : '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.receiptStatusPillText,
                      { color: selectedReceipt.status === 'SUCCESS' ? COLORS.success : '#92400E' }
                    ]}>
                      {selectedReceipt.status === 'SUCCESS' ? '✓ जमा हुआ' : 'प्रक्रिया में'}
                    </Text>
                  </View>
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>तौल पर्ची क्रमांक</Text>
                    <Text style={styles.tVal}>{selectedReceipt.weighmentSlipNo}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>उपार्जन केंद्र (Mandi)</Text>
                    <Text style={styles.tVal}>{selectedReceipt.centre}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>तौल दिनांक</Text>
                    <Text style={styles.tVal}>{selectedReceipt.procurementDate}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>उपज व किस्म</Text>
                    <Text style={styles.tVal}>{selectedReceipt.crop} ({selectedReceipt.qualityGrade})</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>लैब नमी स्तर (Moisture)</Text>
                    <Text style={[styles.tVal, { color: COLORS.success, fontWeight: '800' }]}>
                      {selectedReceipt.moistureLevel} (मानक 12% के अंतर्गत)
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>कुल तौल वजन</Text>
                    <Text style={styles.tVal}>{selectedReceipt.quantity}</Text>
                  </View>
                  <View style={[styles.tableRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>कुल शुद्ध भुगतान</Text>
                    <Text style={styles.totalVal}>₹{selectedReceipt.netAmount.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* Bank Account Verification Callout */}
                <View style={styles.bankVerifyBox}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankVerifyTitle}>आधार सीडेड SBI खाते में भेजा गया</Text>
                    <Text style={styles.bankVerifySub}>खाता क्र.: ••••8392 • UTR: {selectedReceipt.transactionId}</Text>
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
  headerBrandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.4)',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
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

  /* ─── 2. PASSBOOK HERO CARD ─── */
  passbookHeroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: '#FDE047',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  passbookTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bankTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  aadhaarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aadhaarBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  passbookAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  passbookAmountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  passbookAmountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.success,
    marginTop: 2,
  },
  passbookSuccessIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passbookFooterNote: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passbookFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    lineHeight: 15,
  },

  /* ─── 3. RECORDS HEADER ─── */
  recordsHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },

  /* ─── 4. PAYMENT CARDS ─── */
  paymentsList: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  paymentCardSuccess: {
    borderColor: '#E2E8F0',
  },
  paymentCardInitiated: {
    borderColor: '#FDE047',
    backgroundColor: '#FFFDF5',
  },
  paymentCardFailed: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
    ...SHADOWS.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cropTitleBox: {
    flex: 1,
  },
  cropNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  mandiLocationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeTextSuccess: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.white,
  },
  statusBadgeInitiated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  statusBadgeTextInitiated: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
  },
  statusBadgeFailed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeTextFailed: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.white,
  },

  /* ─── DETAILS GRID ─── */
  detailsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridBox: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  gridValueAmount: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  gridDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E2E8F0',
  },

  /* ─── STATUS HELP NOTICES ─── */
  initiatedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF9C3',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 8,
  },
  initiatedNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854D0E',
    flex: 1,
  },

  /* ─── FAILED ACTION BOX ─── */
  failedActionBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  failedReasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  failedReasonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
    flex: 1,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
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

  /* ─── SLIP ROW ─── */
  viewSlipRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  viewSlipText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textDecorationLine: 'underline',
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
