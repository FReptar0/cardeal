/**
 * Centralized calculation utilities for booking and pricing
 */

/**
 * Format currency amount to Mexican peso format
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "$0.00";
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Calculate rental days between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {number} Number of rental days
 */
export const calculateRentalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  return days > 0 ? days : 1;
};

/**
 * Parse insurance cost from string format
 * @param {string} insuranceTotal - Insurance total string (e.g., "$150.00")
 * @returns {number} Parsed insurance cost
 */
export const parseInsuranceCost = (insuranceTotal) => {
  if (!insuranceTotal) return 0;
  const numString = insuranceTotal.replace(/[^\d.]/g, "");
  return parseFloat(numString) || 0;
};

/**
 * Calculate total extras cost
 * @param {Object} selectedExtras - Selected extras object
 * @param {number} rentalDays - Number of rental days
 * @returns {number} Total extras cost
 */
export const calculateExtrasCost = (selectedExtras, rentalDays) => {
  if (!selectedExtras || !rentalDays) return 0;
  
  let totalExtrasCost = 0;
  for (const key in selectedExtras) {
    const extra = selectedExtras[key];
    if (extra && extra.cantidad > 0) {
      const lineCost = (extra.precio || 0) * extra.cantidad * rentalDays;
      totalExtrasCost += lineCost;
    }
  }
  
  return totalExtrasCost;
};

/**
 * Calculate comprehensive booking totals
 * @param {Object} params - Calculation parameters
 * @returns {Object} Calculated totals
 */
export const calculateBookingTotals = ({
  selectedCar,
  selectedInsurance,
  selectedExtras,
  searchData,
  discount = 0,
  isOnlinePayment = false
}) => {
  if (!selectedCar || !searchData) {
    return {
      rentalDays: 1,
      dailyCarCost: 0,
      totalCarCost: 0,
      dailyInsuranceCost: 0,
      totalInsuranceCost: 0,
      totalExtrasCost: 0,
      otherCharges: 0,
      subTotal: 0,
      ivaCost: 0,
      totalWithIva: 0,
      finalTotal: 0
    };
  }

  // Calculate rental days
  const rentalDays = calculateRentalDays(searchData.pickupDate, searchData.returnDate);

  // Car costs - IMPORTANT: This matches the original checkout.js logic
  // selectedCar.price = online payment (cheaper discount price)
  // selectedCar.price2 = counter payment (full price, more expensive)
  const dailyCarCost = isOnlinePayment 
    ? Number(selectedCar.price || 0)  // Online payment (cheaper)
    : Number(selectedCar.price2 || 0); // Counter payment (more expensive)
  const totalCarCost = dailyCarCost * rentalDays;

  // Insurance costs
  const dailyInsuranceCost = selectedInsurance 
    ? parseInsuranceCost(selectedInsurance.total)
    : 0;
  const totalInsuranceCost = dailyInsuranceCost * rentalDays;

  // Extras costs
  const totalExtrasCost = calculateExtrasCost(selectedExtras, rentalDays);

  // Other charges (23% of car + extras + insurance)
  const otherCharges = (totalCarCost + totalExtrasCost + totalInsuranceCost) * 0.23;

  // Subtotal
  const subTotal = totalCarCost + totalInsuranceCost + totalExtrasCost + otherCharges;

  // IVA (16% of subtotal)
  const ivaCost = subTotal * 0.16;

  // Total with IVA
  const totalWithIva = subTotal + ivaCost;

  // Final total after discount
  const finalTotal = Math.max(0, totalWithIva - Number(discount || 0));

  return {
    rentalDays,
    dailyCarCost,
    totalCarCost,
    dailyInsuranceCost,
    totalInsuranceCost,
    totalExtrasCost,
    otherCharges,
    subTotal,
    ivaCost,
    totalWithIva,
    finalTotal,
    discount: Number(discount || 0)
  };
};