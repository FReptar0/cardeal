// pages/confirm/[id].js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Skeleton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import OrderSummaryConfirmed from "@/components/OrderSummaryConfirmed";
import ConfirmationStepper from "@/components/ConfirmationStepper";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { decryptId } from "@/utils/encryption";
import { useSearch } from "@/contexts/SearchContext";

// para el pdf
import { PDFDownloadLink } from "@react-pdf/renderer";
import ConfirmPDF from "@/components/ConfirmPDF";

export default function BookingConfirmation() {
  const router = useRouter();
  const { jwt } = useAuth();
  const { id: encryptedId } = router.query;
  const [id, setId] = useState(null);

  const { totals, discount, clearBooking } = useBooking();
  const { clearSearch } = useSearch();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [showPdfLink, setShowPdfLink] = useState(false);

  useEffect(() => {
    if (encryptedId) {
      const realId = decryptId(encryptedId);
      setId(realId);
    }
  }, [encryptedId]);

  useEffect(() => {
    clearBooking();
    clearSearch();
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Si hay JWT, buscar como usuario normal; si no, buscar como invitado
    const fetchBooking = async () => {
      let res;
      if (jwt) {
        res = await fetch(`/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
      } else {
        // Intentar obtener la reserva sin JWT (para invitados)
        res = await fetch(`/api/bookings/${id}`);
      }
      if (!res.ok) {
        router.replace("/login");
        return;
      }
      const data = await res.json();
      // Si la reserva es de invitado, permitir mostrarla; si no, redirigir si no hay JWT
      if (data.booking.isGuest === true) {
        setBooking(data.booking);
      } else if (!jwt) {
        router.replace("/login");
      } else {
        setBooking(data.booking);
      }
      setTimeout(() => setLoading(false), 2000);
    };
    fetchBooking();
  }, [id, jwt, router]);

  if (loading) {
    // Skeleton placeholders
    return (
      <Container sx={{ mt: 24, maxWidth: "100vw", px: 2 }}>
        <ConfirmationStepper />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mt: 4,
            mb: 4,
            alignItems: "center",
          }}
        >
          {/* Left skeleton */}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton height={40} sx={{ my: 2 }} />
            <Skeleton height={20} />
            <Skeleton height={20} width="60%" />
            <Skeleton height={20} sx={{ mt: 1 }} />
            <Skeleton height={20} width="80%" />
          </Box>

          {/* Right skeleton */}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="circular" width={70} height={70} />
            <Skeleton height={50} width="70%" sx={{ mt: 1 }} />
            <Skeleton height={20} width="50%" sx={{ mt: 2 }} />
            <Skeleton height={20} width="80%" sx={{ mt: 1 }} />
            <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!booking) return null;

  const { car, insurance, extras, search, contact } = booking;

  console.log("Booking data:", booking);

  const days =
    Math.ceil(
      (new Date(search.returnDate) - new Date(search.pickupDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const formatCurrency = (amt) => {
    const num = Number(amt);
    if (isNaN(num)) return "$0.00";
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  };

  const carPrice = booking.paidOnline ? car.price : car.price2;
  const subtotal = carPrice * days;

  const insuranceCost = insurance
    ? parseFloat(insurance.total.replace(/[^\d.]/g, "")) * days
    : 0;

  const extrasCost = Array.isArray(extras)
    ? extras.reduce((sum, item) => {
        const precio = Number(item.precio?.$numberInt ?? item.precio);
        return sum + precio * Number(item.cantidad) * days;
      }, 0)
    : 0;

  console.log("carPrice", subtotal, "extras", extrasCost);

  const otherCharges = (subtotal + extrasCost + insuranceCost) * 0.23;

  const subTotal = subtotal + extrasCost + insuranceCost + otherCharges;
  const iva = subTotal * 0.16;
  const total = subTotal + iva;
  const totalWithDiscount =
    booking.discount > 0 ? total - booking.discount : total; // Aplicar el descuento si es mayor a 0

  //const totalLabel = booking.paid ? "Total" : "Total a pagar"; // Cambiar el texto si el pago está completado

  let mensaje = "";
  let lowerMessage = "";
  let wasSuccessful;

  if (booking.paidOnline && !booking.paid && booking.status === "FAILED") {
    mensaje = "Reserva no realizada.";
    lowerMessage = "Por favor, verfica el metodo de pago e inténtalo de nuevo.";
    wasSuccessful = false;
  } else if (booking.paidOnline && booking.paid && booking.status === "PAID") {
    mensaje = "Reserva realizada con éxito";
    lowerMessage = "Gracias por elegir nuestro servicio.";
    wasSuccessful = true;
  } else {
    mensaje = "Reserva realizada con éxito";
    lowerMessage = "Gracias por elegir nuestro servicio.";
    wasSuccessful = true;
  }

  return (
    <Container sx={{ mt: 10, maxWidth: "100vw", px: 2 }}>
      <ConfirmationStepper />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "85vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          gap: 4,
          mt: { xs: 4, md: -8 },
          mb: -1,
        }}
      >
        {/* Resumen del pedido */}
        <Box
          sx={{
            flex: 1,
            maxHeight: { xs: "800", md: 500, lg: 435 },
            overflow: "hidden",
          }}
          id="imhere"
        >
          <Card
            sx={{
              backgroundColor: "white",
              p: 0,
              width: "100%",
              maxHeight: 4500, // altura máxima del card
              display: "flex",
              flexDirection: "column", // evita scroll exterior
            }}
          >
            <CardContent
              sx={{
                maxHeight: { xs: "800", md: 500, lg: 435 },
                overflowY: { xs: "visible", md: "auto" },
                pr: { xs: 0, md: 1 },
                "&:hover": {
                  overscrollBehavior: "contain",
                },
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: 4,
                },
                padding: 0,
                paddingBottom: "0 !important",
              }}
            >
              <OrderSummaryConfirmed
                selectedCar={car}
                pickupDateString={new Date(
                  search.pickupDate
                ).toLocaleDateString("es-MX")}
                returnDateString={new Date(
                  search.returnDate
                ).toLocaleDateString("es-MX")}
                rentalDays={days}
                dailyCarCost={carPrice}
                totalCarCost={carPrice * days}
                selectedInsurance={insurance}
                totalInsuranceCost={insuranceCost}
                extrasInfo={extras}
                ivaCost={iva}
                otherCharges={otherCharges}
                totalWithIva={totalWithDiscount}
                formatCurrency={formatCurrency}
                subtotal={subTotal}
                discount={booking.discount}
                paidOnline={booking.paidOnline}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Contenedor de información de confirmación y QR */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "column" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: { xs: 8, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {wasSuccessful ? (
                  <CheckCircleOutlineIcon
                    color="success"
                    sx={{ fontSize: 60 }}
                  />
                ) : (
                  <HighlightOffIcon color="error" sx={{ fontSize: 60 }} />
                )}
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: "1.8rem" }}
                    fontWeight="bold"
                  >
                    {mensaje || "Reserva confirmada"}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {lowerMessage || "¡Gracias por elegirnos!"}
                  </Typography>
                </Box>
              </Box>

              <Box display="grid" gap={1}>
                <Typography variant="subtitle1">
                  <b style={{ color: "#666" }}>Número de confirmación:</b> #
                  {booking.tsdConfirmNum ? booking.tsdConfirmNum : "N/A"}
                </Typography>
                <Typography variant="body1">
                  <b style={{ color: "#666" }}>Nombre completo:</b>{" "}
                  {contact.fullName}
                </Typography>
                <Typography variant="body1">
                  <b style={{ color: "#666" }}>Teléfono:</b> {contact.phone}
                </Typography>
                <Typography variant="body1">
                  <b style={{ color: "#666" }}>Correo electrónico:</b>{" "}
                  {contact.email}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1">
                    <b style={{ color: "#666" }}>Método de pago:</b>
                  </Typography>
                  {booking.paidOnline ? (
                    <Chip
                      label="Pago en línea"
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.text,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  ) : (
                    <Chip label="Pago en mostrador" color="warning" />
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" component="span">
                    <b style={{ color: "#666" }}>Estado de pago:</b>
                  </Typography>
                  <Chip
                    label={
                      booking.paid
                        ? "Pagado"
                        : booking.status === "FAILED"
                        ? "Pago no exitoso"
                        : "Pendiente"
                    }
                    color={
                      booking.paid
                        ? "success"
                        : booking.status === "FAILED"
                        ? "error"
                        : "warning"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            mt={3}
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {showPdfLink ? (
              <PDFDownloadLink
                key={booking.orderNumber}
                document={<ConfirmPDF booking={booking} />}
                fileName={`reserva_${booking.orderNumber}.pdf`}
                style={{ textDecoration: "none", width: "100%" }}
              >
                {({ loading }) => (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.text,
                      height: 48,
                      ":hover": { backgroundColor: "#0b704e" },
                    }}
                  >
                    {loading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        GENERANDO PDF…
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      </Box>
                    ) : (
                      "DESCARGAR PDF DE RESERVA"
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setShowPdfLink(true)}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.text,
                  height: 48,
                  ":hover": { backgroundColor: "#0b704e" },
                }}
              >
                Generar PDF de Reserva
              </Button>
            )}

            {/* <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={() => setOpenInvoiceModal(true)}
              sx={{
                backgroundColor: (theme) => theme.palette.primary.text,
                height: 48,
                ":hover": { backgroundColor: "#0b704e" },
              }}
            >
              Facturar
            </Button> */}

            <Dialog
              open={openInvoiceModal}
              onClose={() => setOpenInvoiceModal(false)}
              PaperProps={{
                sx: {
                  borderRadius: "4px",
                  boxShadow: 8,
                  maxWidth: "480px",
                  width: "90%",
                },
              }}
            >
              <Box>
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  INFORMACIÓN DE FACTURA
                </DialogTitle>
              </Box>

              <DialogContent sx={{ textAlign: "center", px: 3, pb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1rem", lineHeight: 1.6 }}
                >
                  Agradecemos tu preferencia, para realizar la factura de tu
                  renta solicítala en mostrador con tus datos fiscales.
                  <Box sx={{ fontWeight: "bold", mt: 2 }}>
                    ¡Gracias por tu preferencia!
                  </Box>
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button
                    onClick={() => setOpenInvoiceModal(false)}
                    variant="contained"
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.buttons,
                      color: "white",
                      fontWeight: "bold",
                      px: 4,
                      padding: "12px 20px",
                    }}
                  >
                    ENTENDIDO
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
