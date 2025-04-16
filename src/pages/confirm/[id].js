// pages/confirm/[id].js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip,
    Button,
    Tooltip,
    IconButton,
    Skeleton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
import QRCode from "qrcode";
import RentalStepper from "@/components/Stepper";
import { useAuth } from "@/contexts/AuthContext";

const extrasDefinitions = {
    conductor_adicional: { precio: 110, nombre: "Conductor Adicional" },
    conductor_menor: { precio: 110, nombre: "Conductor Menor" },
    baby_seat: { precio: 150, nombre: "Baby Seat" },
    child_seat: { precio: 150, nombre: "Child Seat" },
    booster: { precio: 150, nombre: "Booster" },
};

export default function BookingConfirmation() {
    const router = useRouter();
    const { jwt } = useAuth();
    const { id } = router.query;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        if (!id || !jwt) return;

        const fetchBooking = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });

                if (!res.ok) throw new Error("No autorizado");

                const data = await res.json();

                // Verificar si el userId del booking coincide con el userId del jwt
                if (data.booking.userId !== jwt.userId) {
                    throw new Error("Usuario no autorizado");
                }

                setBooking(data.booking);
            } catch (error) {
                router.replace("/");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, jwt, router]);

    useEffect(() => {
        if (!booking) return;
        QRCode.toDataURL(window.location.href).then(setQrCodeUrl).catch(console.error);
    }, [booking]);

    if (loading) {
        // Skeleton placeholders
        return (
            <Container sx={{ mt: 24, maxWidth: "100vw", px: 2 }}>
                <RentalStepper />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                        mt: -4,
                    }}
                >
                    {/* Left skeleton */}
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="rectangular" height={300} />
                        <Skeleton height={40} sx={{ my: 2 }} />
                        <Skeleton height={20} />
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={20} sx={{ mt: 1 }} />
                        <Skeleton height={20} width="80%" />
                    </Box>

                    {/* Right skeleton */}
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="circular" width={50} height={50} />
                        <Skeleton height={40} width="70%" sx={{ mt: 1 }} />
                        <Skeleton height={20} width="50%" sx={{ mt: 2 }} />
                        <Skeleton height={20} width="80%" sx={{ mt: 1 }} />
                        <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
                    </Box>
                </Box>
            </Container>
        );
    }

    if (!booking) return null;

    const { car, insurance, extras, search, contact, createdAt } = booking;
    const days =
        Math.ceil(
            (new Date(search.returnDate) - new Date(search.pickupDate)) /
            (1000 * 60 * 60 * 24)
        ) || 1;

    const formatCurrency = (amt) =>
        amt.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

    const subtotal = car.price * days;
    const insuranceCost = insurance
        ? parseFloat(insurance.total.replace(/[^\d.]/g, "")) * days
        : 0;
    const extrasCost = Object.entries(extras).reduce((sum, [key, qty]) => {
        return sum + (extrasDefinitions[key]?.precio || 0) * qty * days;
    }, 0);
    const iva = (subtotal + insuranceCost + extrasCost) * 0.16;
    const total = subtotal + insuranceCost + extrasCost + iva;

    return (
        <Container sx={{ mt: 10, maxWidth: "100vw", px: 2 }}>
            <RentalStepper />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "85vh",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "left",
                    gap: 4,
                    mt: -4,
                }}
            >
                {/* Resumen del pedido */}
                <Box sx={{ flex: 1 }}>
                    <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom>
                                Resumen de la renta
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
                                />
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography variant="body1" sx={{ mx: 1 }}>
                                            {car.abbreviationMeaning}
                                        </Typography>
                                        <Tooltip title={car.abbreviationDescription} arrow>
                                            <IconButton sx={{ color: "gray", fontSize: 20 }}>
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {car.name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1">
                                <b>Tarifa base</b>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                <Typography variant="body2">Precio por {days} días</Typography>
                                <Typography variant="body2">
                                    <b>{formatCurrency(subtotal)}</b>
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                <Typography variant="subtitle1">
                                    <b>Subtotal</b>
                                </Typography>
                                <Typography variant="subtitle1">
                                    <b>{formatCurrency(subtotal)}</b>
                                </Typography>
                            </Box>

                            <Typography variant="subtitle1">
                                <b>IVA y Cargos adicionales</b>
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                <Typography variant="body2">IVA Local</Typography>
                                <Typography variant="body2">
                                    <b>{formatCurrency(iva)}</b>
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" align="right">
                                Total: <b>{formatCurrency(total)}</b>
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Contenedor de información de confirmación y QR */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 50 }} />
                            <Typography variant="h5">
                                <b>Su reserva se realizó correctamente</b>
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.2rem" }}>
                            <b>Gracias por elegir nuestro servicio.</b>
                        </Typography>
                        <Typography variant="h5">Número de confirmación #{booking.orderNumber}</Typography>
                        <Typography variant="body1">
                            <b>Nombre completo:</b> {contact.fullName}
                        </Typography>
                        <Typography variant="body1">
                            <b>Teléfono:</b> {contact.phone}
                        </Typography>
                        <Typography variant="body1">
                            <b>Correo electrónico:</b> {contact.email}
                        </Typography>
                        <Typography variant="body1">
                            <b>Método de pago:</b> Pago en mostrador
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body1" component="span">
                                <b>Estado de pago:</b>
                            </Typography>
                            <Chip label="Pago en mostrador" color="warning" />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: { xs: "100%", md: "30%" },
                        }}
                    >
                        {qrCodeUrl && (
                            <Box
                                sx={{
                                    width: 180,
                                    height: 180,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                }}
                            >
                                <img src={qrCodeUrl} alt="Código QR" style={{ width: "100%", height: "100%" }} />
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: "#d60812", width: "95%", mt: 1 }}
                        >
                            Descargar detalles de la reserva
                        </Button>
                        <Button variant="text" fullWidth>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Add_to_Google_Wallet_badge.svg"
                                alt="Agregar a Google Wallet"
                                style={{ width: 200 }}
                            />
                        </Button>
                        <Button variant="text" fullWidth>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/30/Add_to_Apple_Wallet_badge.svg"
                                alt="Agregar a Apple Wallet"
                                style={{ width: 200 }}
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
