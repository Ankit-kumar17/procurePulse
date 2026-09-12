export const APP_CONFIG = {
  appName: 'ProcurePulse',
  tagline: 'Smart Wheat Procurement Intelligence for Farmers',
  subTagline: 'Madhya Pradesh e-Uparjan 2.0 Initiative',
  version: '1.0.0 (SIH 2026 Prototype)',
  state: 'Madhya Pradesh',
  helpline: '1800-233-0000',
  smsCode: '56161',
  portalUrl: 'mpeuparjan.nic.in'
};

export const CROPS = [
  { id: 'wheat', name: 'Wheat (गेहूं)', varieties: ['Sharbati A-Grade', 'Lokwan', 'Malwa Gold (HD 2967)'], mspRate: 2275 },
  { id: 'chana', name: 'Gram / Chana (चना)', varieties: ['Desi Chana', 'Kabuli'], mspRate: 5440 },
  { id: 'mustard', name: 'Mustard (सरसों)', varieties: ['Pusa Bold', 'Giriraj'], mspRate: 5650 }
];

export const SEASONS = [
  { id: 'rabi_2026_27', name: 'Rabi 2026-27 (Active)', active: true },
  { id: 'kharif_2026', name: 'Kharif 2026', active: false }
];

export const GRIEVANCE_CATEGORIES = [
  'Payment Delay',
  'Quality & Moisture Dispute',
  'Weight / Tare Dispute',
  'Slot Booking / Reschedule Issue',
  'Gate Pass Rejection',
  'Infrastructure & Shed Facility',
  'Other Issue'
];
