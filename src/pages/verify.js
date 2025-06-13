import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Paper,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function VerifyPage() {
  const { isLoggedIn, setIsVerified } = useAuth();
  const router = useRouter();
  const { token } = router.query;

  // Estados
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1) Esperar a que Next.js tenga router.isReady y token
  useEffect(() => {
    if (!router.isReady) return;

    // Si no hay token, vamos al home
    if (!token) {
      router.replace("/");
      return;
    }
    // Si no hay sesión, pedimos login
    if (!isLoggedIn) {
      toast.error("Debes iniciar sesión para verificar tu cuenta.");
      router.replace("/login");
      return;
    }

    // 2) Hacer la petición de verificación
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: token }),
        });
        const data = await res.json();

        if (res.status !== 200) {
          throw new Error(data.message || "Error inesperado");
        }

        // Éxito
        setStatus("success");
        setMessage("Tu cuenta ha sido verificada.");

        // Actualizamos el contexto y localStorage
        localStorage.setItem("isVerified", "true");
        setIsVerified(true);
      } catch (err) {
        // Error
        setStatus("error");
        setMessage(err.message || "Hubo un error al verificar tu cuenta.");
      }
    })();
  }, [router.isReady, token, isLoggedIn, router, setIsVerified]);

  // 3) Tras mostrar mensaje de success/error, esperar 1s antes de arrancar el progreso
  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(() => setRedirecting(true), 1000);
      return () => clearTimeout(t);
    }
  }, [status]);

  // 4) Arrancar la barra de progreso y redirigir al 100 %
  useEffect(() => {
    if (!redirecting) return;
    let prog = 0;
    const iv = setInterval(() => {
      prog += 10;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(iv);
        router.replace("/perfil");
      }
    }, 200); // 200 ms × 10 = 2 s aprox.
    return () => clearInterval(iv);
  }, [redirecting, router]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          p: 4,
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        {/* Logo de Qardeal */}
        <Box
          component="img"
          src="/logos/Qardeal_logo completo verde y rojo.png"
          alt="Qardeal Logo"
          sx={{ width: "65%", maxWidth: 280, mx: "auto", mb: 2 }}
        />

        {/* Título */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          {status === "loading"
            ? "Verificando cuenta..."
            : status === "success"
            ? "✅ Verificación Exitosa"
            : "❌ Error de Verificación"}
        </Typography>

        {/* Mensaje */}
        <Typography variant="body2" color="text.secondary" mb={3}>
          {status === "loading" ? "Por favor espera un momento..." : message}
        </Typography>

        {/* Loader / Barra de progreso */}
        {status === "loading" && <CircularProgress />}
        {(status === "success" || status === "error") && (
          <>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 5, mb: 1 }}
            />
            <Typography variant="caption">
              {redirecting
                ? "Redirigiendo a tu perfil..."
                : "Te redirigiremos en breve..."}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}
