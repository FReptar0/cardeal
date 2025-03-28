import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";
import ChatBubble from "./ChatBubble";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <ChatBubble />
      <Footer />
    </Box>
  );
};

export default Layout;
