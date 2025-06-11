import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: token }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error inesperado");

        setStatus("success");
        setMessage("Tu cuenta ha sido verificada.");

        // // Redireccionar después de 3 segundos
        // setTimeout(() => {
        //   router.push("/perfil");
        // }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.message || "Hubo un error al verificar tu cuenta."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      {/* Logo empresarial */}
      <Box
        component="img"
        src="/logos/Qardeal_logo completo verde y rojo.png"
        alt="Qardeal Logo"
        sx={{ width: { xs: "70%", sm: "320px" }, mb: 4 }}
      />

      {/* Loader o contenido */}
      {status === "loading" ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {status === "success" ? "✅ Verificación Exitosa" : "❌ Error de Verificación"}
          </Typography>
          <Typography variant="body1" mb={1}>
            {message}
          </Typography>
          {status === "success" && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              En breve serás redireccionado a tu perfil...
            </Typography>
          )}
          {status === "error" && (
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
