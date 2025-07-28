// /components/OrderSummary.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Typography,
  Divider
} from "@mui/material";
import PropTypes from "prop-types";
import VehicleSection from "@/components/order/VehicleSection";
import InsuranceSection from "@/components/order/InsuranceSection";
import PricingCalculations from "@/components/order/PricingCalculations";

export default function OrderSummary({
  selectedCar,
  pickupDateString,
  returnDateString,
  rentalDays,
  dailyCarCost,
  totalCarCost,
  dailyCarCost2,
  totalCarCost2,
  selectedInsurance,
  totalInsuranceCost,
  extrasInfo,
  ivaCost,
  ivaCost2,
  totalWithIva,
  otherCharges,
  otherCharges2,
  formatCurrency,
  subtotal,
  subtotal2,
  totals,
  discount, // Agregar el descuento como parámetro
  paidOnline,
  pickupDisplay,
  returnDisplay,
}) {
  const router = useRouter();
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const totalExtrasCost = extrasInfo.reduce((acc, ex) => acc + ex.lineCost, 0);

  // Cambiar la lógica para detectar la página de confirmación
  const isConfirmationPage = router.asPath.startsWith("/confirm/");

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          <b>Resumen de la Renta</b>
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Vehículo */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Vehículo Seleccionado:</b>
        </Typography>
        <VehicleSection
          selectedCar={selectedCar}
          pickupDateString={pickupDateString}
          returnDateString={returnDateString}
          rentalDays={rentalDays}
          dailyCarCost={dailyCarCost}
          totalCarCost={totalCarCost}
          dailyCarCost2={dailyCarCost2}
          totalCarCost2={totalCarCost2}
          paidOnline={paidOnline}
          formatCurrency={formatCurrency}
          pickupDisplay={pickupDisplay}
          returnDisplay={returnDisplay}
        />

        <Divider sx={{ my: 2 }} />

        <InsuranceSection
          selectedInsurance={selectedInsurance}
          rentalDays={rentalDays}
          totalInsuranceCost={totalInsuranceCost}
          formatCurrency={formatCurrency}
        />

        <Divider sx={{ my: 2 }} />

        <PricingCalculations
          extrasInfo={extrasInfo}
          otherCharges={otherCharges}
          otherCharges2={otherCharges2}
          paidOnline={paidOnline}
          formatCurrency={formatCurrency}
          subtotal={subtotal}
          subtotal2={subtotal2}
          ivaCost={ivaCost}
          ivaCost2={ivaCost2}
          totals={totals}
          discount={discount}
          discountApplied={discountApplied}
          totalCarCost={totalCarCost}
          isConfirmationPage={isConfirmationPage}
          totalWithIva={totalWithIva}
          totalExtrasCost={totalExtrasCost}
        />
      </CardContent>
    </Card>
  );
}

OrderSummary.propTypes = {
  selectedCar: PropTypes.object,
  pickupDateString: PropTypes.string,
  returnDateString: PropTypes.string,
  rentalDays: PropTypes.number,
  dailyCarCost: PropTypes.number,
  totalCarCost: PropTypes.number,
  dailyCarCost2: PropTypes.number,
  totalCarCost2: PropTypes.number,
  selectedInsurance: PropTypes.object,
  totalInsuranceCost: PropTypes.number,
  extrasInfo: PropTypes.array,
  ivaCost: PropTypes.number,
  totalWithIva: PropTypes.number,
  formatCurrency: PropTypes.func,
  subtotal: PropTypes.string,
  totals: PropTypes.shape({
    price: PropTypes.number,
    price2: PropTypes.number,
  }),
  discount: PropTypes.number, // Agregar el descuento como parámetro
};
