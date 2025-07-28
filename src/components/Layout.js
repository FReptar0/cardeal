import Header from "./Header";
import Footer from "./Footer";
import { Box, Typography } from "@mui/material";
import ChatBubble from "./ChatBubble";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const Layout = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, isVerified } = useAuth();

  const hideLayout = ["/verify", "/recuperar-cuenta", "/cambiar-acceso"];
  const shouldHideLayout = hideLayout.includes(router.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!shouldHideLayout && <Header />}

      <Box component="main" sx={{ flex: 1 }}>
        {!shouldHideLayout && isLoggedIn && !isVerified && (
          <Box
            sx={{
              width: "100%",
              height: "50px",
              margin: "0 auto",
              display: "flex",
              position: "relative",
              top: 70,
              zIndex: 999999,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff4e5",
                border: "1px solid #ffc107",
                textAlign: "center",
                py: 1.5,
                mt: 4,
                boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.05)",
                width: "100%",
                height: "50px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#a15b00", fontWeight: 500 }}
              >
                ¡Tu cuenta aún no ha sido verificada! Revisa el correo registrado y haz
                clic en el enlace de verificación.
              </Typography>
            </Box>
          </Box>
        )}
        {children}
      </Box>

      {!shouldHideLayout && <ChatBubble />}
      {!shouldHideLayout && <Footer />}
    </Box>
  );
};

export default Layout;
