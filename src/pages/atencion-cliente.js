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
        <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: 1, mb: 1 }}>
          Atención a clientes
        </Typography>
        <Typography variant="h5" mt={2} sx={{ color: '#e0e0e0', fontWeight: 400 }}>
          ¿Necesitas ayuda para reservar o con tus reservaciones? Permítenos ayudarte.<br />Nuestro equipo de atención a clientes está disponible <b>24/7</b>.
        </Typography>
      </Box>

      {/* Sección de contacto */}
      <Box sx={{ textAlign: "center", mt: 5, width: "100%" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
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
                justifyContent: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                background: '#fff',
                borderRadius: 3,
                boxShadow: 3,
                py: 3,
                px: 2,
                width: '100%',
                height: { xs: 220, sm: 260, md: 260 },
                minHeight: { xs: 220, sm: 260, md: 260 },
                boxSizing: 'border-box',
                transition: "transform 0.2s, box-shadow 0.2s",
                border: 'none',
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: 6,
                  background: '#f7f7f7',
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
              <ChatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                Chat online
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 18 }}>
                Recibe asistencia personalizada de un agente.
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 16, color: 'text.secondary' }}>
                Tiempo estimado de respuesta: <b>15 minutos</b>.
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
                justifyContent: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                background: '#fff',
                borderRadius: 3,
                boxShadow: 3,
                py: 3,
                px: 2,
                width: '100%',
                height: { xs: 220, sm: 260, md: 260 },
                minHeight: { xs: 220, sm: 260, md: 260 },
                boxSizing: 'border-box',
                transition: "transform 0.2s, box-shadow 0.2s",
                border: 'none',
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: 6,
                  background: '#f7f7f7',
                },
              }}
              component="a"
              href="tel:8003332886"
            >
              <CallIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                (800) 333 2886
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 18 }}>
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
                justifyContent: "center",
                cursor: "pointer",
                textDecoration: "none",
                color: "black",
                background: '#fff',
                borderRadius: 3,
                boxShadow: 3,
                py: 3,
                px: 2,
                width: '100%',
                height: { xs: 220, sm: 260, md: 260 },
                minHeight: { xs: 220, sm: 260, md: 260 },
                boxSizing: 'border-box',
                transition: "transform 0.2s, box-shadow 0.2s",
                border: 'none',
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: 6,
                  background: '#f7f7f7',
                },
              }}
              component="a"
              href="https://api.whatsapp.com/send/?phone=525545773150"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                WhatsApp
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 18 }}>
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
            justifyContent: "center",
            cursor: "pointer",
            textDecoration: "none",
            color: "black",
            background: '#fff',
            borderRadius: 3,
            boxShadow: 3,
            py: 4,
            px: 3,
            width: { xs: '100%', sm: '25%', md: '25%' },
            minWidth: { xs: '100%', sm: '25%', md: '25%' },
            maxWidth: { xs: '100%', sm: '25%', md: '25%' },
            height: { xs: 220, sm: 260, md: 260 },
            minHeight: { xs: 220, sm: 260, md: 260 },
            boxSizing: 'border-box',
            transition: "transform 0.2s, box-shadow 0.2s",
            border: 'none',
            "&:hover": {
              transform: "scale(1.04)",
              boxShadow: 6,
              background: '#f7f7f7',
            },
          }}
          component="a"
          href="mailto:atencionaclientes@qardeal.com.mx"
        >
          <EmailIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="inherit" sx={{ mb: 0.5 }}>
            Correo de asistencia
          </Typography>
          <Typography variant="body1" color="inherit" sx={{ fontWeight: 400, fontSize: 18 }}>
            atencionaclientes@qardeal.com.mx
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AtencionCliente;
