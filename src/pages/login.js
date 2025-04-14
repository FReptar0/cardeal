import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isLoginActive, setIsLoginActive] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Redirige a /perfil si el usuario ya está logeado
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/perfil");
    }
  }, [isLoggedIn, router]);

  // Mientras se redirige, podemos retornar null para no renderizar nada
  if (isLoggedIn) return null;

  const handleToggle = () => {
    setIsLoginActive((prev) => !prev);
  };

  const imageUrl = isLoginActive
    ? "/photos/full-size/Sentra-calavera.webp"
    : "/photos/suv-standard/Kicks-calavera.webp";

  // Estilo de animación para la aparición del formulario
  const fadeInUpAnimation = {
    "@keyframes fadeInUp": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    animation: "fadeInUp 0.4s ease forwards",
  };

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
          <Box sx={{ width: "100%", maxWidth: 400, ...fadeInUpAnimation }}>
            {isLoginActive ? (
              <LoginForm onToggle={handleToggle} />
            ) : (
              <RegisterForm onToggle={handleToggle} />
            )}
          </Box>
        </Box>
      ) : (
        <>
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
            <Box sx={{ width: "100%", maxWidth: 400, ...fadeInUpAnimation }}>
              {isLoginActive ? (
                <LoginForm onToggle={handleToggle} />
              ) : (
                <RegisterForm onToggle={handleToggle} />
              )}
            </Box>
          </Box>
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
              transition:
                "left 0.4s ease-in-out, background-image 0.2s linear",
              zIndex: 1,
            }}
          />
        </>
      )}
    </Box>
  );
};

LoginPage.useLayout = false;
export default LoginPage;
