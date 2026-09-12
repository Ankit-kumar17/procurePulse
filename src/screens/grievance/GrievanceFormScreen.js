import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { GRIEVANCE_CATEGORIES } from '../../utils/constants';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useFarmer } from '../../context/FarmerContext';

export default function GrievanceFormScreen({ navigation }) {
  const { submitGrievance } = useFarmer();
  const [selectedCategory, setSelectedCategory] = useState(GRIEVANCE_CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAttachPhoto = () => {
    setHasPhoto(true);
    Alert.alert('Photo Attached', 'Receipt / Weighment slip image attached successfully (mock).');
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please write the details of your grievance.');
      return;
    }

    setLoading(true);
    const result = await submitGrievance({
      category: selectedCategory,
      subject: subject.trim() || `${selectedCategory} Dispute`,
      description: description.trim(),
      photoAttached: hasPhoto,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Grievance Registered',
        `Ticket #${result.grievance.id} created and routed to District Nodal Officer.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', 'Failed to file grievance. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Raise Complaint"
        subtitle="File a grievance regarding procurement or payout"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Picker Card */}
        <Card title="Grievance Category / शिकायत का प्रकार" icon="format-list-bulleted" iconColor={COLORS.primary}>
          <Text style={styles.categoryNote}>Select the issue category to route directly to the respective cell:</Text>
          <View style={styles.categoryChips}>
            {GRIEVANCE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Form Inputs */}
        <Card title="Dispute Information" icon="text-box-edit-outline" iconColor={COLORS.primary}>
          <Input
            label="Subject / Summary"
            placeholder="e.g. DBT delay for WS-BPL-1004"
            value={subject}
            onChangeText={setSubject}
            icon="format-title"
          />

          <Input
            label="Detailed Description"
            placeholder="Explain the incident, centre name, weighment slip number, and date..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            icon="comment-text-outline"
          />

          {/* Photo Attachment (Mock) */}
          <Text style={styles.attachLabel}>Supporting Document / Slip Photo</Text>
          <TouchableOpacity
            style={[styles.attachBox, hasPhoto && styles.attachBoxActive]}
            onPress={handleAttachPhoto}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={hasPhoto ? 'file-image-outline' : 'camera-plus-outline'}
              size={32}
              color={hasPhoto ? COLORS.success : COLORS.primary}
            />
            <Text style={[styles.attachText, hasPhoto && styles.attachTextActive]}>
              {hasPhoto ? 'Photo Attached: weighment_slip_bpl.jpg ✓' : 'Tap to Attach Photo / Weigh Slip'}
            </Text>
            {hasPhoto && (
              <Badge label="Attached" variant="success" size="sm" icon="check" />
            )}
          </TouchableOpacity>
        </Card>

        <View style={styles.slaCallout}>
          <MaterialCommunityIcons name="shield-check" size={22} color={COLORS.primaryDark} />
          <Text style={styles.slaText}>
            <Text style={{ fontWeight: '700' }}>Madhya Pradesh Public Service Guarantee Act: </Text>
            All e-Uparjan procurement grievances are mandated to be resolved within 48 hours.
          </Text>
        </View>

        <Button
          title="Submit Grievance to Nodal Officer"
          variant="primary"
          size="lg"
          icon="send"
          loading={loading}
          onPress={handleSubmit}
          style={{ marginTop: SPACING.md }}
        />
      </ScrollView>
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
  categoryNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  attachLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  attachBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  attachBoxActive: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight + '44',
  },
  attachText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  attachTextActive: {
    color: COLORS.success,
  },
  slaCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '44',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 10,
    marginTop: SPACING.sm,
  },
  slaText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 16,
  },
});
