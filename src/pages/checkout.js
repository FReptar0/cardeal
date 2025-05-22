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
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

const UserForm = dynamic(() => import("@/components/UserForm"), { ssr: false });
const formatCurrency = (amount) =>
  amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function CheckoutPage() {
  const [paidOnline, setPaidOnline] = useState(false);
  const router = useRouter();
  const [openTimerDialog, setOpenTimerDialog] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
  const [showFloatingTimer, setShowFloatingTimer] = useState(false);

  const { selectedCar, selectedInsurance, selectedExtras, clearBooking } = useBooking();
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

  useEffect(() => {
    if (!openTimerDialog) {
      setShowFloatingTimer(true);
    }
  }, [openTimerDialog]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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

  // Mostrar el contador flotante siempre que el tiempo esté corriendo
  const showTimer = timeLeft > 0;

  // El contador debe seguir corriendo siempre que timeLeft > 0
  useEffect(() => {
    if (timeLeft <= 0) {
      setOpenTimerDialog(false);
      clearBooking(); // Limpiar booking context al regresar al home
      router.push("/");
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, router, clearBooking]);

  return (
    <>
      <Dialog
        open={openTimerDialog}
        onClose={() => setOpenTimerDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: 8,
            maxWidth: "650px",
            padding: 4,
            width: "90%",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pt: 0,
            pb: 2,
            px: 3,
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpenTimerDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* Regresa la imagen del escudo en el dialog */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              maxHeight: "300px",
              maxWidth: "300px",
            }}
          >
            <Box
              component="img"
              src="/bot/Bot-IA-Alpha-Escudo.webp"
              alt="Tarifa Icono"
              sx={{ height: "100%", width: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box sx={{ flex: 2, textAlign: "justify" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#d60812" }}
            >
              ¡Esta tarifa puede cambiar!
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "16px", lineHeight: 1.6, mb: 2 }}
            >
              A partir de ahora cuentas con <b>10 minutos</b> para finalizar tu
              reserva.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "16px", lineHeight: 1.6, mb: 2 }}
            >
              Tiempo restante:{" "}
              <b style={{ color: "#d60812", fontSize: 22 }}>
                {formatTime(timeLeft)}
              </b>
            </Typography>
            {/* Mostrar ahorro si aplica */}
            {totalWithIva > totalWithIva2 && (
              <Typography
                variant="body1"
                sx={{
                  color: "#10906a",
                  fontWeight: "bold",
                  fontSize: 18,
                  mb: 2,
                }}
              >
                ¡Estás ahorrando {formatCurrency(totalWithIva - totalWithIva2)}{" "}
                pagando en línea!
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#666" }}>
              Si el tiempo se agota, serás redirigido automáticamente a la
              página de inicio.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d60812",
                color: "white",
                fontWeight: "bold",
                borderRadius: 2,
                px: 4,
                py: 1,
                fontSize: 18,
                boxShadow: 2,
                ":hover": { backgroundColor: "#b1060f" },
              }}
              onClick={() => setOpenTimerDialog(false)}
            >
              Entendido
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      {showTimer && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: 120, md: 120 }, // debajo de la navbar
            right: 24,
            zIndex: 1301,
            background: "#fff",
            border: "2px solid #d60812",
            borderRadius: "32px",
            boxShadow: 4,
            px: 3,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: "bold",
            fontSize: 18,
            color: "#d60812",
            flexDirection: "column",
            minWidth: 100,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span role="img" aria-label="clock">
              ⏰
            </span>{" "}
            {formatTime(timeLeft)}
          </Box>
        </Box>
      )}
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
    </>
  );
}
