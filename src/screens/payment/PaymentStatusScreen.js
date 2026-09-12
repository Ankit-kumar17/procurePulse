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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../utils/theme';
import { Header, Card, Badge, Button, InfoRow } from '../../components';
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
        'दोबारा पैसा भेजा गया',
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

  const totalReceived = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'INITIATED')
    .reduce((acc, p) => acc + p.netAmount, 0);

  const totalFailed = payments
    .filter((p) => p.status === 'FAILED')
    .reduce((acc, p) => acc + p.netAmount, 0);

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

  const getCleanMandiName = (rawMandi) => {
    if (rawMandi.includes('Kolar')) return 'Kolar Mandi';
    if (rawMandi.includes('Berasia')) return 'Berasia Mandi';
    if (rawMandi.includes('Sukhi')) return 'Sukhi Sevania Mandi';
    return rawMandi.split('(')[0].trim();
  };

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
      {/* ─── 1. COMPACT FOREST GREEN HEADER ─── */}
      <Header
        title="फसल भुगतान"
        subtitle="खाते में आया पैसा व सरकारी रसीदें"
        onVoiceGuidePress={handlePlayVoiceGuide}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 95 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. TOTAL PASSBOOK WHITE CARD ─── */}
        <Card style={styles.passbookCard}>
          <View style={styles.passbookHeader}>
            <View style={styles.bankTag}>
              <MaterialCommunityIcons name="bank" size={16} color={COLORS.primary} />
              <Text style={styles.bankTagText}>SBI खाता (••••8392)</Text>
            </View>
            <Badge label="सत्यापित" variant="success" size="sm" icon="check-circle" />
          </View>

          <View style={styles.passbookBody}>
            <Text style={styles.passbookLabel}>कुल मिला पैसा (Credited)</Text>
            <Text style={styles.passbookAmount}>₹{totalReceived.toLocaleString('en-IN')}</Text>
          </View>

          {/* 3 Quick Filter Pills */}
          <View style={styles.overviewPillsRow}>
            <TouchableOpacity
              style={[
                styles.overviewPill,
                {
                  backgroundColor: selectedFilter === 'SUCCESS' ? COLORS.success : COLORS.successLight,
                  borderColor: selectedFilter === 'SUCCESS' ? COLORS.success : '#C0E2CD',
                },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'SUCCESS' ? 'ALL' : 'SUCCESS')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'SUCCESS' ? COLORS.white : COLORS.successDark },
                ]}
              >
                🟢 ₹{totalReceived.toLocaleString('en-IN')} मिला
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.overviewPill,
                {
                  backgroundColor: selectedFilter === 'INITIATED' ? COLORS.warning : COLORS.warningLight,
                  borderColor: selectedFilter === 'INITIATED' ? COLORS.warning : '#F8E4A0',
                },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'INITIATED' ? 'ALL' : 'INITIATED')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'INITIATED' ? COLORS.white : COLORS.warningDark },
                ]}
              >
                🟡 ₹{totalPending.toLocaleString('en-IN')} आ रहा है
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.overviewPill,
                {
                  backgroundColor: selectedFilter === 'FAILED' ? COLORS.error : COLORS.errorLight,
                  borderColor: selectedFilter === 'FAILED' ? COLORS.error : '#F7C7C7',
                },
              ]}
              onPress={() => setSelectedFilter(selectedFilter === 'FAILED' ? 'ALL' : 'FAILED')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.overviewPillText,
                  { color: selectedFilter === 'FAILED' ? COLORS.white : COLORS.errorDark },
                ]}
              >
                🔴 ₹{totalFailed.toLocaleString('en-IN')} अटका है
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ─── 3. SECTION HEADER ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>आपकी फसल बिक्री व भुगतान</Text>
          <Text style={styles.sectionSub}>
            {selectedFilter === 'ALL'
              ? `कुल रिकॉर्ड: ${payments.length}`
              : `फिल्टर लागू (${filteredPayments.length})`}
          </Text>
        </View>

        {/* ─── 4. ULTRA-EASY WHITE PAYMENT CARDS ─── */}
        <View style={styles.cardsList}>
          {filteredPayments.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isFailed = item.status === 'FAILED';
            const isInitiated = item.status === 'INITIATED';

            const cropInfo = getCleanCropInfo(item.crop);
            const mandiName = getCleanMandiName(item.centre);
            const formattedDate = getCleanDate(item.procurementDate);

            const kgVal = item.quantity?.split('(')[0]?.trim() || item.quantity;
            const qtlVal = item.quantity?.includes('Qtl')
              ? item.quantity.split('(')[1]?.replace(')', '')
              : '';

            return (
              <Card key={item.id} style={styles.cleanCard}>
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
                        isSuccess && { color: COLORS.success },
                        isInitiated && { color: COLORS.warning },
                        isFailed && { color: COLORS.error },
                      ]}
                    >
                      ₹{item.netAmount.toLocaleString('en-IN')}
                    </Text>

                    {isSuccess && (
                      <Badge label="🟢 मिला" variant="success" size="sm" />
                    )}

                    {isInitiated && (
                      <Badge label="🟡 आ रहा है" variant="warning" size="sm" />
                    )}

                    {isFailed && (
                      <Badge label="🔴 अटका है" variant="error" size="sm" />
                    )}
                  </View>
                </View>

                {/* ─── STATUS & ACTIONS SECTION ─── */}

                {/* Case 1: SUCCESS */}
                {isSuccess && (
                  <View style={styles.cardBottomRow}>
                    <View style={styles.successNoteRow}>
                      <MaterialCommunityIcons name="check-circle" size={15} color={COLORS.success} />
                      <Text style={styles.successNoteText}>बैंक खाते में जमा हो गया</Text>
                    </View>
                    <Button
                      title="रसीद देखें"
                      icon="file-document-outline"
                      size="sm"
                      variant="secondary"
                      onPress={() => handleOpenReceipt(item)}
                    />
                  </View>
                )}

                {/* Case 2: INITIATED / PENDING */}
                {isInitiated && (
                  <View style={styles.cardBottomRow}>
                    <View style={styles.pendingNoteRow}>
                      <MaterialCommunityIcons name="clock-outline" size={15} color={COLORS.warning} />
                      <Text style={styles.pendingNoteText}>24 घंटे में जमा होगा</Text>
                    </View>
                    <Button
                      title="रसीद देखें"
                      icon="file-document-outline"
                      size="sm"
                      variant="secondary"
                      onPress={() => handleOpenReceipt(item)}
                    />
                  </View>
                )}

                {/* Case 3: FAILED / ACTION NEEDED */}
                {isFailed && (
                  <View style={styles.failedActionBox}>
                    <View style={styles.failedNoteRow}>
                      <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.error} />
                      <Text style={styles.failedNoteText}>
                        बैंक खाते की समस्या के कारण पैसा रुका है
                      </Text>
                    </View>

                    <View style={styles.failedButtonsRow}>
                      <Button
                        title="दोबारा भेजें (Retry)"
                        icon="refresh"
                        size="sm"
                        variant="danger"
                        loading={retryingId === item.id}
                        onPress={() => handleRetry(item.id)}
                        style={{ flex: 1 }}
                      />

                      <Button
                        title="रसीद"
                        icon="file-document-outline"
                        size="sm"
                        variant="secondary"
                        onPress={() => handleOpenReceipt(item)}
                      />
                    </View>
                  </View>
                )}
              </Card>
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
                  <Badge label={`रसीद क्र.: ${selectedReceipt.receiptNo}`} variant="navy" size="md" />
                  <Badge
                    label={selectedReceipt.status === 'SUCCESS' ? '✓ जमा हुआ' : 'प्रक्रिया में'}
                    variant={selectedReceipt.status === 'SUCCESS' ? 'success' : 'warning'}
                    size="md"
                  />
                </View>

                <View style={styles.receiptTable}>
                  <InfoRow label="तौल पर्ची क्र." value={selectedReceipt.weighmentSlipNo} showDivider={true} />
                  <InfoRow label="उपार्जन केंद्र" value={selectedReceipt.centre?.split('(')[0]} showDivider={true} />
                  <InfoRow label="तौल दिनांक" value={getCleanDate(selectedReceipt.procurementDate)} showDivider={true} />
                  <InfoRow label="फसल व किस्म" value={selectedReceipt.crop} showDivider={true} />
                  <InfoRow label="नमी स्तर" value={selectedReceipt.moistureLevel} highlight={true} showDivider={true} />
                  <InfoRow label="कुल वजन" value={selectedReceipt.quantity} showDivider={true} />
                  <InfoRow label="कुल शुद्ध राशि" value={`₹${selectedReceipt.netAmount.toLocaleString('en-IN')}`} highlight={true} showDivider={false} />
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
              <Button
                title="रसीद शेयर करें"
                icon="share-variant"
                size="md"
                variant="primary"
                onPress={handleShareReceipt}
                style={{ flex: 1 }}
              />

              <Button
                title="बंद करें"
                size="md"
                variant="secondary"
                onPress={() => setReceiptModalVisible(false)}
              />
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  passbookCard: {
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  passbookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  bankTagText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.primary,
  },
  passbookBody: {
    marginVertical: SPACING.xs,
  },
  passbookLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  passbookAmount: {
    ...TYPOGRAPHY.metricHero,
    fontSize: 28,
    color: COLORS.text,
    marginVertical: 2,
  },
  overviewPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.sm + 2,
  },
  overviewPill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewPillText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 15,
    color: COLORS.text,
  },
  sectionSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  cardsList: {
    gap: SPACING.sm,
  },
  cleanCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cropDetailsBox: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  cropTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.text,
  },
  cropVariety: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  metaLine: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  weightLine: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  rupeeAmount: {
    ...TYPOGRAPHY.metricLarge,
    fontSize: 18,
    marginBottom: 4,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  successNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  successNoteText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 12,
    color: COLORS.success,
  },
  pendingNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pendingNoteText: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 12,
    color: COLORS.warning,
  },
  failedActionBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F7C7C7',
    gap: 8,
  },
  failedNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  failedNoteText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.error,
  },
  failedButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    padding: SPACING.md,
  },
  receiptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
    ...SHADOWS.lg,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: SPACING.sm,
  },
  receiptHeaderTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 16,
    color: COLORS.text,
  },
  receiptHeaderSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  receiptBody: {
    marginVertical: SPACING.md,
  },
  receiptBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  receiptTable: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankVerifyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#C0E2CD',
    marginTop: SPACING.md,
  },
  bankVerifyTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.successDark,
  },
  bankVerifySub: {
    ...TYPOGRAPHY.bodySmall,
    fontSize: 11,
    color: '#166534',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
  },
});
