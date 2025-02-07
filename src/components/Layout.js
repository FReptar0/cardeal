import Header from "./Header";
import Footer from "./Footer";
import { Container, Box } from "@mui/material";
import ChatBubble from "./ChatBubble";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Box >{children}</Box>
      <ChatBubble />
      <Footer />
    </>
  );
};

export default Layout;
