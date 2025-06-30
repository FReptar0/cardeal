import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

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
      <Image
        src="/icons/404.jpg"
        alt="404"
        width={550}
        height={350}
        style={{
          maxWidth: "550px",
          width: "100%",
          height: "auto",
          marginBottom: "24px",
          objectFit: "contain",
        }}
        priority
      />

      {/* Solo "ERROR:" en negritas */}
      <Typography variant="h5" gutterBottom>
        <strong>La página solicitada no existe.</strong> Haz click en el botón
        para volver al inicio.
      </Typography>

      <Link href="/" passHref legacyBehavior>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#10906a", // Verde del proyecto
            "&:hover": { backgroundColor: "#0B5D3C" },
            color: "#fff",
          }}
        >
          Volver a Inicio
        </Button>
      </Link>
    </Box>
  );
}
