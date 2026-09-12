import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useFarmer } from '../../context/FarmerContext';

export default function GrievanceListScreen({ navigation }) {
  const { grievances } = useFarmer();

  return (
    <View style={styles.container}>
      <Header
        title="Grievance Redressal / शिकायत निवारण"
        subtitle="Direct escalation to District Procurement Nodal Officer"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Helpline Banner */}
        <View style={styles.helplineCard}>
          <View style={styles.helpIconBox}>
            <MaterialCommunityIcons name="headset" size={24} color={COLORS.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Toll-Free CM Kisan Helpline</Text>
            <Text style={styles.helpPhone}>181 / 1800-233-0000</Text>
            <Text style={styles.helpSub}>Available 24x7 for procurement dispute resolution</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionHeading}>My Complaints & Tickets ({grievances.length})</Text>
        </View>

        {grievances.map((item) => {
          const isResolved = item.status === 'Resolved';
          const isInProgress = item.status === 'In Progress';
          const isOpen = item.status === 'Open';

          return (
            <Card key={item.id} style={styles.grievanceCard}>
              <View style={styles.grvTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.grvCategory}>{item.category}</Text>
                  <Text style={styles.grvSubject}>{item.subject || item.category}</Text>
                </View>
                <Badge
                  label={item.status}
                  variant={isResolved ? 'success' : isInProgress ? 'warning' : 'info'}
                  size="sm"
                  icon={isResolved ? 'check-circle' : isInProgress ? 'clock-alert' : 'file-document'}
                />
              </View>

              <Text style={styles.grvDesc}>{item.description}</Text>

              {item.response && (
                <View style={styles.responseBox}>
                  <MaterialCommunityIcons name="account-tie-outline" size={16} color={COLORS.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.responseOfficer}>Official Nodal Response:</Text>
                    <Text style={styles.responseText}>{item.response}</Text>
                  </View>
                </View>
              )}

              <View style={styles.grvFooter}>
                <Text style={styles.grvId}>Ticket ID: {item.id}</Text>
                <Text style={styles.grvDate}>Filed: {item.date}</Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('GrievanceForm')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={24} color={COLORS.primaryDark} />
        <Text style={styles.fabText}>Raise Complaint</Text>
      </TouchableOpacity>
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
    paddingBottom: 90,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '44',
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 12,
  },
  helpIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  helpPhone: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  helpSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  grievanceCard: {
    marginBottom: SPACING.sm,
  },
  grvTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  grvCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grvSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  grvDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginVertical: 4,
  },
  responseBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  responseOfficer: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  responseText: {
    fontSize: 11,
    color: COLORS.text,
    marginTop: 2,
  },
  grvFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  grvId: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  grvDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    gap: 8,
    ...SHADOWS.gold,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
