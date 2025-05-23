// components/OrderSummaryConfirmed.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import PropTypes from "prop-types";
import extrasData from "../data/extras.json";

const parsePrecio = (precio) => {
  if (typeof precio === "number") return precio;
  if (typeof precio === "string") {
    return parseFloat(precio.replace(/[^\d.]/g, ""));
  }
  return 0;
};

export default function OrderSummaryConfirmed({
  selectedCar,
  pickupDateString,
  returnDateString,
  rentalDays,
  dailyCarCost,
  totalCarCost,
  selectedInsurance,
  totalInsuranceCost,
  extrasInfo,
  ivaCost,
  otherCharges,
  totalWithIva,
  formatCurrency,
  subtotal,
  discount,
  paidOnline,
}) {
  console.log("extrasInfo", extrasInfo);

  // Si extrasInfo es un objeto tipo {BABY: 1}, mapearlo usando el JSON
  const extrasArray = React.useMemo(() => {
  if (Array.isArray(extrasInfo)) {
    return extrasInfo.map((ex) => ({
      ...ex,
      lineCost: Number(ex.precio?.$numberInt ?? ex.precio) * Number(ex.cantidad) * rentalDays,
    }));
  }

  // Caso antiguo: objeto tipo { BOOSTER: 1 }
  return Object.entries(extrasInfo || {}).map(([id, cantidad]) => {
    const def = extrasData.find((e) => e.id === id);
    if (!def || !cantidad) return null;
    return {
      ...def,
      cantidad,
      lineCost: def.precio * cantidad * rentalDays,
    };
  }).filter(Boolean);
}, [extrasInfo, rentalDays]);

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
        {selectedCar ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {selectedCar.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCar.category}
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              <b>Fechas de la Renta:</b>
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2">
                {pickupDateString} - {returnDateString}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ({rentalDays} días)
              </Typography>
            </Box>

            {/* Solo un precio según el método */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2" fontStyle="italic">
                {paidOnline
                  ? `${formatCurrency(dailyCarCost)} /día (precio en línea)`
                  : `${formatCurrency(dailyCarCost)} /día (precio mostrador)`}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(totalCarCost)}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography>No se ha seleccionado un vehículo.</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Protección */}
        {selectedInsurance && (
          <>
            <Typography variant="subtitle1">
              <b>Protección Seleccionada:</b>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" fontWeight="bold">
                {selectedInsurance.nombre}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {selectedInsurance.total} /día
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="body2" fontStyle="italic">
                ({rentalDays} días) = {formatCurrency(totalInsuranceCost)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Extras */}
        <Typography variant="subtitle1">
          <b>Extras Seleccionados:</b>
        </Typography>
        {extrasArray.length > 0 ? (
          extrasArray.map((ex) => (
            <Box
              key={ex.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2">
                {ex.nombre} x {ex.cantidad}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(ex.precio * ex.cantidad * rentalDays)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">
            No se han seleccionado extras.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Otros Cargos */}
        <Typography variant="subtitle1">
          <b>Otros Cargos:</b>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">
            {paidOnline ? "Pago en línea" : "Pago en mostrador"}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(otherCharges)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Subtotales */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight="bold">
            Subtotal {paidOnline ? "/en línea" : "/mostrador"}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(subtotal)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* IVA */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight="bold">
            IVA (16%) {paidOnline ? "en línea" : "mostrador"}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(ivaCost)}
          </Typography>
        </Box>

        {/* Total */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {paidOnline
              ? "Total pagado en línea"
              : "Total a pagar en mostrador"}
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={paidOnline ? { color: "#10906a" } : undefined}
          >
            {formatCurrency(totalWithIva)}
          </Typography>
        </Box>

        {/* Descuento */}
        {discount > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">
              <b>Descuento aplicado:</b>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Descuento</Typography>
              <Typography variant="body2" fontWeight="bold">
                -{formatCurrency(discount)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

OrderSummaryConfirmed.propTypes = {
  selectedCar: PropTypes.object,
  pickupDateString: PropTypes.string,
  returnDateString: PropTypes.string,
  rentalDays: PropTypes.number,
  dailyCarCost: PropTypes.number,
  totalCarCost: PropTypes.number,
  selectedInsurance: PropTypes.object,
  totalInsuranceCost: PropTypes.number,
  extrasInfo: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ivaCost: PropTypes.number,
  otherCharges: PropTypes.number,
  totalWithIva: PropTypes.number,
  formatCurrency: PropTypes.func,
  subtotal: PropTypes.number,
  discount: PropTypes.number,
  paidOnline: PropTypes.bool,
};
