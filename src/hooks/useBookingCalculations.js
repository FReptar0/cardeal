import { useMemo } from 'react';
import { calculateBookingTotals, formatCurrency } from '@/utils/calculations';

/**
 * Custom hook for booking calculations
 * Centralizes all pricing logic and provides formatted values
 */
export const useBookingCalculations = ({
  selectedCar,
  selectedInsurance,
  selectedExtras,
  searchData,
  discount = 0
}) => {
  // Calculate totals for both payment methods
  const counterTotals = useMemo(() => 
    calculateBookingTotals({
      selectedCar,
      selectedInsurance,
      selectedExtras,
      searchData,
      discount,
      isOnlinePayment: false
    }), [selectedCar, selectedInsurance, selectedExtras, searchData, discount]
  );

  const onlineTotals = useMemo(() => 
    calculateBookingTotals({
      selectedCar,
      selectedInsurance,
      selectedExtras,
      searchData,
      discount,
      isOnlinePayment: true
    }), [selectedCar, selectedInsurance, selectedExtras, searchData, discount]
  );

  // Formatted currency values
  const formatted = useMemo(() => ({
    // Counter payment formatting
    counter: {
      dailyCarCost: formatCurrency(counterTotals.dailyCarCost),
      totalCarCost: formatCurrency(counterTotals.totalCarCost),
      dailyInsuranceCost: formatCurrency(counterTotals.dailyInsuranceCost),
      totalInsuranceCost: formatCurrency(counterTotals.totalInsuranceCost),
      totalExtrasCost: formatCurrency(counterTotals.totalExtrasCost),
      otherCharges: formatCurrency(counterTotals.otherCharges),
      subTotal: formatCurrency(counterTotals.subTotal),
      ivaCost: formatCurrency(counterTotals.ivaCost),
      totalWithIva: formatCurrency(counterTotals.totalWithIva),
      finalTotal: formatCurrency(counterTotals.finalTotal)
    },
    // Online payment formatting
    online: {
      dailyCarCost: formatCurrency(onlineTotals.dailyCarCost),
      totalCarCost: formatCurrency(onlineTotals.totalCarCost),
      dailyInsuranceCost: formatCurrency(onlineTotals.dailyInsuranceCost),
      totalInsuranceCost: formatCurrency(onlineTotals.totalInsuranceCost),
      totalExtrasCost: formatCurrency(onlineTotals.totalExtrasCost),
      otherCharges: formatCurrency(onlineTotals.otherCharges),
      subTotal: formatCurrency(onlineTotals.subTotal),
      ivaCost: formatCurrency(onlineTotals.ivaCost),
      totalWithIva: formatCurrency(onlineTotals.totalWithIva),
      finalTotal: formatCurrency(onlineTotals.finalTotal)
    },
    // Common formatting
    discount: formatCurrency(discount),
    savings: onlineTotals.finalTotal < counterTotals.finalTotal 
      ? formatCurrency(counterTotals.finalTotal - onlineTotals.finalTotal)
      : formatCurrency(0)
  }), [counterTotals, onlineTotals, discount]);

  // Helper function to get totals by payment method
  const getTotalsByPaymentMethod = (isOnline) => 
    isOnline ? onlineTotals : counterTotals;

  // Helper function to get formatted values by payment method
  const getFormattedByPaymentMethod = (isOnline) => 
    isOnline ? formatted.online : formatted.counter;

  return {
    // Raw calculation objects
    counterTotals,
    onlineTotals,
    
    // Formatted values
    formatted,
    
    // Helper functions
    getTotalsByPaymentMethod,
    getFormattedByPaymentMethod,
    
    // Convenience properties
    rentalDays: counterTotals.rentalDays,
    hasSavings: onlineTotals.finalTotal < counterTotals.finalTotal,
    savingsAmount: counterTotals.finalTotal - onlineTotals.finalTotal
  };
};