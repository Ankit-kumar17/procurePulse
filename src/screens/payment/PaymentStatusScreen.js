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
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useFarmer } from '../../context/FarmerContext';

export default function PaymentStatusScreen({ navigation }) {
  const { payments, retryPayment } = useFarmer();
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
        'DBT Payout Re-Initiated',
        'Bank routing updated. PFMS re-clearing initiated with Aadhaar-linked SBI Account.'
      );
    }
  };

  const handleShareReceipt = async () => {
    if (!selectedReceipt) return;
    try {
      await Share.share({
        message: `MP e-Uparjan Procurement Payment Receipt\nReceipt No: ${selectedReceipt.receiptNo}\nCrop: ${selectedReceipt.crop}\nQuantity: ${selectedReceipt.quantity}\nAmount: ₹${selectedReceipt.netAmount.toLocaleString('en-IN')}\nStatus: ${selectedReceipt.status}\nTxn: ${selectedReceipt.transactionId}`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const totalProcuredAmount = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + p.netAmount, 0);

  return (
    <View style={styles.container}>
      <Header
        title="Procurement Payouts & DBT"
        subtitle="Direct Benefit Transfer via PFMS / NPCI"
        rightIcon="download"
        onRightPress={() => Alert.alert('Export Statement', 'Procurement passbook exported as PDF.')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Payout Overview Hero Banner */}
        <Card goldBorder style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroSub}>TOTAL DBT CREDITED (RABI 2026-27)</Text>
              <Text style={styles.heroAmount}>₹{totalProcuredAmount.toLocaleString('en-IN')}</Text>
              <Text style={styles.heroNote}>Aadhaar Seeded SBI A/C ••••8392</Text>
            </View>
            <View style={styles.heroBadgeBox}>
              <MaterialCommunityIcons name="check-decagram" size={32} color={COLORS.success} />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionHeading}>Procurement Records ({payments.length})</Text>

        {payments.map((item) => {
          const isSuccess = item.status === 'SUCCESS';
          const isFailed = item.status === 'FAILED';
          const isInitiated = item.status === 'INITIATED';

          return (
            <Card
              key={item.id}
              highlight={isFailed}
              style={styles.paymentCard}
              onPress={() => handleOpenReceipt(item)}
            >
              <View style={styles.paymentTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cropTitle}>{item.crop}</Text>
                  <Text style={styles.centreName}>{item.centre}</Text>
                </View>

                <Badge
                  label={item.status}
                  variant={isSuccess ? 'success' : isFailed ? 'error' : 'warning'}
                  size="sm"
                  icon={isSuccess ? 'check-circle' : isFailed ? 'alert-circle' : 'clock-outline'}
                />
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Date</Text>
                  <Text style={styles.gridVal}>{item.procurementDate}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Quantity</Text>
                  <Text style={styles.gridVal}>{item.quantity}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>MSP Payout</Text>
                  <Text style={[styles.gridVal, { color: COLORS.primary, fontWeight: '800' }]}>
                    ₹{item.netAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <View style={styles.txnRow}>
                <MaterialCommunityIcons name="identifier" size={16} color={COLORS.textSecondary} />
                <Text style={styles.txnText} numberOfLines={1}>
                  Txn ID: {item.transactionId}
                </Text>
              </View>

              {isFailed && (
                <View style={styles.failedBox}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={18} color={COLORS.error} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.failedTitle}>Payment Failed</Text>
                    <Text style={styles.failedDesc}>{item.failureReason}</Text>
                  </View>
                  <Button
                    title="Retry DBT"
                    variant="danger"
                    size="sm"
                    loading={retryingId === item.id}
                    onPress={() => handleRetry(item.id)}
                  />
                </View>
              )}

              <View style={styles.viewReceiptRow}>
                <Text style={styles.viewReceiptText}>Tap to View Procurement & Weighment Slip →</Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Detailed Procurement & Weighment Receipt Modal */}
      <Modal visible={receiptModalVisible} transparent animationType="slide" onRequestClose={() => setReceiptModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptHeaderTitle}>MP e-Uparjan Procurement Slip</Text>
                <Text style={styles.receiptHeaderSub}>Govt of Madhya Pradesh • Food Dept</Text>
              </View>
              <TouchableOpacity onPress={() => setReceiptModalVisible(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedReceipt && (
              <ScrollView style={styles.receiptBody} showsVerticalScrollIndicator={false}>
                <View style={styles.receiptBadgeRow}>
                  <Badge label={`Receipt #${selectedReceipt.receiptNo}`} variant="gold" size="md" />
                  <Badge label={selectedReceipt.status} variant={selectedReceipt.status === 'SUCCESS' ? 'success' : 'warning'} size="md" />
                </View>

                <View style={styles.receiptTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Weighment Slip</Text>
                    <Text style={styles.tVal}>{selectedReceipt.weighmentSlipNo}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Procurement Centre</Text>
                    <Text style={styles.tVal}>{selectedReceipt.centre}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Procurement Date</Text>
                    <Text style={styles.tVal}>{selectedReceipt.procurementDate}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Commodity & Grade</Text>
                    <Text style={styles.tVal}>{selectedReceipt.crop} ({selectedReceipt.qualityGrade})</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Lab Moisture Level</Text>
                    <Text style={[styles.tVal, { color: COLORS.success, fontWeight: '700' }]}>
                      {selectedReceipt.moistureLevel} (Within 12% FAQ Limit)
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Total Weight</Text>
                    <Text style={styles.tVal}>{selectedReceipt.quantity}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>MSP Procurement Rate</Text>
                    <Text style={styles.tVal}>{selectedReceipt.mspRate}</Text>
                  </View>
                  <View style={[styles.tableRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Gross Amount Payable</Text>
                    <Text style={styles.totalVal}>₹{selectedReceipt.grossAmount?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Mandi / Labour Deductions</Text>
                    <Text style={styles.tVal}>₹0.00 (Zero Fee)</Text>
                  </View>
                  <View style={[styles.tableRow, styles.netRow]}>
                    <Text style={styles.netLabel}>Net DBT Payout</Text>
                    <Text style={styles.netVal}>₹{selectedReceipt.netAmount?.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Bank DBT Transaction ID</Text>
                    <Text style={styles.tVal}>{selectedReceipt.transactionId}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tLabel}>Bank UTR Reference</Text>
                    <Text style={styles.tVal}>{selectedReceipt.utr}</Text>
                  </View>
                </View>

                <View style={styles.receiptFooterNote}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                  <Text style={styles.footerNoteText}>
                    Digitally signed by e-Uparjan Procurement Officer. Amount transferred directly to Aadhaar-seeded bank account.
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button
                title="Share / Download PDF Receipt"
                variant="primary"
                icon="share-variant"
                onPress={handleShareReceipt}
                style={{ flex: 1 }}
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
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    marginBottom: SPACING.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroSub: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentDark,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  heroNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroBadgeBox: {
    padding: SPACING.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  paymentCard: {
    marginBottom: SPACING.sm,
  },
  paymentTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  centreName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.sm,
  },
  gridItem: {},
  gridLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  gridVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txnText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  failedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  failedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.error,
  },
  failedDesc: {
    fontSize: 10,
    color: '#991B1B',
  },
  viewReceiptRow: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewReceiptText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  receiptCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '88%',
    paddingTop: SPACING.md,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  receiptHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  receiptHeaderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    padding: 6,
  },
  receiptBody: {
    padding: SPACING.lg,
  },
  receiptBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  receiptTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  tLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  tVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
    flex: 1,
  },
  totalRow: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    marginVertical: 4,
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  netRow: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  netLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentLight,
  },
  netVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  receiptFooterNote: {
    flexDirection: 'row',
    backgroundColor: COLORS.successLight,
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.md,
    gap: 8,
  },
  footerNoteText: {
    fontSize: 11,
    color: COLORS.success,
    flex: 1,
    lineHeight: 15,
  },
  modalFooter: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
});
