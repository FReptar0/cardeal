// /components/OrderSummary.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Divider, TextField } from "@mui/material";

export default function OrderSummary({
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
  totalWithIva,
  formatCurrency,
  subtotal,
}) {
  const totalExtrasCost = extrasInfo.reduce((acc, ex) => acc + ex.lineCost, 0);

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
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2" fontStyle="italic">
                {formatCurrency(dailyCarCost)} /día
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(totalCarCost)}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body2">
            No se ha seleccionado un vehículo.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Seguro */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Protección Seleccionada:</b>
        </Typography>
        {selectedInsurance ? (
          <>
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
          </>
        ) : (
          <Typography variant="body2">
            No se ha seleccionado una protección.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Extras */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Extras Seleccionados:</b>
        </Typography>
        {extrasInfo.length > 0 ? (
          extrasInfo.map((ex) => (
            <Box
              key={ex.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2">
                {ex.nombre} x {ex.cantidad}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(ex.lineCost)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">
            No se han seleccionado extras.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Subtotal */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight="bold">
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(
              totalCarCost + totalInsuranceCost + totalExtrasCost
            )}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Subtotal, IVA y Total */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2">Subtotal:</Typography>
          <Typography variant="body2">{subtotal}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            IVA (16%)
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(ivaCost)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            TOTAL:
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#d60812" }}>
            {formatCurrency(totalWithIva)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Campo para ingresar código de cupón */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Ingresa código de cupón:
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Código de descuento"
            sx={{
              width: "100%",
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
            disabled
          />
        </Box>
      </CardContent>
    </Card>
  );
}
