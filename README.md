# 🌾 ProcurePulse — Smart Wheat Procurement Intelligence Mobile App
### Madhya Pradesh e-Uparjan 2.0 • Smart India Hackathon (SIH 2026)

**ProcurePulse** is an intelligence layer built over the existing **e-Uparjan** wheat procurement ecosystem in Madhya Pradesh. This mobile app provides an end-to-end interactive journey for farmers, transforming manual mandi line queues with **AI-Driven Smart Centre Recommendations**, **Dynamic Arrival Windows**, and **Live Gate Queue Tickers with Real-Time Delay Alerts**.

---

## 🚀 Key Differentiators & Features

1. **Smart Centre Recommendation Engine**:
   - Compares transit distance against live mandi weighbridge wait times.
   - Computes a composite efficiency score (1-100).
   - Features an interactive *"Why this recommendation?"* explainability modal breaking down queue time savings (~97 mins) and fuel efficiency.

2. **Dynamic Arrival Window (15-Minute Band)**:
   - Eliminates 4-8 hour tractor idling lines by giving each farmer a dedicated 15-minute gate arrival slot (e.g., `11:35 AM – 11:50 AM`).
   - Generates digital QR-coded Gate Pass Tokens (`MP-WHT-2026-XXXX`).

3. **Live Queue & Dynamic Delay Alerts**:
   - Real-time queue tracker showing `Now Serving #14`, `Your Token #19`, and live departure countdown clock.
   - **Simulated 30s Delay Alert Trigger**: Demonstrates dynamic real-time adaptation when unforeseen moisture bottlenecks occur with revised ETAs.
   - Includes on-screen **Judge Simulation Controls** for instantaneous demonstration.

4. **Multi-Step Farmer Registration Wizard**:
   - 6-step guided onboarding: Mobile OTP Verification, Aadhaar e-KYC (UIDAI biometric), Personal Details, Land Holdings (Khasra & RCMS MP), Bank Account (Penny drop DBT verification), and Crop Declaration.

5. **Direct Benefit Transfer (DBT) & Payment Slips**:
   - Detailed procurement history with MSP calculation (₹2,275/Qtl).
   - Printable & shareable official MP e-Uparjan Digital Weighment & Payout Slips.
   - Failed transaction retry simulation with PFMS account re-clearing.

6. **Grievance Redressal (48-Hour SLA)**:
   - Direct ticketing system for payment delays, moisture disputes, tare weight disputes, and gate issues with photo attachment support.

---

## 🛠️ Technology Stack

- **Framework**: React Native with Expo (Managed Workflow)
- **Navigation**: React Navigation 7 (`@react-navigation/native`, Stack & Bottom Tabs)
- **UI & Theme**: Custom design tokens + `react-native-paper` Material 3
- **Color Palette**:
  - Primary: `#1B3A5C` (Deep Navy)
  - Accent: `#D4A843` (Wheat Gold)
  - Success: `#2E8B57` (Forest Green)
  - Warning: `#F59E0B` (Amber)
  - Error: `#DC2626` (Crimson)
  - Background: `#FAFAF8` (Off-White)
- **Icons & QR**: `@expo/vector-icons`, `react-native-qrcode-svg`
- **State & Storage**: React Context (`AuthContext`, `FarmerContext`) + `@react-native-async-storage/async-storage`
- **Date & Calendar**: `dayjs`

---

## 📂 Project Structure

