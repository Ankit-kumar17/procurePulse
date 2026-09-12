import defaultFarmer from '../data/farmer.json';
import defaultCentres from '../data/centres.json';
import defaultSlots from '../data/slots.json';
import defaultBookings from '../data/bookings.json';
import defaultPayments from '../data/payments.json';
import defaultGrievances from '../data/grievances.json';

// In-memory simulated database stores
let farmerStore = { ...defaultFarmer };
let centresStore = [...defaultCentres];
let slotsStore = { ...defaultSlots };
let bookingsStore = [...defaultBookings];
let paymentsStore = [...defaultPayments];
let grievancesStore = [...defaultGrievances];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Farmer Profile
  getFarmer: async () => {
    await delay(300);
    return { success: true, data: { ...farmerStore } };
  },

  updateFarmer: async (updates) => {
    await delay(400);
    farmerStore = { ...farmerStore, ...updates };
    return { success: true, data: { ...farmerStore } };
  },

  registerFarmer: async (registrationData) => {
    await delay(600);
    const newId = `MP-FR-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    farmerStore = {
      ...defaultFarmer,
      ...registrationData,
      farmerId: newId,
      aadhaarVerified: true,
      eligibility: 'ELIGIBLE',
      entitlement: '2000 kg'
    };
    return { success: true, data: { ...farmerStore } };
  },

  // Centres
  getCentres: async () => {
    await delay(350);
    return { success: true, data: [...centresStore] };
  },

  // Slots
  getSlots: async (centreId, date = '2026-04-18') => {
    await delay(300);
    const dateSlots = slotsStore.dates[date] || slotsStore.dates['2026-04-18'];
    return {
      success: true,
      data: {
        centreId,
        date,
        ...dateSlots
      }
    };
  },

  // Bookings
  getBookings: async () => {
    await delay(300);
    return { success: true, data: [...bookingsStore] };
  },

  bookSlot: async (bookingPayload) => {
    await delay(600);
    const tokenSeq = Math.floor(1000 + Math.random() * 9000);
    const token = `MP-WHT-2026-${tokenSeq}`;
    const newBooking = {
      bookingId: `B${Date.now().toString().slice(-4)}`,
      token,
      farmerId: farmerStore.farmerId || 'MP-FR-2026-0001',
      farmerName: farmerStore.name || 'Ramesh Kumar',
      centreId: bookingPayload.centreId || 2,
      centre: bookingPayload.centreName || 'Berasia Cooperative Procurement Hub (Centre B)',
      centreAddress: bookingPayload.centreAddress || 'Near NH-46 Junction, Berasia Hub',
      date: bookingPayload.date || '2026-04-18',
      timeSlot: bookingPayload.timeSlot || '11:00 AM - 12:00 PM',
      crop: bookingPayload.crop || 'Wheat (Sharbati)',
      landKhasra: bookingPayload.landKhasra || '123/1 (Pipariya)',
      quantity: bookingPayload.quantity || '2000 kg',
      status: 'BOOKED',
      recommendedArrival: bookingPayload.recommendedArrival || '11:35 AM - 11:50 AM',
      gatePassStatus: 'Generated',
      currentQueuePosition: 19,
      nowServingToken: 14,
      farmersAhead: 5,
      estimatedTurnTime: '11:48 AM',
      recommendedDeparture: '11:15 AM',
      qrData: `PROCUREPULSE:TOKEN=${token};FARMER=${farmerStore.farmerId};QTY=${bookingPayload.quantity || '2000KG'};DATE=${bookingPayload.date};SLOT=${bookingPayload.timeSlot}`
    };

    bookingsStore.unshift(newBooking);
    return { success: true, data: newBooking };
  },

  // Live Queue
  getQueue: async (bookingId) => {
    await delay(200);
    const booking = bookingsStore.find((b) => b.bookingId === bookingId) || bookingsStore[0];
    return {
      success: true,
      data: {
        bookingId: booking.bookingId,
        token: booking.token,
        centre: booking.centre,
        centreAddress: booking.centreAddress,
        nowServingToken: booking.nowServingToken,
        yourToken: booking.currentQueuePosition,
        farmersAhead: booking.farmersAhead,
        estimatedTurnTime: booking.estimatedTurnTime,
        recommendedDeparture: booking.recommendedDeparture,
        avgTurnaroundMins: 12,
        activeWeighbridges: 3,
        moistureTestingPace: 'Optimal (3 min/sample)'
      }
    };
  },

  // Payments
  getPayments: async () => {
    await delay(300);
    return { success: true, data: [...paymentsStore] };
  },

  retryPayment: async (paymentId) => {
    await delay(700);
    paymentsStore = paymentsStore.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'INITIATED',
          failureReason: undefined,
          transactionId: `PFMS-RETRY-${Date.now().toString().slice(-6)}`,
          paymentDate: 'Reprocessing with Updated Bank Details (Expected 24h)'
        };
      }
      return p;
    });
    return { success: true, data: [...paymentsStore] };
  },

  // Grievance
  getGrievances: async () => {
    await delay(300);
    return { success: true, data: [...grievancesStore] };
  },

  submitGrievance: async (grievance) => {
    await delay(500);
    const newGrv = {
      id: `GRV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      category: grievance.category || 'Other Issue',
      subject: grievance.subject || 'Farmer Grievance',
      description: grievance.description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      priority: grievance.priority || 'Medium',
      response: 'Ticket acknowledged by District Nodal Officer. Investigation initiated.',
      photoAttached: !!grievance.photoAttached
    };
    grievancesStore.unshift(newGrv);
    return { success: true, data: newGrv };
  }
};
