import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Custom404() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Ocupa toda la altura de la pantalla
        textAlign: "center",
        p: 2,
      }}
    >
      {/* Imagen más pequeña */}
      <img
        src="/icons/404.jpg"
        alt="404"
        style={{
          maxWidth: "550px", // Ajusta este valor para hacerla más grande o más pequeña
          height: "auto",
          marginBottom: "24px",
        }}
      />

      {/* Solo "ERROR:" en negritas */}
      <Typography variant="h5" gutterBottom>
        <strong>La página solicitada no existe.</strong> Haz click en el botón
        para volver al inicio.
      </Typography>

      <Link href="/" passHref legacyBehavior>
        <Button variant="contained" color="primary">
          Volver a Inicio
        </Button>
      </Link>
    </Box>
  );
}
