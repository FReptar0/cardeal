// /components/OrderSummary.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useBooking } from "../contexts/BookingContext";
import Places from "@/components/Places";

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
  const { setDiscount } = useBooking(); // Importar el descuento del contexto

  const handleApplyCoupon = () => {
    if (appliedCoupon === "00001") {
      setCouponError(false);
      setDiscount(totalCarCost * 0.1); // Guardar el descuento en el contexto
      setDiscountApplied(true);
      setAppliedCoupon(""); // Limpiar el input
    } else {
      setCouponError(true);
      setAppliedCoupon(""); // Limpiar el input incluso si hay error
    }
  };

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

            {/* Places Component */}
            <Places
              pickupDisplay={pickupDisplay}
              returnDisplay={returnDisplay}
              sx={{
                display: "flex",
                justifyContent: "space-between", // Ensure both sides are balanced
                alignItems: "center",
                width: "100%", // Match the width of the OrderSummary
                margin: "0 auto", // Center the component
              }}
            />

            {/* Rental Dates */}
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
                {paidOnline
                  ? `${formatCurrency(dailyCarCost2)} /día (precio en línea)`
                  : `${formatCurrency(dailyCarCost)} /día (precio mostrador)`}
              </Typography>
              {/* Car price with strikethrough-above design when paying online and prices differ */}
              {paidOnline && totalCarCost !== totalCarCost2 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "#bdbdbd",
                      fontWeight: 500,
                      fontSize: 16,
                      mb: 0.5,
                    }}
                  >
                    {formatCurrency(totalCarCost)}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                      color: (theme) => theme.palette.primary.text,
                      fontSize: 18,
                    }}
                  >
                    {formatCurrency(totalCarCost2)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={
                    paidOnline
                      ? { color: (theme) => theme.palette.primary.text }
                      : {}
                  }
                >
                  {formatCurrency(paidOnline ? totalCarCost2 : totalCarCost)}
                </Typography>
              )}
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

        {/* Otros cargos */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Otros Cargos:
          </Typography>
          {paidOnline && otherCharges !== otherCharges2 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "#bdbdbd",
                  fontWeight: 500,
                  fontSize: 16,
                  mb: 0.5,
                }}
              >
                {formatCurrency(otherCharges)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: (theme) => theme.palette.primary.text,
                  fontSize: 18,
                }}
              >
                {formatCurrency(otherCharges2)}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: paidOnline
                  ? (theme) => theme.palette.primary.text
                  : undefined,
              }}
            >
              {formatCurrency(paidOnline ? otherCharges2 : otherCharges)}
            </Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1 }}
          color="textSecondary"
        >
          * Este cargo incluye costos administrativos y operativos adicionales.
          Consulta más detalles en los{" "}
          <a
            href="/terminos-y-condiciones"
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            Términos y Condiciones
          </a>
          .
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Subtotal */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight="bold">
            Subtotal
          </Typography>
          {paidOnline && subtotal !== subtotal2 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "#bdbdbd",
                  fontWeight: 500,
                  fontSize: 16,
                  mb: 0.5,
                }}
              >
                {formatCurrency(subtotal)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: (theme) => theme.palette.primary.text,
                  fontSize: 18,
                }}
              >
                {formatCurrency(subtotal2)}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={
                paidOnline
                  ? { color: (theme) => theme.palette.primary.text }
                  : {}
              }
            >
              {formatCurrency(paidOnline ? subtotal2 : subtotal)}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* IVA y Total */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            IVA (16%)
          </Typography>
          {paidOnline && ivaCost !== ivaCost2 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "#bdbdbd",
                  fontWeight: 500,
                  fontSize: 16,
                  mb: 0.5,
                }}
              >
                {formatCurrency(ivaCost)}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: (theme) => theme.palette.primary.text,
                  fontSize: 18,
                }}
              >
                {formatCurrency(ivaCost2)}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: paidOnline
                  ? (theme) => theme.palette.primary.text
                  : undefined,
              }}
            >
              {formatCurrency(paidOnline ? ivaCost2 : ivaCost)}
            </Typography>
          )}
        </Box>
        {/* Elimina la línea superior de Total a pagar cuando está activo el pago en línea y hay dos precios */}
        {!(totals && totals.price && totals.price2 && paidOnline) && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Total a pagar:
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: paidOnline
                  ? (theme) => theme.palette.primary.text
                  : undefined,
              }}
            >
              {formatCurrency(paidOnline ? totals.price2 : totals.price)}
            </Typography>
          </Box>
        )}
        {/* Mostrar el precio dependiendo de si hay uno o dos valores */}
        {totals && totals.price && totals.price2 && paidOnline ? (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Total a pagar:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "#bdbdbd",
                  fontWeight: 500,
                  fontSize: 18,
                  mb: 0.5,
                }}
              >
                {formatCurrency(totals.price)}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: (theme) => theme.palette.primary.text,
                  fontSize: 22,
                }}
              >
                {formatCurrency(totals.price2)}
              </Typography>
            </Box>
          </Box>
        ) : null}

        {/* Mensaje de ahorro para pago en línea en una sola línea */}
        {paidOnline &&
          totals &&
          totals.price &&
          totals.price2 &&
          totals.price > totals.price2 && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primary.text,
                  fontWeight: "bold",
                  fontSize: { xs: 18, md: 22 },
                  textAlign: "center",
                }}
              >
                ¡USTED ESTÁ AHORRANDO{" "}
                {formatCurrency(totals.price - totals.price2)}!
              </Typography>
            </Box>
          )}

        {/* Descuento */}
        {discountApplied && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <b>Descuento aplicado:</b>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">10% de descuento</Typography>
              <Typography variant="body2" fontWeight="bold">
                -{formatCurrency(totalCarCost * 0.1)}
              </Typography>
            </Box>
          </>
        )}

        {/* Descuento */}
        {discount > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
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

        <Divider sx={{ my: 2 }} />

        {/* Campo para ingresar código de cupón */}
        {router.pathname !== "/confirm/[id]" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Ingresa código de cupón:
            </Typography>

            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Código de descuento"
                sx={{
                  flex: 0.85, // Relación 85% del ancho
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
                value={appliedCoupon}
                onChange={(e) => setAppliedCoupon(e.target.value)}
                error={couponError}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  flex: 0.15, // Relación 15% del ancho
                  height: "40px", // Asegurar que el grosor sea consistente
                  backgroundColor: (theme) => theme.palette.primary.buttons,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 1,
                }}
                onClick={handleApplyCoupon}
              >
                APLICAR
              </Button>
            </Box>
            {couponError && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: "left", width: "100%" }}
              >
                Código de cupón no válido
              </Typography>
            )}
          </Box>
        )}

        {/* Mostrar la sección de totales adaptada para la página de confirmación */}
        {isConfirmationPage && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between" }}
            ></Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight="bold">
                Total a pagar:
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: (theme) => theme.palette.primary.text }}
                fontWeight="bold"
              >
                {formatCurrency(
                  totalWithIva + (totalCarCost + totalExtrasCost) * 0.23
                )}
              </Typography>
            </Box>
          </Box>
        )}
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
