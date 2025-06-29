import { Grid, Typography, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const AtencionCliente = () => {
  return (
    <Box sx={{ width: "100%", marginTop: 12 }}>
      {/* Sección superior */}
      <Box
        sx={{
          backgroundColor: "black",
          color: "white",
          p: 4,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Atención a clientes
        </Typography>
        <Typography variant="body1" mt={2}>
          ¿Necesitas ayuda para reservar o con tus reservaciones? Permítenos
          ayudarte. Nuestro equipo de atención a clientes está disponible 24/7.
        </Typography>
      </Box>

      {/* Sección de contacto */}
      <Box sx={{ textAlign: "center", mt: 5, width: "100%" }}>
        <Typography variant="h5" fontWeight="bold">
          Ponte en contacto con nosotros a través de los siguientes medios:
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={3}>
          {/* Chat Online */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.04)",
                },
              }}
              onClick={() => {
                const bubble = document.getElementById('bubble-open');
                if (bubble) bubble.click();
              }}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const bubble = document.getElementById('bubble-open');
                  if (bubble) bubble.click();
                }
              }}
            >
              <ChatIcon fontSize="large" color="error" />
              <Typography variant="h6" fontWeight="bold">
                Chat online
              </Typography>
              <Typography variant="body2">
                Recibe asistencia personalizada de un agente.
              </Typography>
              <Typography variant="body2">
                Tiempo estimado de respuesta: 15 minutos.
              </Typography>
            </Box>
          </Grid>

          {/* Teléfono México */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.04)",
                },
              }}
              component="a"
              href="tel:8003332886"
            >
              <CallIcon fontSize="large" color="error" />
              <Typography variant="h6" fontWeight="bold" color="inherit">
                (800) 333 2886
              </Typography>
              <Typography variant="body2" color="inherit">
                Lada sin costo desde México
              </Typography>
            </Box>
          </Grid>

          {/* WhatsApp */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.04)",
                },
              }}
              component="a"
              href="https://api.whatsapp.com/send/?phone=525545773150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon fontSize="large" color="error" />
              <Typography variant="h6" fontWeight="bold" color="inherit">
                WhatsApp
              </Typography>
              <Typography variant="body2" color="inherit">
                Contacto directo desde la aplicación
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Sección de correos electrónicos */}
      <Box
        sx={{
          mt: 5,
          borderTop: "1px solid gray",
          pt: 3,
          pb: 3,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Único bloque: Atención a clientes */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            textDecoration: "none",
            color: "black",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.04)",
            },
          }}
          component="a"
          href="mailto:atencionaclientes@qardeal.com.mx"
        >
          <EmailIcon
            fontSize="large"
            sx={{ color: (theme) => theme.palette.primary.text }}
          />
          <Typography variant="h6" fontWeight="bold" color="inherit">
            Correo electrónico de atención a clientes
          </Typography>
          <Typography variant="body2" color="inherit">
            atencionaclientes@qardeal.com.mx
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AtencionCliente;
