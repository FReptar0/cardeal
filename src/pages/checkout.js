// /pages/checkout.js
"use client";

import React from "react";
import { Container, Box } from "@mui/material";
import RentalStepper from "@/components/Stepper";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import OrderSummary from "@/components/OrderSummary";
import UserForm from "@/components/UserForm";

const formatCurrency = (amount) =>
  amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function CheckoutPage() {
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

  // extras calculation...
  const baseExtras = [
    { id: "conductor_adicional", nombre: "Conductor Adicional", precio: 110 },
    {
      id: "conductor_menor",
      nombre: "Conductor Menor de 25 Años",
      precio: 110,
    },
    { id: "baby_seat", nombre: "Baby Seat (Grupo 0+)", precio: 150 },
    { id: "child_seat", nombre: "Child Seat (Grupo 0/1/2)", precio: 150 },
    { id: "booster", nombre: "Booster", precio: 150 },
  ];
  let extrasInfo = [];
  let totalExtrasCost = 0;
  for (const exId in selectedExtras) {
    const qty = selectedExtras[exId];
    if (qty > 0) {
      const def = baseExtras.find((e) => e.id === exId);
      if (def) {
        const line = def.precio * qty * rentalDays;
        totalExtrasCost += line;
        extrasInfo.push({ ...def, cantidad: qty, lineCost: line });
      }
    }
  }

  const otherCharges = (totalCarCost + totalExtrasCost) * .23;
  const otherCharges2 = (totalCarCost2 + totalExtrasCost) * .23;

  const subTotal = totalCarCost + totalInsuranceCost + totalExtrasCost + otherCharges;
  const subTotal2 = totalCarCost2 + totalInsuranceCost + totalExtrasCost + otherCharges2;
  const ivaCost = subTotal * 0.16;
  const ivaCost2 = subTotal2 * 0.16;
  const totalWithIva = subTotal + ivaCost;
  const totalWithIva2 = subTotal2 + ivaCost2;

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
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <UserForm />
        </Box>
      </Box>
    </Container>
  );
}
