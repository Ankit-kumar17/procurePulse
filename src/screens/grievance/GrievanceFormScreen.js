import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const CATEGORIES = [
  { id: 'Payment Delay', label: 'पैसा नहीं मिला / देरी', icon: 'cash-clock', color: COLORS.warning },
  { id: 'Weight / Tare Dispute', label: 'तौल / वजन में फर्क', icon: 'scale-balance', color: COLORS.info },
  { id: 'Slot Booking / Reschedule Issue', label: 'स्लॉट / टोकन समस्या', icon: 'calendar-clock', color: COLORS.primary },
  { id: 'Quality & Moisture Dispute', label: 'नमी / गुणवत्ता विवाद', icon: 'water-percent', color: COLORS.info },
  { id: 'Infrastructure & Shed Facility', label: 'मंडी / केंद्र समस्या', icon: 'storefront-outline', color: COLORS.primaryLight },
  { id: 'Other Issue', label: 'अन्य समस्या', icon: 'alert-circle-outline', color: COLORS.textSecondary },
];

const QUICK_TEMPLATES = [
  { label: '💰 पैसा खाते में नहीं आया', text: 'फसल बेचने के बाद भी भुगतान राशि अभी तक बैंक खाते में जमा नहीं हुई है।' },
  { label: '⚖️ तौल में वजन कम लिखा', text: 'कांटे पर तौल पर्ची में फसल का वजन कम दर्ज किया गया है।' },
  { label: '🌾 स्लॉट की तारीख बदलनी है', text: 'उपार्जन केंद्र पर फसल लाने के लिए नया स्लॉट / टोकन चाहिए।' },
  { label: '🚜 केंद्र पर तुलाई रुकी है', text: 'उपार्जन केंद्र पर तौल कांटा बंद है और लंबी कतार लगी है।' },
];

export default function GrievanceFormScreen({ navigation, route }) {
  const { submitGrievance } = useFarmer();
  const insets = useSafeAreaInsets();

  const initialCat = route?.params?.initialCategory || 'Payment Delay';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.initialCategory) {
      setSelectedCategory(route?.params?.initialCategory);
    }
  }, [route?.params?.initialCategory]);

  const handleVoiceInput = () => {
    Alert.alert(
      'बोलकर शिकायत दर्ज करें',
      'अपनी समस्या बोलें (उदा.: "5 अप्रैल का गेहूं का भुगतान नहीं मिला")',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'आवाज दर्ज करें',
          onPress: () => {
            setDescription('5 अप्रैल को बैरसिया केंद्र पर गेहूं बेचा था, ₹18,200 का भुगतान अभी तक बैंक खाते में नहीं आया है।');
          },
        },
      ]
    );
  };

  const handleAttachPhoto = () => {
    setHasPhoto(true);
    Alert.alert('फोटो जोड़ी गई', 'तौल पर्ची / रसीद की फोटो सफलतापूर्वक संलग्न हो गई है।');
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('विवरण आवश्यक है', 'कृपया अपनी समस्या लिखें या ऊपर दिए गए विकल्पों में से चुनें।');
      return;
    }

    setLoading(true);
    const catObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
    const result = await submitGrievance({
      category: selectedCategory,
      subject: catObj.label,
      description: description.trim(),
      photoAttached: hasPhoto,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'शिकायत दर्ज हो गई',
        `शिकायत क्र.: #${result.grievance.id}\n\nआपकी शिकायत जिला उपार्जन नोडल अधिकारी को भेज दी गई है। 48 घंटे के भीतर समाधान किया जाएगा।`,
        [{ text: 'ठीक है (OK)', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('त्रुटि', 'शिकायत दर्ज नहीं हो सकी। कृपया दोबारा कोशिश करें।');
    }
  };

  return (
    <View style={styles.container}>
      {/* ─── HEADER ─── */}
      <Header
        title="नई शिकायत दर्ज करें"
        subtitle="48 घंटे में समाधान की गारंटी"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. CATEGORY SELECTION ─── */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>1. समस्या का प्रकार चुनें:</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryTile, isSelected && styles.categoryTileSelected]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={20}
                    color={isSelected ? COLORS.white : cat.color}
                  />
                  <Text
                    style={[
                      styles.categoryTileText,
                      isSelected && styles.categoryTileTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* ─── 2. QUICK TEMPLATES ─── */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>2. फटाफट समस्या चुनें (1-टैप):</Text>
          <View style={styles.templatesList}>
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.templateChip}
                onPress={() => setDescription(tmpl.text)}
                activeOpacity={0.75}
              >
                <Text style={styles.templateChipText}>{tmpl.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* ─── 3. DESCRIPTION INPUT ─── */}
        <Card style={styles.card}>
          <View style={styles.descHeaderRow}>
            <Text style={styles.sectionHeading}>3. अपनी समस्या बताएं:</Text>
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={handleVoiceInput}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="microphone" size={16} color={COLORS.text} />
              <Text style={styles.voiceBtnText}>बोलकर लिखें</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="अपनी समस्या का विवरण यहाँ लिखें या ऊपर दिए विकल्प पर टैप करें..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </Card>

        {/* ─── 4. PHOTO ATTACHMENT ─── */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>4. तौल पर्ची या रसीद की फोटो (वैकल्पिक):</Text>
          <TouchableOpacity
            style={[styles.photoAttachBox, hasPhoto && styles.photoAttachBoxActive]}
            onPress={handleAttachPhoto}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={hasPhoto ? 'check-circle' : 'camera-plus'}
              size={26}
              color={hasPhoto ? COLORS.success : COLORS.primary}
            />
            <Text style={[styles.photoAttachText, hasPhoto && styles.photoAttachTextActive]}>
              {hasPhoto ? 'रसीद की फोटो जोड़ी गई (weighment_slip.jpg)' : 'फोटो खींचें या गैलरी से चुनें'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* ─── 5. PUBLIC SERVICE GUARANTEE ─── */}
        <Card variant="success" style={styles.guaranteeCard}>
          <View style={styles.guaranteeRow}>
            <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guaranteeTitle}>म.प्र. लोक सेवा गारंटी अधिनियम</Text>
              <Text style={styles.guaranteeSub}>
                आपकी शिकायत का समाधान 48 घंटे के भीतर जिला नोडल अधिकारी द्वारा अनिवार्य रूप से किया जाएगा।
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── 6. SUBMIT BUTTON ─── */}
        <Button
          title="शिकायत दर्ज करें →"
          variant="primary"
          size="lg"
          icon="send"
          loading={loading}
          fullWidth
          onPress={handleSubmit}
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
    gap: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  sectionHeading: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTile: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    minHeight: 46,
  },
  categoryTileSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryTileText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  categoryTileTextSelected: {
    color: COLORS.white,
  },
  templatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateChip: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: '#F8E4A0',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  templateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  descHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
  },
  voiceBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    fontSize: 13,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 88,
  },
  photoAttachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  photoAttachBoxActive: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    borderStyle: 'solid',
  },
  photoAttachText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    color: COLORS.primary,
  },
  photoAttachTextActive: {
    color: COLORS.successDark,
  },
  guaranteeCard: {
    padding: SPACING.sm + 4,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guaranteeTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    color: COLORS.successDark,
  },
  guaranteeSub: {
    ...TYPOGRAPHY.bodySmall,
    color: '#166534',
    lineHeight: 16,
    marginTop: 2,
  },
});
