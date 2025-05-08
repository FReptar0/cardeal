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
                <Typography sx={{ fontSize: "2rem", color: "#10906a" }}>
                  Síguenos
                </Typography>
                <Typography
                  sx={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    color: "inherit",
                  }}
                >
                  Siguenos en nuestras proximas redes sociales
                </Typography>
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
                <Typography sx={{ fontSize: "2rem", color: "#10906a" }}>
                  Ayuda e Información
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
                  Aviso de Privacidad
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
                  Términos y Condiciones
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
                  Preguntas Frecuentes
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
                <Typography sx={{ fontSize: "2rem", color: "#10906a" }}>
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
                    color: "#c43c45",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
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
