"use client";

import { Box, Card, CardContent, Typography, Button, Divider, Chip, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import Head from "next/head";

const OrderConfirmation = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        QRCode.toDataURL("https://www.miempresa.com/pedido/000001")
            .then((url) => setQrCodeUrl(url))
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <Head>
                <title>Confirmación de Pedido</title>
            </Head>
            <Container sx={{ marginTop: 4, maxWidth: "100vw", paddingX: 2 }}>
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "85vh", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    textAlign: "center",
                    gap: 4
                }}>
                    {/* Resumen del pedido */}
                    <Box sx={{ width: { xs: "100%", md: "50%" }, display: "flex", justifyContent: "center" }}>
                        <Card sx={{ backgroundColor: "#f5f5f5", p: 2, width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Número de Pedido #000001
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1"><b>Categoría del automóvil rentado:</b> Sedán</Typography>
                                <Typography variant="body1"><b>Precio:</b> $68</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1">Servicios adicionales</Typography>
                                <Typography variant="body2">Servicio Wi-Fi - $68</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" align="right">
                                    Total: <b>$136</b>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    
                    {/* Información de confirmación y QR */}
                    <Box sx={{ width: { xs: "100%", md: "50%" }, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleOutlineIcon color="success" />
                            Su reserva se realizó correctamente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Escanee el código QR para más detalles
                        </Typography>
                        {qrCodeUrl && <img src={qrCodeUrl} alt="Código QR" />}
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default OrderConfirmation;
