import { Box, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        p: 2,
        bgcolor: "#141414",
        color: "white",
        height: "auto",
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Columna 1 */}
        <Grid item xs={12} sm={12} md={4}>
            <Box  sx={{display: "flex", justifyContent: "center"}}>
          <Box
          
            sx={{
              width: "70%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <Typography
              sx={{ fontSize: "2rem", color: "#10906a", textAlign: "left" }}
            >
              Síguenos
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton
                color="inherit"
                href="https://www.facebook.com"
                target="_blank"
              >
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://www.instagram.com"
                target="_blank"
              >
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://www.twitter.com"
                target="_blank"
              >
                <Twitter fontSize="large" />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://www.linkedin.com"
                target="_blank"
              >
                <LinkedIn fontSize="large" />
              </IconButton>
            </Box>
          </Box>
          </Box>
        </Grid>

        {/* Columna 2 */}
        <Grid item xs={12} sm={12} md={4}>
            <Box sx={{display: "flex", justifyContent: "center"}}>
          <Box
            sx={{
              width: "70%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <Typography sx={{ fontSize: "2rem", color: "#10906a" }}>
              Ayuda e Información
            </Typography>
            <Box sx={{ mt: 1, textAlign: "left", marginLeft: "-7px"}}>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  marginTop: "10px",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                Nosotros
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  marginTop: "10px",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                Aviso de Privacidad
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  marginTop: "10px",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                Términos y Condiciones
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  marginTop: "10px",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                Preguntas Frecuentes
              </Typography>
            </Box>
          </Box>
          </Box>
        </Grid>

        {/* Columna 3 */}
        <Grid item xs={12} sm={12} md={4}>
            <Box sx={{display: "flex", justifyContent: "center"}}>
          <Box
            sx={{
                width: "70%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <Typography sx={{ fontSize: "2rem", color: "#10906a" }}>
              Servicio al Cliente
            </Typography>
            <Box sx={{ mt: 1, textAlign: "left" }}>
              <Typography sx={{ fontSize: "1.1rem" }}>Contacto:</Typography>
              <Typography
                sx={{
                  fontSize: "1.7rem",
                  margin: "14px 0",
                  "&:hover": { textDecoration: "underline", cursor: "pointer" },
                }}
              >
                +506 8888 8888
              </Typography>
              <Typography sx={{ fontSize: "1.1rem" }}>
                Correo:{" "}
                <span style={{ color: "#ff3f60" }}>support@cardeal.com</span>
              </Typography>
            </Box>
          </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
