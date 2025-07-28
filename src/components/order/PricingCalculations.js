import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";

const PricingCalculations = ({
  extrasInfo,
  otherCharges,
  otherCharges2,
  paidOnline,
  formatCurrency,
  subtotal,
  subtotal2,
  ivaCost,
  ivaCost2,
  totals,
  isConfirmationPage,
  totalWithIva,
  totalExtrasCost,
}) => {
  const router = useRouter();

  return (
    <>
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

      {/* Total a pagar logic */}
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
            {formatCurrency(paidOnline ? totals?.price2 : totals?.price)}
          </Typography>
        </Box>
      )}

      {/* Dual pricing display */}
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

      {/* Savings message */}
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

      {/* Confirmation page special display */}
      {isConfirmationPage && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
    </>
  );
};

export default PricingCalculations;