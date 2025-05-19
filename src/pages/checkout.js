// /pages/checkout.js
"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Box } from "@mui/material";
import RentalStepper from "@/components/Stepper";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import OrderSummary from "@/components/OrderSummary";
import dynamic from "next/dynamic";

const UserForm = dynamic(() => import("@/components/UserForm"), { ssr: false });
const formatCurrency = (amount) =>
  amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function CheckoutPage() {
  const [paidOnline, setPaidOnline] = useState(false);

  const { selectedCar, selectedInsurance, selectedExtras } = useBooking();
  const { searchData } = useSearch();

  const pickupDateString = searchData.pickupDate
    ? new Date(searchData.pickupDate).toLocaleDateString("es-MX")
    : "";
  const returnDateString = searchData.returnDate
    ? new Date(searchData.returnDate).toLocaleDateString("es-MX")
    : "";
  const rentalDays =
    searchData.pickupDate && searchData.returnDate
      ? Math.ceil(
          (new Date(searchData.returnDate) - new Date(searchData.pickupDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  const dailyCarCost = selectedCar?.price2 || 0;
  const dailyCarCost2 = selectedCar?.price || 0;
  const totalCarCost = dailyCarCost * rentalDays;
  const totalCarCost2 = dailyCarCost2 * rentalDays;

  const parseInsuranceCost = (s) => {
    const n = s ? s.replace(/[^\d.]/g, "") : "0";
    return parseFloat(n) || 0;
  };
  const dailyInsuranceCost = selectedInsurance
    ? parseInsuranceCost(selectedInsurance.total)
    : 0;
  const totalInsuranceCost = dailyInsuranceCost * rentalDays;

  let extrasInfo = [];
  let totalExtrasCost = 0;

  for (const key in selectedExtras) {
    const extra = selectedExtras[key];
    if (extra.cantidad > 0) {
      const lineCost = extra.precio * extra.cantidad * rentalDays;
      totalExtrasCost += lineCost;
      extrasInfo.push({ ...extra, lineCost }); 
    }
  }

  const otherCharges = (totalCarCost + totalExtrasCost) * 0.23;
  const otherCharges2 = (totalCarCost2 + totalExtrasCost) * 0.23;

  const subTotal =
    totalCarCost + totalInsuranceCost + totalExtrasCost + otherCharges;
  const subTotal2 =
    totalCarCost2 + totalInsuranceCost + totalExtrasCost + otherCharges2;
  const ivaCost = subTotal * 0.16;
  const ivaCost2 = subTotal2 * 0.16;
  const totalWithIva = subTotal + ivaCost;
  const totalWithIva2 = subTotal2 + ivaCost2;

  // Add a console log to print protection and extras data
  useEffect(() => {
    console.log("Selected Insurance:", selectedInsurance);
    console.log("Selected Extras:", selectedExtras);
  }, [selectedInsurance, selectedExtras]);

  useEffect(() => {
    console.log("Selected Car:", selectedCar);
  }, [selectedCar]);

  useEffect(() => {
    console.log("Selected Car Abbreviation:", selectedCar?.abbreviation);
  }, [selectedCar]);

  const handleSubmit = () => {
    const payload = {
      ...otherData,
      abbreviation: selectedCar?.abbreviation, // Include abbreviation
    };
    fetch("/api/bookings/registerReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <Container sx={{ mt: 4, mb: 3, maxWidth: "100vw", px: 2 }}>
      <RentalStepper />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "flex-start",
          mt: 3,
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "40%" } }}>
          <OrderSummary
            selectedCar={selectedCar}
            pickupDateString={pickupDateString}
            returnDateString={returnDateString}
            rentalDays={rentalDays}
            dailyCarCost={dailyCarCost}
            totalCarCost={totalCarCost}
            dailyCarCost2={dailyCarCost2}
            totalCarCost2={totalCarCost2}
            selectedInsurance={selectedInsurance}
            totalInsuranceCost={totalInsuranceCost}
            extrasInfo={extrasInfo}
            ivaCost={ivaCost}
            ivaCost2={ivaCost2}
            totalWithIva={totalWithIva}
            otherCharges={otherCharges}
            otherCharges2={otherCharges2}
            formatCurrency={formatCurrency}
            subtotal={subTotal}
            subtotal2={subTotal2}
            totals={{
              price: totalWithIva, // Precio para pago en línea
              price2: totalWithIva2, // Precio para pago en mostrador
            }}
            paidOnline={paidOnline}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <UserForm paidOnline={paidOnline} setPaidOnline={setPaidOnline} />
        </Box>
      </Box>
    </Container>
  );
}
