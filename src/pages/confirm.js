import { Box, Card, CardContent, Typography, Button, Divider, Chip, Container, Tooltip, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import InfoIcon from "@mui/icons-material/Info";
import Head from "next/head";
import RentalStepper from "../components/Stepper";
import cars from "../data/cars.json";

const car = cars[0]; // Usar el primer registro del JSON

const dailyRate = car.price;
const rentalDays = 4;
const babySeats = 2;
const babySeatPrice = 50;
const wifiPrice = 150;
const extraDriverPrice = 200;

const total = (dailyRate * rentalDays) + (babySeats * babySeatPrice * rentalDays) + (wifiPrice * rentalDays) + extraDriverPrice;

const formatCurrency = (amount) => {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const OrderConfirmation = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        QRCode.toDataURL("https://www.miempresa.com/pedido/000001")
            .then((url) => setQrCodeUrl(url))
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <Container sx={{ marginTop: 10, maxWidth: "100vw", paddingX: 2 }}>
                <RentalStepper />

                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "85vh",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "left",
                    gap: 4,
                    marginTop: -4
                }}>

                    {/* Resumen del pedido */}
                    <Box sx={{ width: { xs: "100%", md: "35%" }, display: "flex", justifyContent: "center" }}>
                        <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                                    Número de renta #637491
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                    <img src={car.image} alt={car.name} style={{ width: "100%", maxWidth: 300, borderRadius: 8 }} />
                                    <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" sx={{ mx: 1 }}>{car.abbreviationMeaning}</Typography>
                                            <Tooltip title={car.abbreviationDescription} arrow>
                                                <IconButton sx={{ color: "gray", fontSize: 20 }}>
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mx: 1 }}>{car.name}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />

                                {/* Costo de la renta */}
                                <Typography variant="subtitle1"><b>Costo de la renta</b></Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                    <Typography variant="body2">Tarifa diaria ({rentalDays} días)</Typography>
                                    <Typography variant="body2"><b>{formatCurrency(dailyRate * rentalDays)} MXN</b></Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Servicios adicionales */}
                                <Typography variant="subtitle1"><b>Servicios adicionales</b></Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                    <Typography variant="body2">{babySeats} Sillas para bebés ({formatCurrency(babySeatPrice)} c/u)</Typography>
                                    <Typography variant="body2"><b>{formatCurrency(babySeats * babySeatPrice * rentalDays)} MXN</b></Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                    <Typography variant="body2">Wi-Fi ({formatCurrency(wifiPrice)} x {rentalDays} días)</Typography>
                                    <Typography variant="body2"><b>{formatCurrency(wifiPrice * rentalDays)} MXN</b></Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                                    <Typography variant="body2">Conductor adicional</Typography>
                                    <Typography variant="body2"><b>{formatCurrency(extraDriverPrice)} MXN</b></Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Total */}
                                <Typography variant="h6" align="right">
                                    Total: <b>{formatCurrency(total)} MXN</b>
                                </Typography>
                            </CardContent>
                        </Card>

                    </Box>

                    {/* Contenedor de información de confirmación y QR */}
                    <Box sx={{ width: { xs: "100%", md: "65%" }, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "center", gap: 2 }}>
                        {/* Información de confirmación */}
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 50 }} />
                                <Typography variant="h5">
                                    <b>Su reserva se realizó correctamente</b>
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary"
                                sx={{
                                    fontSize: "1.2rem"
                                }}>
                                <b>Gracias por elegir nuestro servicio.</b>
                            </Typography>
                            <Typography variant="h5">Número de confirmación #637491</Typography>
                            <Typography variant="body1"><b>Nombre completo:</b> Manuel Jesús Contreras Pérez</Typography>
                            <Typography variant="body1"><b>Teléfono:</b> 738-937-9364</Typography>
                            <Typography variant="body1"><b>Correo electrónico:</b> manueljesus@test.com</Typography>
                            <Typography variant="body1"><b>Método de pago:</b> Pago electrónico</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body1" component="span">
                                    <b>Estado de pago:</b>
                                </Typography>
                                <Chip label="Pago en mostrador" color="warning" />
                            </Box>
                        </Box>
                        {/* QR */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: { xs: "100%", md: "30%" } }}>
                            {qrCodeUrl && (
                                <Box sx={{ width: "180px", height: "180px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: 2, overflow: "hidden" }}>
                                    <img src={qrCodeUrl} alt="Código QR" style={{ width: "100%", height: "100%" }} />
                                </Box>
                            )}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                                <Button variant="contained" color="primary" sx={{ backgroundColor: "#d60812", width: "95%", margin: "0 auto" }}>Descargar detalles de la reserva</Button>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                                    <Button variant="text" color="inherit" fullWidth>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Add_to_Google_Wallet_badge.svg" alt="Agregar a Cartera de Google" style={{ width: "200px" }} />
                                    </Button>
                                    <Button variant="text" color="inherit" fullWidth>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Add_to_Apple_Wallet_badge.svg" alt="Agregar a Cartera de Apple" style={{ width: "200px" }} />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default OrderConfirmation;
