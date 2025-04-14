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
          ATENCIÓN AL CLIENTE
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
          </Grid>

          {/* Teléfono México */}
          <Grid item xs={12} sm={6} md={3}>
            <CallIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">
              (800) 333 2886
            </Typography>
            <Typography variant="body2">Lada sin costo desde México</Typography>
          </Grid>

          {/* WhatsApp */}
          <Grid item xs={12} sm={6} md={3}>
            <WhatsAppIcon fontSize="large" color="error" />
            <Typography variant="h6" fontWeight="bold">
              WhatsApp
            </Typography>
            <Typography variant="body2">
              Contacto directo desde la aplicación
            </Typography>
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
          display: "flex", // Activamos Flexbox
          flexDirection: { xs: "column", md: "row" }, // En pantallas pequeñas, se apilan; en grandes, van en fila
          justifyContent: "space-evenly", // Distribuye espacio equitativamente
          alignItems: "center", // Alinea verticalmente
          gap: 4, // Espacio entre los dos bloques
          textAlign: "center",
        }}
      >
        {/* Bloque de Atención a clientes */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <EmailIcon fontSize="large" />
          <Typography variant="h6" fontWeight="bold">
            Correo electrónico de atención a clientes
          </Typography>
          <Typography variant="body2" color="error" fontWeight="bold">
            atencionaclientes@qardeal.com.mx
          </Typography>
        </Box>

        {/* Bloque de Soporte */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <EmailIcon fontSize="large" />
          <Typography variant="h6" fontWeight="bold">
            Correo electrónico de soporte
          </Typography>
          <Typography variant="body2" color="error" fontWeight="bold">
            soporte@qardeal.com.mx
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AtencionCliente;
