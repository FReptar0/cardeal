// src/components/CTA.jsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function CTA() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    router.push("/");
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100%", // ocupa todo el ancho
        background: "linear-gradient(135deg, #10906A 0%, #43AD8B 100%)",
        color: "#fff",
        textAlign: "center",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        // patrón de fondo sutil (opcional)
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "url('/patterns/wave.svg') center bottom / cover no-repeat",
          opacity: 0.05,
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        component="h2"
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 2,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        ¡Renta el auto de tus sueños ahora!
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 4,
          maxWidth: 720,
          mx: "auto",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Explora nuestra flota premium, reserva en segundos y disfruta de una
        experiencia de viaje sin complicaciones.
      </Typography>

      <Button
        onClick={handleClick}
        startIcon={<DriveEtaIcon />}
        endIcon={<ArrowForwardIosIcon />}
        variant="contained"
        sx={{
          backgroundColor: "#fff",
          color: theme => theme.palette.primary.buttons,
          px: { xs: 4, md: 6 },
          py: { xs: 1.5, md: 2 },
          fontSize: { xs: "0.9rem", md: "1.1rem" },
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 2,
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#F2F2F2",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          },
        }}
      >
        Rentar Ahora
      </Button>
    </Box>
  );
}
