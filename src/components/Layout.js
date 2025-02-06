import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Container sx={{ minHeight: "80vh", mt: 2 }}>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
