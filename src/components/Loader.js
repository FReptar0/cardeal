"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ message = "Cargando" }) => {
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
      <CircularProgress sx={{ color: (theme) => theme.palette.primary.buttons }} size={48} />
      <Typography
        variant="h6"
        sx={{
          color: (theme) => theme.palette.primary.buttons,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {message}
        {dots}
      </Typography>
    </Box>
  );
};

export default Loader;
