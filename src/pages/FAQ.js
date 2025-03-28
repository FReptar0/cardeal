import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: "120px", marginBottom: "40px" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Preguntas Frecuentes
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Cómo puedo registrarme en el sitio?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Puedes registrarte haciendo clic en el botón "Registrarse" en la parte superior de la página e ingresando tus datos en el formulario de registro.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Qué hago si olvido mi contraseña?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Si olvidaste tu contraseña, haz clic en "Olvidé mi contraseña" en la página de inicio de sesión. Recibirás un correo electrónico con las instrucciones para restablecerla.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Dónde encuentro información sobre los servicios?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Toda la información sobre nuestros servicios se encuentra en la sección "Servicios" del sitio. Si necesitas más detalles, puedes contactarnos directamente.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Cómo puedo contactar con atención al cliente?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Puedes ponerte en contacto con nuestro equipo de atención al cliente a través del formulario de contacto o llamando al número que aparece en la sección "Contacto".
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default FAQ;
