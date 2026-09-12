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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);

  // Step 1: Mobile & OTP
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [mobileVerified, setMobileVerified] = useState(false);

  // Step 2: Aadhaar eKYC
  const [aadhaar, setAadhaar] = useState('1234 5678 9012');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  // Step 3: Personal Details
  const [name, setName] = useState('Ramesh Kumar');
  const [fatherName, setFatherName] = useState('Shivcharan Kumar');
  const [dob, setDob] = useState('1982-05-14');
  const [address, setAddress] = useState('Village Pipariya, Tehsil Berasia, Dist. Bhopal, MP');

  // Step 4: Land Details
  const [khasra, setKhasra] = useState('123/1');
  const [area, setArea] = useState('2.5');
  const [village, setVillage] = useState('Pipariya');
  const [tehsil, setTehsil] = useState('Berasia');
  const [district, setDistrict] = useState('Bhopal');
  const [landList, setLandList] = useState([
    {
      id: 'L01',
      khasra: '123/1',
      area: 2.5,
      village: 'Pipariya',
      tehsil: 'Berasia',
      district: 'Bhopal',
      crop: 'Wheat (Sharbati)',
      status: 'Verified (RCMS MP)'
    }
  ]);

  // Step 5: Bank Details
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('30489218392');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [bankVerified, setBankVerified] = useState(false);

  // Step 6: Crop Declaration
  const [selectedCrop, setSelectedCrop] = useState('Wheat (Sharbati A-Grade)');
  const [selectedSeason, setSelectedSeason] = useState('Rabi 2026-27');
  const [declaredLand, setDeclaredLand] = useState('123/1 (2.5 Ha)');

  // Registration Success
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredFarmerId, setRegisteredFarmerId] = useState('');

  const handleVerifyMobile = () => {
    if (!mobile || !otp) {
      Alert.alert('Missing Info', 'Please enter mobile number and OTP.');
      return;
    }
    setMobileVerified(true);
    Alert.alert('Mobile Verified', 'Mobile OTP verified successfully.');
  };

  const handleVerifyAadhaar = () => {
    if (!aadhaar || aadhaar.length < 12) {
      Alert.alert('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setAadhaarVerified(true);
    Alert.alert('Aadhaar e-KYC Verified', 'UIDAI biometric identity authenticated.');
  };

  const handleAddLand = () => {
    if (!khasra || !area || !village) {
      Alert.alert('Required Fields', 'Please fill Khasra, Area, and Village.');
      return;
    }
    const newLand = {
      id: 'L0' + (landList.length + 1),
      khasra,
      area: parseFloat(area),
      village,
      tehsil,
      district,
      crop: selectedCrop,
      status: 'Verified (RCMS MP)'
    };
    setLandList([...landList, newLand]);
    Alert.alert('Land Parcel Added', `Khasra ${khasra} added to your land records.`);
  };

  const handleVerifyBank = () => {
    if (!accountNumber || !ifsc) {
      Alert.alert('Missing Fields', 'Please enter Account Number and IFSC.');
      return;
    }
    setBankVerified(true);
    Alert.alert('Bank Account Verified', 'Penny drop verification successful via NPCI / PFMS.');
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    const payload = {
      name,
      fatherName,
      dob,
      mobile,
      aadhaarNumber: aadhaar,
      aadhaarVerified: true,
      address,
      landHoldings: landList,
      bankAccount: {
        bank: bankName,
        account: accountNumber,
        ifsc,
        verified: true
      },
      crop: 'Wheat',
      variety: 'Sharbati A-Grade',
      season: selectedSeason,
      entitlement: '2000 kg'
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      setRegisteredFarmerId(res.farmer?.farmerId || 'MP-FR-2026-0001');
      setIsSuccess(true);
    } else {
      Alert.alert('Registration Failed', res.error || 'Please check inputs.');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !mobileVerified) {
      Alert.alert('Verify Mobile', 'Please click "Verify OTP" before proceeding.');
      return;
    }
    if (currentStep === 2 && !aadhaarVerified) {
      Alert.alert('Verify Aadhaar', 'Please click "Verify eKYC" before proceeding.');
      return;
    }
    if (currentStep === 5 && !bankVerified) {
      Alert.alert('Verify Bank', 'Please click "Verify Bank Account" before proceeding.');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <MaterialCommunityIcons name="check-decagram" size={60} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Registration Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your farmer profile has been created and verified on MP e-Uparjan.
          </Text>

          <View style={styles.idBox}>
            <Text style={styles.idBoxLabel}>ASSIGNED FARMER ID</Text>
            <Text style={styles.idBoxValue}>{registeredFarmerId}</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Farmer Name</Text>
              <Text style={styles.summaryVal}>{name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Land</Text>
              <Text style={styles.summaryVal}>{landList.reduce((acc, l) => acc + l.area, 0)} Ha</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Crop Quota</Text>
              <Text style={styles.summaryVal}>2000 kg (Wheat)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Bank DBT</Text>
              <Text style={styles.summaryVal}>SBI Verified</Text>
            </View>
          </View>

          <Button
            title="Go to Dashboard"
            variant="primary"
            size="lg"
            icon="view-dashboard"
            onPress={() => {
              // Context is already logged in, auth stack will unmount or transition
            }}
            style={{ width: '100%', marginTop: SPACING.lg }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 24) + 6 }]}>
        <TouchableOpacity onPress={() => currentStep > 1 ? prevStep() : navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.topBarTitle}>Farmer Registration</Text>
          <Text style={styles.topBarStep}>Step {currentStep} of {totalSteps}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Mobile OTP */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="cellphone-check" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Mobile Number Verification</Text>
            </View>
            <Text style={styles.stepDesc}>
              Enter your mobile number to receive slot confirmation SMS and payment DBT notifications.
            </Text>

            <Input
              label="Mobile Number"
              placeholder="10-digit mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              icon="cellphone"
            />

            <View style={styles.verifyRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  icon="key"
                />
              </View>
              <Button
                title={mobileVerified ? 'Verified ✓' : 'Verify OTP'}
                variant={mobileVerified ? 'gold' : 'secondary'}
                onPress={handleVerifyMobile}
                style={{ marginTop: 22, height: 48 }}
              />
            </View>

            {mobileVerified && (
              <Badge label="Mobile Number Verified via OTP" variant="success" icon="check-circle" style={{ marginTop: 8 }} />
            )}
          </View>
        )}

        {/* Step 2: Aadhaar eKYC */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="card-account-details-outline" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Aadhaar e-KYC Verification</Text>
            </View>
            <Text style={styles.stepDesc}>
              Link your Aadhaar to auto-fetch verified land records and enable Direct Benefit Transfer (DBT).
            </Text>

            <Input
              label="Aadhaar Number (12 Digits)"
              placeholder="1234 5678 9012"
              value={aadhaar}
              onChangeText={setAadhaar}
              keyboardType="number-pad"
              icon="shield-account"
              helperText="Pre-filled for demonstration"
            />

            <Button
              title={aadhaarVerified ? 'e-KYC Verified ✓' : 'Verify Aadhaar with UIDAI'}
              variant={aadhaarVerified ? 'gold' : 'primary'}
              icon="fingerprint"
              onPress={handleVerifyAadhaar}
              style={{ marginTop: SPACING.sm }}
            />

            {aadhaarVerified && (
              <View style={styles.verifiedBox}>
                <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.success} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.verifiedBoxTitle}>Identity Authenticated</Text>
                  <Text style={styles.verifiedBoxSubtitle}>Name matched with UIDAI: Ramesh Kumar</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Step 3: Personal Details */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="account-edit" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Personal Details</Text>
            </View>
            <Text style={styles.stepDesc}>
              Review your personal information populated from Aadhaar e-KYC.
            </Text>

            <Input label="Full Name" value={name} onChangeText={setName} icon="account" />
            <Input label="Father's / Husband's Name" value={fatherName} onChangeText={setFatherName} icon="account-supervisor" />
            <Input label="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} icon="calendar" />
            <Input label="Residential Address" value={address} onChangeText={setAddress} multiline numberOfLines={2} icon="home-map-marker" />
          </View>
        )}

        {/* Step 4: Land Details */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="terrain" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Land Holdings & Khasra Details</Text>
            </View>
            <Text style={styles.stepDesc}>
              Add agricultural land parcels registered in Revenue Case Management System (RCMS MP).
            </Text>

            <View style={styles.addLandForm}>
              <Text style={styles.subHeading}>Add New Land Parcel</Text>
              <View style={styles.grid2}>
                <Input label="Khasra No." value={khasra} onChangeText={setKhasra} placeholder="e.g. 123/1" style={{ flex: 1 }} />
                <Input label="Area (Hectares)" value={area} onChangeText={setArea} placeholder="e.g. 2.5" keyboardType="numeric" style={{ flex: 1 }} />
              </View>
              <Input label="Village" value={village} onChangeText={setVillage} placeholder="Village Name" />
              <View style={styles.grid2}>
                <Input label="Tehsil" value={tehsil} onChangeText={setTehsil} placeholder="Tehsil" style={{ flex: 1 }} />
                <Input label="District" value={district} onChangeText={setDistrict} placeholder="District" style={{ flex: 1 }} />
              </View>

              <Button
                title="+ Add Land Parcel"
                variant="secondary"
                size="sm"
                onPress={handleAddLand}
                style={{ alignSelf: 'flex-start' }}
              />
            </View>

            <Text style={[styles.subHeading, { marginTop: SPACING.md }]}>
              Registered Land Parcels ({landList.length})
            </Text>

            {landList.map((l, idx) => (
              <View key={idx} style={styles.landCard}>
                <View style={styles.landCardHeader}>
                  <Text style={styles.landKhasra}>Khasra #{l.khasra}</Text>
                  <Badge label={l.status} variant="success" size="sm" />
                </View>
                <Text style={styles.landDetail}>
                  Area: <Text style={{ fontWeight: '700' }}>{l.area} Ha</Text> • {l.village}, {l.tehsil}, {l.district}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Step 5: Bank Details */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="bank" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Bank Account for DBT Payout</Text>
            </View>
            <Text style={styles.stepDesc}>
              MSP payments will be directly credited to this Aadhaar-seeded bank account.
            </Text>

            <Input label="Bank Name" value={bankName} onChangeText={setBankName} icon="bank" />
            <Input label="Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" icon="credit-card" />
            <Input label="IFSC Code" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" icon="barcode" />

            <Button
              title={bankVerified ? 'Bank Verified via PFMS ✓' : 'Verify Account via PFMS / NPCI'}
              variant={bankVerified ? 'gold' : 'primary'}
              icon="bank-check"
              onPress={handleVerifyBank}
              style={{ marginTop: SPACING.sm }}
            />

            {bankVerified && (
              <Badge label="Aadhaar-Seeded Bank Verified for DBT" variant="success" icon="check-circle" style={{ marginTop: 10 }} />
            )}
          </View>
        )}

        {/* Step 6: Crop Declaration */}
        {currentStep === 6 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <MaterialCommunityIcons name="sprout" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Crop Declaration & Entitlement</Text>
            </View>
            <Text style={styles.stepDesc}>
              Declare the crop sown for procurement under MSP Rabi 2026-27.
            </Text>

            <Input label="Procurement Crop" value={selectedCrop} editable={false} icon="grain" />
            <Input label="Procurement Season" value={selectedSeason} editable={false} icon="calendar-clock" />
            <Input label="Linked Land Parcel" value={declaredLand} editable={false} icon="map-marker-check" />

            <View style={styles.entitlementCard}>
              <MaterialCommunityIcons name="scale" size={24} color={COLORS.accentDark} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.entitleTitle}>Calculated MSP Entitlement</Text>
                <Text style={styles.entitleVal}>2,000 kg (20.00 Quintals)</Text>
                <Text style={styles.entitleNote}>Estimated MSP Value: ₹45,500 @ ₹2,275/Qtl</Text>
              </View>
            </View>
          </View>
        )}

        {/* Step Navigation Buttons */}
        <View style={styles.stepBtnRow}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              variant="outline"
              size="md"
              icon="arrow-left"
              onPress={prevStep}
              style={{ flex: 1 }}
            />
          )}

          {currentStep < totalSteps ? (
            <Button
              title="Next Step"
              variant="primary"
              size="md"
              iconRight="arrow-right"
              onPress={nextStep}
              style={{ flex: 1 }}
            />
          ) : (
            <Button
              title="Submit Registration"
              variant="gold"
              size="lg"
              icon="check-circle"
              loading={loading}
              onPress={handleSubmitRegistration}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  topBarStep: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: COLORS.border,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: COLORS.accent,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  stepContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(46,139,87,0.3)',
  },
  verifiedBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  verifiedBoxSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addLandForm: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  landCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  landCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  landKhasra: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  landDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  entitlementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight + '33',
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  entitleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  entitleVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 2,
  },
  entitleNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  stepBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.sm,
  },
  successContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  idBox: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  idBoxLabel: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  idBoxValue: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  summaryGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: {
    width: '50%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
});