```
procurePulse/
├── App.js                         # Root application entry with Context Providers
├── app.json                       # Expo configuration
├── package.json                   # Dependencies and scripts
├── src/
│   ├── components/                # Reusable UI component library
│   │   ├── Header.js              # State branding & farmer profile header
│   │   ├── Button.js              # Primary, Gold, Outline, Danger buttons
│   │   ├── Card.js                # Elevated cards with gold border accents
│   │   ├── Input.js               # Styled inputs with validation helpers
│   │   ├── Badge.js               # Status badges (Success, Warning, AI Pick)
│   │   ├── Loader.js              # Wheat loading indicator
│   │   └── ExplainModal.js        # AI recommendation explainability popup
│   ├── context/
│   │   ├── AuthContext.js         # Persistent login & session state
│   │   └── FarmerContext.js       # Live farmer data, bookings, queue & grievances
│   ├── navigation/
│   │   ├── AppNavigator.js        # Root navigator (Auth vs MainTabs)
│   │   ├── AuthStack.js           # Splash, Login, Register
│   │   ├── BookingStack.js        # 5-step slot booking wizard
│   │   ├── GrievanceStack.js      # Complaint list & submission form
│   │   └── MainTabs.js            # 5-tab bottom navigation
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.js
│   │   ├── booking/
│   │   │   ├── SelectCropLandScreen.js
│   │   │   ├── CentreRecommendationScreen.js
│   │   │   ├── CalendarScreen.js
│   │   │   ├── TimeSlotScreen.js
│   │   │   └── BookingConfirmationScreen.js
│   │   ├── queue/
│   │   │   └── LiveQueueScreen.js
│   │   ├── payment/
│   │   │   └── PaymentStatusScreen.js
│   │   └── grievance/
│   │       ├── GrievanceListScreen.js
│   │       └── GrievanceFormScreen.js
│   ├── services/
│   │   ├── api.js                 # Future backend Axios stub
│   │   ├── mockApi.js             # Async simulated backend with latency
│   │   └── mockData.js            # Aggregated fixtures
│   ├── utils/
│   │   ├── constants.js           # MSP rates, crops, categories
│   │   ├── helpers.js             # Formatters, arrival calculators
│   │   └── theme.js               # Color tokens, typography, spacing
│   └── data/
│       ├── farmer.json            # Ramesh Kumar default profile
│       ├── centres.json           # Mandi centres with AI scoring
│       ├── slots.json             # Hourly slots and capacity
│       ├── bookings.json          # Gate pass records
│       ├── payments.json          # DBT records & receipts
│       └── grievances.json        # Dispute tickets
```

---

## 🏃 Quick Start & Running the Project

### 1. Install Dependencies
```bash
cd procurePulse
npm install
```

### 2. Start the Expo Dev Server
```bash
npx expo start
```

### 3. Running Options:
- **Mobile (Expo Go)**: Scan the generated QR code using the Expo Go app on Android or iOS.
- **Web Browser Preview**: Press `w` in the terminal to view on local web browser.
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal (macOS).

---

## 🎬 SIH 2026 Judge Demonstration Guide

1. **Launch App**: Observe the animated splash screen and smooth transition to the Login screen.
2. **Instant Demo Login**: Tap **"Login to Dashboard"** (credentials are pre-filled for Ramesh Kumar, Bhopal).
3. **Explore Dashboard**:
   - Check the **Active Slot Booking** card showing token `MP-WHT-2026-0001` and the **Dynamic Arrival Window** (`11:35 AM – 11:50 AM`).
   - Review Khasra records (`123/1` and `145/4`) and verified DBT bank status.
4. **Test Smart Slot Booking**:
   - Tap **"Book Slot"** in Quick Actions or Bottom Tabs.
   - Select Land parcel -> Tap **"Proceed to Recommended Centres"**.
   - Tap **"Why this recommendation?"** to inspect the AI reasoning for Centre B (+3.2 km distance saving 97 mins of wait time).
   - Pick date on the color-coded calendar (Green = high capacity).
   - Select **11:00 AM - 12:00 PM (Optimal)** time slot.
   - Confirm to see the generated SVG QR Code Gate Pass & Dynamic Arrival Window.
5. **Live Queue & Delay Simulation**:
   - Tap **"Live Queue"** in the bottom tab.
   - Watch the live countdown and token ticker (`#14 Now Serving` -> `#19 Your Token`).
   - Observe the **Dynamic Delay Alert** banner trigger (after 30s or tap *"Simulate 47m Bottleneck"*).
6. **Payments & Receipts**:
   - Navigate to **"Payments"** tab.
   - Tap any card to open the printable **Procurement & Weighment Slip**.
   - Test the *"Retry DBT"* button on the failed transaction card.
7. **Grievance Redressal**:
   - Navigate to **"Grievance"** tab.
   - Tap **"+ Raise Complaint"**, choose a category, attach a mock photo, and submit to see real-time ticket creation.