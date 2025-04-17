import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Paper,
} from "@mui/material";

export default function AvisoPrivacidad() {
  return (
    <Box sx={{ width: "100%", mb: 10 }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ mt: 15, mb: 4 }}
      >
        Aviso de Privacidad
      </Typography>

      <Container maxWidth="md">
        <Box elevation={3} sx={{ p: 4 }}>
          {/* Introducción */}
          <Typography variant="body1" paragraph>
            DENG MOTORS, S.A. de C.V., con domicilio legal en Calle Río Grijalva
            18, Colonia Vista Hermosa, C.P. 62290, Cuernavaca, Morelos es
            responsable del uso y protección de sus datos personales y al
            respecto le informamos lo siguiente:
          </Typography>
          <Typography variant="body1" paragraph>
            Para llevar a cabo las finalidades descritas en el presente aviso de
            privacidad, podremos solicitarle todos o alguno de los siguientes
            datos personales, según sea el caso:
          </Typography>

          {/* Datos recabados */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Datos Personales que Recabamos
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2, "& li": { mb: 0.5 } }}>
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Domicilio</li>
            <li>Datos migratorios (de ser extranjero)</li>
            <li>Datos laborales</li>
            <li>Datos bancarios y financieros</li>
            <li>R.F.C.</li>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Le informamos que por la naturaleza de nuestra relación jurídica, no
            requerimos recabar datos personales sensibles.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Finalidades prioritarias */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Finalidades Prioritarias
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>I. Clientes a través de nuestro portal de internet:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              Reservación y pago de una unidad vehicular para renta diaria en{" "}
              <Link
                href="https://www.qardeal.com.mx"
                target="_blank"
                underline="hover"
              >
                www.qardeal.com.mx
              </Link>{" "}
              y cualquier otra plataforma digital que pongamos a su disposición.
            </li>
            <li>
              Consultar y cotizar las características y precios de las
              diferentes unidades vehiculares ofertadas.
            </li>
          </Box>

          <Typography variant="body1" paragraph>
            <strong>II. Clientes presenciales:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              Asesoría y, en su caso, renta de una unidad vehicular, previo a la
              formalización del contrato.
            </li>
            <li>
              Dar seguimiento a nuestra relación comercial y solicitar la
              evaluación de satisfacción de nuestros servicios.
            </li>
          </Box>

          <Typography variant="body1" paragraph>
            <strong>III. Solicitud de empleo:</strong> Recopilación de datos de
            quienes buscan empleo para su envío al área interesada en su
            contratación.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Finalidades secundarias */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Finalidades Secundarias
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              Mercadotecnia o publicitaria, para ofrecerle promociones de
              nuestros servicios.
            </li>
            <li>Prospección comercial.</li>
          </Box>
          <Typography variant="body2" paragraph>
            Su negativa no será motivo para negar los servicios o productos que
            solicita.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Transferencia de datos */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Transferencia de Datos
          </Typography>
          <Typography variant="body1" paragraph>
            Sus datos podrán compartirse, dentro y fuera del país, con:
          </Typography>

          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              mb: 2,
              "& th, & td": {
                border: 1,
                borderColor: "divider",
                p: 1,
                textAlign: "left",
              },
              "& th": { backgroundColor: "grey.100", fontWeight: "bold" },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">Destinatario</Box>
                <Box component="th">Finalidad</Box>
                <Box component="th">Requiere consentimiento</Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td">RENTLY SOFTWARE</Box>
                <Box component="td">
                  Incorporación a la base de datos comercial y procesamiento de
                  la reserva
                </Box>
                <Box component="td">No</Box>
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" paragraph>
            Para transferencias que requieran su consentimiento, dispone de 3
            días a partir de la entrega de sus datos para manifestar negativa.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Derechos ARCO */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Derechos ARCO
          </Typography>
          <Typography variant="body1" paragraph>
            Usted tiene derecho a Acceso, Rectificación, Cancelación y Oposición
            (ARCO). Para ejercerlos, envíe un correo a{" "}
            <Link
              href="mailto:avisosdeprivacidad@qardeal.com.mx"
              underline="hover"
            >
              avisosdeprivacidad@qardeal.com.mx
            </Link>{" "}
            adjuntando copia de identificación oficial y, de ser representante
            legal, escritura pública. Indique fecha, nombre de la persona que lo
            atendió, número de contrato o factura.
          </Typography>
          <Typography variant="body2" paragraph>
            Le informaremos en un plazo máximo de 5 días hábiles y, si es
            procedente, daremos respuesta en 20 días hábiles.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Revocación */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Revocación de Consentimiento
          </Typography>
          <Typography variant="body1" paragraph>
            Puede revocar su consentimiento enviando solicitud al mismo correo.
            Tenga en cuenta que podría impedirnos continuar ciertos servicios
            por obligaciones legales.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Cookies */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Uso de Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            Utilizamos “cookies” para mejorar su experiencia y personalizar el
            servicio. Puede deshabilitarlas desde:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Link
                href="http://www.microsoft.com/info/cookies.mspx"
                target="_blank"
                underline="hover"
              >
                Internet Explorer
              </Link>
            </li>
            <li>
              <Link
                href="http://www.mozilla.org/projects/security/pki/psm/help_21/using_priv_help.html"
                target="_blank"
                underline="hover"
              >
                Mozilla Firefox
              </Link>
            </li>
            <li>
              <Link
                href="http://www.opera.com/help/tutorials/security/privacy/"
                target="_blank"
                underline="hover"
              >
                Opera
              </Link>
            </li>
            <li>
              <Link
                href="https://support.google.com/chrome/answer/95647?hl=es"
                target="_blank"
                underline="hover"
              >
                Chrome
              </Link>
            </li>
            <li>
              <Link
                href="http://support.apple.com/kb/ph5042"
                target="_blank"
                underline="hover"
              >
                Safari
              </Link>
            </li>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Modificaciones */}
          <Typography variant="body2" paragraph>
            Este aviso puede sufrir modificaciones. Las actualizaciones estarán
            disponibles en nuestro micrositio de Grupo Andrade o en puntos de
            venta.
          </Typography>

          {/* Firma y fecha */}
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Typography variant="caption">
              Fecha de última actualización: 16/abril/2025
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
