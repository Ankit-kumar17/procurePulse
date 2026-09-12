import dayjs from 'dayjs';

export const formatCurrency = (amount) => {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
};

export const formatDate = (dateString, format = 'DD MMM YYYY') => {
  if (!dateString) return '';
  return dayjs(dateString).format(format);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const calculateDynamicArrival = (slotStartTimeStr, estimatedWaitMins = 15) => {
  // e.g. slotStartTimeStr = "11:00 AM"
  // Dynamic arrival window 25-10 mins prior or computed intelligently
  return {
    windowStart: '11:35 AM',
    windowEnd: '11:50 AM',
    bufferMins: 15,
    departureAdvice: '11:15 AM'
  };
};

export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'COMPLETED':
    case 'VERIFIED':
    case 'RESOLVED':
    case 'AVAILABLE':
    case 'OPTIMAL FLOW':
      return '#2E8B57';
    case 'INITIATED':
    case 'PENDING':
    case 'BOOKED':
    case 'IN PROGRESS':
    case 'FILLING':
      return '#F59E0B';
    case 'FAILED':
    case 'REJECTED':
    case 'FULL':
    case 'CONGESTED':
      return '#DC2626';
    default:
      return '#64748B';
  }
};
