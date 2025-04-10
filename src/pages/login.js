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
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const imageUrl = isLoginActive
    ? "/photos/full-size/Sentra-calavera.webp"
    : "/photos/suv-standard/Kicks-calavera.webp";

  const handleToggle = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsFormVisible(false); // ocultamos formulario inmediatamente

    setTimeout(() => {
      setIsLoginActive((prev) => !prev); // cambiamos formulario
      setIsFormVisible(true); // lo volvemos a mostrar
      setIsTransitioning(false);
    }, 50); // igual al tiempo que tarda en moverse la imagen
  };

  const fadeInUpAnimation = {
    "@keyframes fadeInUp": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
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
          width: { xs: "80%", sm: "300px", md: "400px" },
          height: "auto",
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

  const thinInputSX = {
    "& .MuiOutlinedInput-input": {
      paddingTop: "12px",
      paddingBottom: "6px",
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 9px) scale(1)",
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -4px) scale(0.75)",
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
          width: { xs: "80%", sm: "300px", md: "400px" },
          height: "auto",
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
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            py: 4,
            boxSizing: "border-box",
            overflowY: "auto",
            zIndex: 2,
          }}
        >
          {isFormVisible && (
            <Box
              sx={{
                width: "100%",
                maxWidth: 400,
                animation: "fadeInUp 0.4s ease forwards",
                mt: -5,
                opacity: 0,
                ...fadeInUpAnimation,
              }}
            >
              {isLoginActive ? renderLoginForm() : renderRegisterForm()}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: isLoginActive ? "0%" : "50%",
            mt: -5,
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          {isFormVisible && (
            <Box
              sx={{
                opacity: 0,
                animation: "fadeInUp 0.4s ease forwards",
                ...fadeInUpAnimation,
              }}
            >
              {isLoginActive ? renderLoginForm() : renderRegisterForm()}
            </Box>
          )}
        </Box>
      )}

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
