"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const ExtrasLoader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 200); // Misma velocidad de animación
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "20vh",
        width: "100%",
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: "#d60812" }} size={48} />
      <Typography
        variant="h6"
        sx={{ color: "#d60812", fontWeight: "bold", textAlign: "center" }}
      >
        Cargando extras disponibles{dots}
      </Typography>
    </Box>
  );
};

export default ExtrasLoader;
