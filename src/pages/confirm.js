import { Box, Card, CardContent, Typography, Button, Divider, Chip, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Head from "next/head";
import RentalStepper from "../components/Stepper";

const OrderConfirmation = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        QRCode.toDataURL("https://www.miempresa.com/pedido/000001")
            .then((url) => setQrCodeUrl(url))
            .catch((err) => console.error(err));
    }, []);

    const dailyRate = 450;
    const rentalDays = 4;
    const babySeats = 2;
    const babySeatPrice = 50;
    const wifiPrice = 150;
    const extraDriverPrice = 200;

    const total = (dailyRate * rentalDays) + (babySeats * babySeatPrice * rentalDays) + (wifiPrice * rentalDays) + extraDriverPrice;

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
                    marginTop: -10
                }}>

                    {/* Resumen del pedido */}
                    <Box sx={{ width: { xs: "100%", md: "40%" }, display: "flex", justifyContent: "center" }}>
                        <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Número de renta #637491
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                    <img src="/cars/camry.png" alt="Toyota Camry 2025" style={{ width: "100%", maxWidth: 300, borderRadius: 8 }} />
                                    <Box sx={{ ml: 2, textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                        <Typography variant="body1" sx={{ mx: 1 }}><b>Marca:</b> Toyota</Typography>
                                        <Typography variant="body1" sx={{ mx: 1 }}><b>Modelo:</b> Camry</Typography>
                                        <Typography variant="body1" sx={{ mx: 1 }}><b>Año:</b> 2025</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1"><b>Costo de la renta</b></Typography>
                                <Typography variant="body2">$450 x 4 días = $1800</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1"><b>Servicios adicionales</b></Typography>
                                <Typography variant="body2">2 Sillas para bebés ($50 c/u x 4 días) - $400</Typography>
                                <Typography variant="body2">Wi-Fi ($150 x 4 días) - $600</Typography>
                                <Typography variant="body2">Conductor adicional - $200</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" align="right">
                                    Total: <b>${total}</b>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Contenedor de información de confirmación y QR */}
                    <Box sx={{ width: { xs: "100%", md: "75%" }, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2, }}>
                        {/* Información de confirmación */}
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircleOutlineIcon color="success" />
                                Su reserva se realizó correctamente
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
                                <Chip label="Pendiente" color="warning" />
                            </Box>
                        </Box>
                        {/* QR */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "70%" }}>
                            {qrCodeUrl && (
                                <Box sx={{ width: "150px", height: "150px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: 2, overflow: "hidden" }}>
                                    <img src={qrCodeUrl} alt="Código QR" style={{ width: "100%", height: "100%" }} />
                                </Box>
                            )}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                                <Button variant="contained" color="primary" sx={{ backgroundColor: "#d60812", width: "95%", margin: "0 auto" }}>Descargar orden de pedido</Button>
                                <Box sx={{ display: "flex", gap: 0, width: "100%" }}>
                                    <Button variant="text" color="inherit" fullWidth>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Add_to_Google_Wallet_badge.svg" alt="Agregar a Cartera de Google" style={{ width: "150px" }} />
                                    </Button>
                                    <Button variant="text" color="inherit" fullWidth>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Add_to_Apple_Wallet_badge.svg" alt="Agregar a Cartera de Apple" style={{ width: "150px" }} />
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
