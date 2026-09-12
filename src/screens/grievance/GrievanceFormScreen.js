import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { useFarmer } from '../../context/FarmerContext';

const CATEGORIES = [
  { id: 'Payment Delay', label: 'पैसा नहीं मिला / देरी', icon: 'cash-clock', color: '#B45309' },
  { id: 'Weight / Tare Dispute', label: 'तौल / वजन में फर्क', icon: 'scale-balance', color: '#1E40AF' },
  { id: 'Slot Booking / Reschedule Issue', label: 'स्लॉट / टोकन समस्या', icon: 'calendar-clock', color: '#15803D' },
  { id: 'Quality & Moisture Dispute', label: 'नमी / गुणवत्ता विवाद', icon: 'water-percent', color: '#0369A1' },
  { id: 'Infrastructure & Shed Facility', label: 'मंडी / केंद्र समस्या', icon: 'storefront-outline', color: '#7C3AED' },
  { id: 'Other Issue', label: 'अन्य समस्या', icon: 'alert-circle-outline', color: '#475569' },
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
      '🎤 बोलकर शिकायत दर्ज करें',
      'अपनी समस्या बोलें (उदा.: "5 अप्रैल का गेहूं का भुगतान नहीं मिला")',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: '✅ आवाज दर्ज करें (Mock)',
          onPress: () => {
            setDescription('5 अप्रैल को बैरसिया केंद्र पर गेहूं बेचा था, ₹18,200 का भुगतान अभी तक बैंक खाते में नहीं आया है।');
          },
        },
      ]
    );
  };

  const handleAttachPhoto = () => {
    setHasPhoto(true);
    Alert.alert('✅ फोटो जोड़ी गई', 'तौल पर्ची / रसीद की फोटो सफलतापूर्वक संलग्न हो गई है।');
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
        '✅ शिकायत दर्ज हो गई',
        `शिकायत क्र.: #${result.grievance.id}\n\nआपकी शिकायत जिला उपार्जन नोडल अधिकारी को भेज दी गई है। 48 घंटे के भीतर समाधान किया जाएगा।`,
        [{ text: 'ठीक है (OK)', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('त्रुटि', 'शिकायत दर्ज नहीं हो सकी। कृपया दोबारा कोशिश करें।');
    }
  };

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20
  ) + 8;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />

      {/* ─── 1. TOP HEADER WITH BACK ─── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText}>➕ नई शिकायत दर्ज करें</Text>
            <Text style={styles.headerSubText}>48 घंटे के भीतर समाधान की गारंटी</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 2. CATEGORY SELECTION ─── */}
        <View style={styles.sectionCard}>
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
                    size={22}
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
        </View>

        {/* ─── 3. QUICK TEMPLATE CHIPS ─── */}
        <View style={styles.sectionCard}>
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
        </View>

        {/* ─── 4. DESCRIPTION INPUT ─── */}
        <View style={styles.sectionCard}>
          <View style={styles.descHeaderRow}>
            <Text style={styles.sectionHeading}>3. अपनी समस्या बताएं:</Text>
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={handleVoiceInput}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="microphone" size={16} color={COLORS.primaryDark} />
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
        </View>

        {/* ─── 5. PHOTO ATTACHMENT ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>4. तौल पर्ची या रसीद की फोटो (वैकल्पिक):</Text>
          <TouchableOpacity
            style={[styles.photoAttachBox, hasPhoto && styles.photoAttachBoxActive]}
            onPress={handleAttachPhoto}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={hasPhoto ? 'check-circle' : 'camera-plus'}
              size={28}
              color={hasPhoto ? '#15803D' : COLORS.primary}
            />
            <Text style={[styles.photoAttachText, hasPhoto && styles.photoAttachTextActive]}>
              {hasPhoto ? '✓ रसीद की फोटो जोड़ी गई (weighment_slip.jpg)' : '📷 फोटो खींचें या गैलरी से चुनें'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── 6. PUBLIC SERVICE GUARANTEE ─── */}
        <View style={styles.guaranteeBox}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#15803D" />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>म.प्र. लोक सेवा गारंटी अधिनियम</Text>
            <Text style={styles.guaranteeSub}>
              आपकी शिकायत का समाधान 48 घंटे के भीतर जिला नोडल अधिकारी द्वारा अनिवार्य रूप से किया जाएगा।
            </Text>
          </View>
        </View>

        {/* ─── 7. SUBMIT BUTTON ─── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={20} color={COLORS.white} />
              <Text style={styles.submitBtnText}>शिकायत दर्ज करें</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    gap: 12,
  },
  backButton: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerSubText: {
    fontSize: 12,
    color: COLORS.accentLight,
    fontWeight: '600',
    marginTop: 1,
  },

  /* ─── SCROLL CONTENT ─── */
  scrollContent: {
    padding: SPACING.md,
    gap: 14,
  },

  /* ─── SECTION CARD ─── */
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },

  /* ─── 2. CATEGORIES GRID ─── */
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
  },
  categoryTileSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryTileText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  categoryTileTextSelected: {
    color: COLORS.white,
  },

  /* ─── 3. TEMPLATES ─── */
  templatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateChip: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  templateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },

  /* ─── 4. DESCRIPTION ─── */
  descHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.md,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 90,
  },

  /* ─── 5. PHOTO ATTACH ─── */
  photoAttachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  photoAttachBoxActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#15803D',
    borderStyle: 'solid',
  },
  photoAttachText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  photoAttachTextActive: {
    color: '#15803D',
  },

  /* ─── 6. GUARANTEE BOX ─── */
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#15803D',
  },
  guaranteeSub: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
    marginTop: 2,
  },

  /* ─── 7. SUBMIT BUTTON ─── */
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: 4,
    ...SHADOWS.md,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
});
