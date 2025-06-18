import React from "react";
import { Box } from "@mui/material";

export default function SolucionesEmpresariales() {
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                minHeight: "100vh",
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
                m: 0,
            }}
        >
            <Box
                sx={{
                    width: { xs: "100vw", md: "100vw" },
                    height: { xs: "56vw", md: "100vh" },
                    maxWidth: "100vw",
                    maxHeight: "100vh",
                    backgroundColor: "black",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: { xs: 0, sm: 2 },
                    boxShadow: 4,
                }}
            >
                <video
                    src="/videos/VideoComercialQardeal.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    preload="none"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </Box>
        </Box>
    );
}