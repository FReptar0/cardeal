import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "primary.main", color: "white" }}>
      <Typography variant="body2">© {new Date().getFullYear()} Mi Sitio Web</Typography>
    </Box>
  );
};

export default Footer;
