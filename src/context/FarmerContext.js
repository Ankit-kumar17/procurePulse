import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthContext';

const FarmerContext = createContext();

export const FarmerProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [centres, setCentres] = useState([]);
  const [payments, setPayments] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Live Queue Simulation State
  const [queueState, setQueueState] = useState({
    nowServing: 14,
    yourTokenNumber: 19,
    farmersAhead: 5,
    estimatedTurnTime: '11:48 AM',
    recommendedDeparture: '11:15 AM',
    departureCountdownMins: 22,
    hasDelayAlert: false,
    delayMinutes: 47,
    newETA: '12:35 PM',
    delayReason: 'Moisture lab calibration backlog & unexpected tractor influx',
    delayTimestamp: null
  });

  useEffect(() => {
    if (isLoggedIn) {
      loadInitialData();
    }
  }, [isLoggedIn, user]);

  const loadInitialData = async () => {
    setIsLoadingData(true);
    try {
      const [farmerRes, bookingsRes, centresRes, paymentsRes, grievancesRes] = await Promise.all([
        mockApi.getFarmer(),
        mockApi.getBookings(),
        mockApi.getCentres(),
        mockApi.getPayments(),
        mockApi.getGrievances()
      ]);

      setFarmer(user || farmerRes.data);
      setBookings(bookingsRes.data);
      setCentres(centresRes.data);
      setPayments(paymentsRes.data);
      setGrievances(grievancesRes.data);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const bookSlot = async (slotData) => {
    try {
      const res = await mockApi.bookSlot(slotData);
      if (res.success) {
        setBookings((prev) => [res.data, ...prev]);
        return { success: true, booking: res.data };
      }
      return { success: false, error: 'Booking failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addLandHolding = (newLand) => {
    const updatedLands = [...(farmer?.landHoldings || []), newLand];
    const updated = { ...farmer, landHoldings: updatedLands };
    setFarmer(updated);
    mockApi.updateFarmer(updated);
  };

  const submitGrievance = async (grievanceData) => {
    try {
      const res = await mockApi.submitGrievance(grievanceData);
      if (res.success) {
        setGrievances((prev) => [res.data, ...prev]);
        return { success: true, grievance: res.data };
      }
      return { success: false };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const retryPayment = async (paymentId) => {
    try {
      const res = await mockApi.retryPayment(paymentId);
      if (res.success) {
        setPayments(res.data);
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const triggerManualDelayAlert = (trigger = true) => {
    setQueueState((prev) => ({
      ...prev,
      hasDelayAlert: trigger,
      delayTimestamp: trigger ? new Date().toLocaleTimeString() : null
    }));
  };

  const advanceQueueToken = () => {
    setQueueState((prev) => {
      const nextServing = prev.nowServing + 1;
      const ahead = Math.max(0, prev.yourTokenNumber - nextServing);
      return {
        ...prev,
        nowServing: nextServing,
        farmersAhead: ahead,
        estimatedTurnTime: ahead === 0 ? 'Now!' : `${11 + Math.floor(ahead * 4 / 60)}:${String((48 - ahead * 3) % 60).padStart(2, '0')} AM`
      };
    });
  };

  return (
    <FarmerContext.Provider
      value={{
        farmer: farmer || user,
        setFarmer,
        bookings,
        centres,
        payments,
        grievances,
        isLoadingData,
        queueState,
        setQueueState,
        bookSlot,
        addLandHolding,
        submitGrievance,
        retryPayment,
        triggerManualDelayAlert,
        advanceQueueToken,
        refreshData: loadInitialData,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmer = () => useContext(FarmerContext);
export default FarmerContext;
