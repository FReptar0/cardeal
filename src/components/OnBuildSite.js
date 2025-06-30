import React from "react";
import Link from "next/link";
import { Box, Typography, Button, useTheme } from "@mui/material";

export default function SitioEnConstruccion() {
    const theme = useTheme();

    return (
        <Box
            minHeight="100vh"
            bgcolor="common.white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={2}
        >
            {/* Animación MP4 */}
            <Box width={200} height={200} mb={4}>
                <video
                    src="/icons/alerta.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </Box>

            <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                Sitio en Construcción
            </Typography>

            <Typography variant="body1" color="text.secondary" maxWidth={400} mb={6}>
                Estamos preparando grandes mejoras para nuestros convenios
                empresariales. Vuelve pronto para descubrir todas las ventajas y
                beneficios.
            </Typography>

            <Link href="/" passHref legacyBehavior>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: (theme) => theme.palette.primary.buttons,
                        "&:hover": {
                            backgroundColor: (theme) => theme.palette.primary.buttonsHover,
                        },
                    }}
                >
                    Volver al inicio
                </Button>
            </Link>
        </Box>
    );
}
