// pages/payment/retry/[id].js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import OrderSummaryConfirmed from "@/components/OrderSummaryConfirmed";
import PaymentIcon from "@mui/icons-material/Payment";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function PaymentRetryPage() {
  const router = useRouter();
  const { id: encryptedId } = router.query;
  const { jwt } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [retryData, setRetryData] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (encryptedId) {
      fetchRetryData();
    }
  }, [encryptedId]);

  const fetchRetryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/payment/retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt && { Authorization: `Bearer ${jwt}` }),
        },
        body: JSON.stringify({ encryptedBookingId: encryptedId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar datos de reintento");
      }

      setRetryData(data);
    } catch (err) {
      console.error("Error fetching retry data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!retryData?.payment) return;
    
    setProcessing(true);
    
    try {
      // Create a form and submit it to the payment gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = retryData.payment.action;
      form.style.display = "none";

      // Add all payment fields as hidden inputs
      Object.entries(retryData.payment.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Error submitting payment:", err);
      setError("Error al procesar el pago");
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando información de pago...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Card>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchRetryData}
              >
                Reintentar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!retryData) return null;

  const { booking } = retryData;
  const days = Math.ceil(
    (new Date(booking.search.returnDate) - new Date(booking.search.pickupDate)) /
      (1000 * 60 * 60 * 24)
  ) || 1;

  return (
    <Container sx={{ mt: 10, maxWidth: "lg" }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <PaymentIcon color="warning" />
            <Typography variant="h5" component="h1">
              Reintentar Pago
            </Typography>
            <Chip 
              label={`Intento #${booking.retryAttempt}`} 
              color="warning" 
              variant="outlined" 
            />
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Tu reserva anterior no pudo ser procesada. Puedes reintentar el pago ahora 
              o elegir pagar directamente en mostrador.
            </Typography>
          </Alert>

          <Typography variant="body1" color="text.secondary">
            <strong>Reserva:</strong> {booking.id}<br />
            <strong>Vehículo:</strong> {booking.car?.name}<br />
            <strong>Total a pagar:</strong> {formatCurrency(booking.total)}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        {/* Order Summary */}
        <Box sx={{ flex: 1 }}>
          <OrderSummaryConfirmed
            selectedCar={booking.car}
            pickupDateString={new Date(booking.search.pickupDate).toLocaleDateString("es-MX")}
            returnDateString={new Date(booking.search.returnDate).toLocaleDateString("es-MX")}
            rentalDays={days}
            dailyCarCost={booking.car?.price || 0}
            totalCarCost={(booking.car?.price || 0) * days}
            selectedInsurance={booking.insurance}
            totalInsuranceCost={booking.insurance ? parseFloat(booking.insurance.total.replace(/[^\\d.]/g, "")) * days : 0}
            extrasInfo={booking.extras || []}
            ivaCost={booking.total * 0.16}
            otherCharges={(booking.total / 1.16) * 0.23}
            totalWithIva={booking.total}
            formatCurrency={formatCurrency}
            subtotal={booking.total / 1.16}
            discount={0}
            paidOnline={true}
          />
        </Box>

        {/* Payment Actions */}
        <Box sx={{ flex: 1, maxWidth: { md: 400 } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Opciones de Pago
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Online Payment Option */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Pagar en Línea
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Completa tu pago ahora y confirma tu reserva inmediatamente.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />}
                  onClick={handleRetryPayment}
                  disabled={processing}
                  sx={{ mb: 2 }}
                >
                  {processing ? "Procesando..." : `Pagar ${formatCurrency(booking.total)}`}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Counter Payment Option */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Pagar en Mostrador
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  También puedes pagar directamente al recoger tu vehículo.
                </Typography>
                <Link href="/" passHref>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                  >
                    Cambiar a Pago en Mostrador
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                ¿Necesitas Ayuda?
              </Typography>
              <Typography variant="body2" paragraph>
                Si continúas teniendo problemas con el pago, puedes contactar a nuestro equipo de soporte.
              </Typography>
              <Link href="/atencion-cliente" passHref>
                <Button variant="text" size="small">
                  Contactar Soporte
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}