import { Box, Grid, Typography, IconButton } from "@mui/material";
//import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "left", // todo alineado a la izquierda
        p: 2,
        bgcolor: "#141414",
        color: "white",
      }}
    >
      <Grid container spacing={2}>
        {/* Columna 1 */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              width: "100%", // ocupa todo el espacio disponible
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // alinea todo a la izquierda
              p: 4,
            }}
          >
            <Typography variant="h4" sx={{ color: "#10906a" }}>
              Síguenos
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Síguenos en nuestras próximas redes sociales
            </Typography>
            {/* <Box sx={{ mt: 2 }}>
              <IconButton
                href="https://www.facebook.com"
                target="_blank"
                color="inherit"
              >
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.instagram.com"
                target="_blank"
                color="inherit"
              >
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.twitter.com"
                target="_blank"
                color="inherit"
              >
                <Twitter fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com"
                target="_blank"
                color="inherit"
              >
                <LinkedIn fontSize="large" />
              </IconButton>
            </Box> */}
          </Box>
        </Grid>

        {/* Columna 2 */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 4,
            }}
          >
            <Typography variant="h4" sx={{ color: "#10906a" }}>
              Ayuda e Información
            </Typography>
            <Typography
              component="a"
              href="/aviso-de-privacidad"
              sx={{
                display: "block",
                mt: 1,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Aviso de Privacidad
            </Typography>
            <Typography
              component="a"
              href="/terminos-y-condiciones"
              sx={{
                display: "block",
                mt: 1,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Términos y Condiciones
            </Typography>
            <Typography
              component="a"
              href="/FAQ"
              sx={{
                display: "block",
                mt: 1,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Preguntas Frecuentes
            </Typography>
            <Typography
              component="a"
              href="/facturacion"
              sx={{
                display: "block",
                mt: 1,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Facturación
            </Typography>
          </Box>
        </Grid>

        {/* Columna 3 */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 4,
            }}
          >
            <Typography variant="h4" sx={{ color: "#10906a" }}>
              Servicio al Cliente
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Contacto:</strong>
            </Typography>
            <Typography
              variant="h6"
              sx={{ mt: 1, textDecoration: "underline", cursor: "pointer" }}
            >
              800 333 2866
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Correo:{" "}
              <span style={{ color: "#ff3f60" }}>soporte@qardeal.com.mx</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
