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
        mt: 0,
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Columna 1 */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 300, // Ancho uniforme
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingTop: "40px",
                paddingBottom: "40px",
                textAlign: "left",
              }}
            >
              <Box sx={{ mt: 1, textAlign: "center", marginLeft: "" }}>
                <Typography sx={{ fontSize: "2rem" }} color="primary">
                  Síguenos
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center", // Centrar también los textos
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      color: "inherit",
                      marginBottom: "10px",
                    }}
                  >
                    ¡Síguenos en nuestras redes sociales!
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton
                      component="a"
                      href="https://www.facebook.com/profile.php?id=61575894780718"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "inherit",
                        transition: "transform 0.3s, color 0.3s",
                        '&:hover': {
                          color: "#3b5998", // Color azul de Facebook
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://www.instagram.com/qardealmx?igsh=NXRneXNqdXpkN245&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "inherit",
                        transition: "transform 0.3s, color 0.3s",
                        '&:hover': {
                          color: "#E1306C", // Color rosa de Instagram
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Columna 2 */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 300, // Ancho uniforme
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingTop: "40px",
                paddingBottom: "40px",
                textAlign: "left",
              }}
            >
              <Box sx={{ mt: 1, textAlign: "left", marginLeft: "" }}>
                <Typography sx={{ fontSize: "2rem" }} color="primary">
                  Ayuda e información
                </Typography>
                <Typography
                  component="a"
                  href="/aviso-de-privacidad"
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  Aviso de privacidad
                </Typography>
                <Typography
                  component="a"
                  href="/terminos-y-condiciones"
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  Términos y condiciones
                </Typography>
                <Typography
                  component="a"
                  href="/FAQ"
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  Preguntas frecuentes
                </Typography>
                <Typography
                  component="a"
                  href="/facturacion"
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  Facturación
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Columna 3 */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 300, // Ancho uniforme
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingTop: "40px",
                paddingBottom: "40px",
                textAlign: "left",
              }}
            >
              <Box sx={{ mt: 1, textAlign: "left", marginLeft: "" }}>
                <Typography sx={{ fontSize: "2rem" }} color="primary">
                  Servicio al cliente
                </Typography>
                <Typography
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                  }}
                >
                  Contacto:
                </Typography>
                <Typography
                  sx={{
                    display: "block",
                    fontSize: "1.8rem",
                    marginTop: "10px",
                    color: "inherit",
                  }}
                >
                  800 333 2866
                </Typography>
                <Typography
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                  }}
                >
                  Correo:
                </Typography>
                <Typography
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                  color="secondary.text"
                >
                  soporte@qardeal.com.mx
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
