import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const LoginPage = () => {
  // Por defecto, se muestra login (true)
  const [isLoginActive, setIsLoginActive] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const imageUrl = isLoginActive
    ? "/photos/compacto/Versa-detalle-calavera-izq.webp"
    : "/photos/full-size/Sentra-calavera.webp";

  const handleToggle = () => {
    setIsLoginActive(!isLoginActive);
  };

  const renderLoginForm = () => (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Box
        component="img"
        src="/logos/Qardeal_logo completo verde y rojo.png"
        alt="Qardeal logo"
        sx={{
          display: "block",
          margin: "0 auto",
          maxWidth: "400px",
          mb: -5,
        }}
      />
      <Typography variant="subtitle1" textAlign="center" mb={4}>
        Inicia sesión para continuar
      </Typography>

      <TextField fullWidth label="Correo electrónico" margin="normal" />
      <TextField fullWidth label="Contraseña" type="password" margin="normal" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 1,
        }}
      >
        <FormControlLabel control={<Checkbox />} label="Recordarme" />
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          ¿Olvidaste tu contraseña?
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: "8px",
          backgroundColor: "#c43c44",
          fontWeight: "bold",
          fontSize: "16px",
          ":hover": { backgroundColor: "#a91c24" },
        }}
      >
        INICIAR SESIÓN
      </Button>

      <Typography
        variant="body2"
        textAlign="center"
        mt={2}
        sx={{ cursor: "pointer" }}
        onClick={handleToggle}
      >
        ¿No tienes cuenta? Regístrate
      </Typography>
    </Box>
  );

  /**
   * Ajuste para adelgazar inputs y alinear labels:
   * - Reducimos padding vertical (6px).
   * - Ajustamos las transformaciones de la etiqueta
   *   para que no quede "chueca" al encogerse o en modo normal.
   */
  const thinInputSX = {
    "& .MuiOutlinedInput-input": {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
    // Ajuste de la posición del label cuando está normal y cuando se encoge
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 6px) scale(1)", // Ajusta 9px si lo deseas más alto/bajo
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -4px) scale(0.75)", // Ajusta -4px según tu preferencia
    },
  };

  const renderRegisterForm = () => (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Box
        component="img"
        src="/logos/Qardeal_logo completo verde y rojo.png"
        alt="Qardeal logo"
        sx={{
          display: "block",
          margin: "0 auto",
          maxWidth: "400px",
          mb: -5,
        }}
      />
      <Typography variant="subtitle1" textAlign="center" mb={4}>
        Completa tus datos para registrarte
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <TextField
          label="Nombre completo"
          fullWidth
          margin="dense"
          sx={{ flex: "1 1 48%", ...thinInputSX }}
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="dense"
          sx={{ flex: "1 1 48%", ...thinInputSX }}
        />

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="dense"
          sx={{ width: "100%", ...thinInputSX }}
        />

        <TextField
          label="Fecha de nacimiento"
          type="date"
          InputLabelProps={{ shrink: true }}
          margin="dense"
          sx={{ flex: "1 1 48%", ...thinInputSX }}
        />
        <TextField
          label="Ubicación"
          fullWidth
          margin="dense"
          sx={{ flex: "1 1 48%", ...thinInputSX }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="dense"
          sx={{ ...thinInputSX }}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          margin="dense"
          sx={{ ...thinInputSX }}
        />
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: "8px",
          backgroundColor: "#548b6c",
          fontWeight: "bold",
          fontSize: "16px",
          ":hover": { backgroundColor: "#306c4a" },
        }}
      >
        REGISTRARSE
      </Button>

      <Typography
        variant="body2"
        textAlign="center"
        mt={2}
        sx={{ cursor: "pointer" }}
        onClick={handleToggle}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: isMobile ? "auto" : "100vh",
        overflowY: isMobile ? "auto" : "hidden",
        overflowX: "hidden",
      }}
    >
      {isMobile ? (
        /* En mobile: contenedor a ancho completo */
        <Box
          sx={{
            width: "100%",
            px: 6,
            mt: -10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            marginTop: -5,
          }}
        >
          {isLoginActive ? renderLoginForm() : renderRegisterForm()}
        </Box>
      ) : (
        /* En desktop */
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: isLoginActive ? "0%" : "50%",
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            marginTop: -5,
          }}
        >
          {isLoginActive ? renderLoginForm() : renderRegisterForm()}
        </Box>
      )}

      {/* Imagen en desktop */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: isLoginActive ? "50%" : "0%",
            width: "50%",
            height: "100%",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "left 0.4s ease-in-out, background-image 0.2s linear",
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

LoginPage.useLayout = false;
export default LoginPage;
