import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";
import ChatBubble from "./ChatBubble";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();

  // Rutas donde no se deben mostrar Header y Footer
  const hideLayout = ["/verify"];

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