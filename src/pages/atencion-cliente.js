import { Container, Grid, Typography, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

const AtencionCliente = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Sección superior */}
      <Box sx={{ backgroundColor: "black", color: "white", p: 4, textAlign: "center", width: "100%" }}>
        <Typography variant="h4" fontWeight="bold">
          ATENCIÓN AL CLIENTE
        </Typography>
        <Typography variant="body1" mt={2}>
          ¿Necesitas ayuda para reservar o con tus reservaciones? Permítenos ayudarte.
          Nuestro equipo de atención a clientes está disponible 24/7.
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
            <ChatIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">Chat online</Typography>
            <Typography variant="body2">Recibe asistencia personalizada de un agente.</Typography>
            <Typography variant="body2">Tiempo estimado de respuesta: 15 minutos.</Typography>
          </Grid>

          {/* Teléfono México */}
          <Grid item xs={12} sm={6} md={3}>
            <CallIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">(800) 062 1705</Typography>
            <Typography variant="body2">Lada sin costo desde México</Typography>
          </Grid>

          {/* Teléfono Internacional */}
          <Grid item xs={12} sm={6} md={3}>
            <CallIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">(1-877) 704 9690</Typography>
            <Typography variant="body2">Lada sin costo desde EUA, Canadá y Puerto Rico</Typography>
          </Grid>

          {/* WhatsApp */}
          <Grid item xs={12} sm={6} md={3}>
            <WhatsAppIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">WhatsApp</Typography>
            <Typography variant="body2">Contacto directo desde la aplicación</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Sección de correos electrónicos */}
      <Box sx={{ mt: 5, textAlign: "center", borderTop: "1px solid gray", pt: 3, width: "100%" }}>
        <EmailIcon fontSize="large" />
        <Typography variant="h6" fontWeight="bold">Correo electrónico</Typography>
        <Typography variant="body2" color="error" fontWeight="bold">
          reservaciones@cardeal.com
        </Typography>
        <Typography variant="body2">El tiempo estimado de respuesta por correo electrónico es de hasta 72 horas en días hábiles.</Typography>
        <Typography variant="body2" mt={2} color="error" fontWeight="bold">
          quejasyservicio@cardeal.com
        </Typography>
      </Box>
    </Box>
  );
};

export default AtencionCliente;