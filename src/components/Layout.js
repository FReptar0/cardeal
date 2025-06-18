import Header from "./Header";
import Footer from "./Footer";
import { Box, Typography } from "@mui/material";
import ChatBubble from "./ChatBubble";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const hideLayout = ["/verify", "/recuperar-cuenta", "/cambiar-acceso"];
  const shouldHideLayout = hideLayout.includes(router.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!shouldHideLayout && <Header />}

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {!shouldHideLayout && <ChatBubble />}
      {!shouldHideLayout && <Footer />}
    </Box>
  );
};

export default Layout;
