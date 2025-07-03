import React from "react";
import { Box, Container, Typography, Link, Divider } from "@mui/material";

export default function AvisoPrivacidad() {
  return (
    <Box sx={{ width: "100%", mb: 10 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ mt: 15, mb: 4 }}
      >
        Aviso de Privacidad
      </Typography>

      <Container maxWidth="md">
        <Box elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
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

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Datos Personales que Recabamos
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2, "& li": { mb: 0.5 } }}>
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Domicilio</li>
            <li>Datos migratorios (de ser usted extranjero)</li>
            <li>Datos laborales</li>
            <li>Datos bancarios, financieros</li>
            <li>R.F.C.</li>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Le informamos que, por la naturaleza de nuestra relación jurídica,
            no requerimos recabar datos personales sensibles.
          </Typography>

          <Divider sx={{ my: 3 }} />

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
              y en cualquier otra plataforma digital que pongamos a su
              disposición.
            </li>
            <li>
              Consultar y cotizar a través de nuestro micrositio ubicado en la
              página electrónica antes mencionada, la consulta de las
              características y precios de las diferentes unidades vehiculares
              ofertadas.
            </li>
          </Box>

          <Typography variant="body1" paragraph>
            <strong>
              II. Clientes que acudan de forma presencial a nuestro
              establecimiento:
            </strong>
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              La asesoría y en su caso renta de una unidad vehicular, previo a
              la formalización del contrato correspondiente.
            </li>
            <li>
              Dar seguimiento a nuestra relación comercial y solicitar la
              evaluación y el seguimiento para conocer el nivel de satisfacción
              de nuestros servicios.
            </li>
          </Box>

          <Typography variant="body1" paragraph>
            <strong>III. Solicitud de empleo:</strong> Recopilación de datos de
            quienes buscan empleo para su posterior envío al área interesada en
            su contratación.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Finalidades Secundarias
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 1 }}>
            <li>
              Mercadotecnia o publicitaria, para ofrecerle promociones de
              nuestros servicios señalados en nuestra página de internet.
            </li>
            <li>Prospección comercial.</li>
          </Box>
          <Typography variant="body1" paragraph>
            Sí acepto ( ) No acepto ( ) que mis datos sean tratados para las
            finalidades secundarias arriba mencionadas.
          </Typography>
          <Typography variant="body2" paragraph>
            La negativa para el uso de sus datos personales para estas
            finalidades secundarias no podrá ser un motivo para que le neguemos
            los servicios y productos que solicita con nosotros.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Transferencia de Datos
          </Typography>
          <Typography variant="body1" paragraph>
            Le informamos que sus datos personales podrán ser compartidos dentro
            y fuera del país con las siguientes personas, empresas,
            organizaciones o autoridades distintas a nosotros, para los
            siguientes fines:
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
                <Box component="th">Destinatario de los Datos Personales</Box>
                <Box component="th">Finalidad</Box>
                <Box component="th">Requiere consent.</Box>
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
              <Box component="tr">
                <Box component="td">TSD RENTAL</Box>
                <Box component="td">
                  Incorporación a la base de datos comercial y procesamiento de
                  la reserva
                </Box>
                <Box component="td">No</Box>
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" paragraph>
            Con relación a las finalidades secundarias y a las transferencias
            que requieren de su consentimiento, si las hubiere, usted cuenta con
            3 días contados a partir de la entrega de su información personal,
            para manifestar su deseo de que estas no ocurran, de lo contrario
            entenderemos que nos lo ha otorgado.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Derechos ARCO
          </Typography>
          <Typography variant="body1" paragraph>
            Usted tiene derecho a conocer qué datos personales tenemos de usted,
            para qué los utilizamos y las condiciones del uso que les damos
            (Acceso). Asimismo, es su derecho solicitar la corrección de su
            información personal en caso de que esté desactualizada, sea
            inexacta o incompleta (Rectificación); que la eliminemos de nuestros
            registros o bases de datos cuando considere que la misma no está
            siendo utilizada adecuadamente (Cancelación); así como oponerse al
            uso de sus datos personales para fines específicos (Oposición).
            Estos derechos se conocen como derechos ARCO.
          </Typography>
          <Typography variant="body1" paragraph>
            Para el ejercicio de cualquiera de los derechos ARCO, usted deberá
            presentar la solicitud respectiva enviando un correo electrónico a:{" "}
            <Link
              href="mailto:avisosdeprivacidad@qardeal.com.mx"
              underline="hover"
            >
              avisosdeprivacidad@qardeal.com.mx
            </Link>
            , adjuntando copia de su identificación oficial con fotografía y en
            caso de actuar mediante representante legal, la escritura pública
            correspondiente. Indique también fecha, nombre de quien lo atendió,
            número de contrato, serie del vehículo o factura relacionada.
          </Typography>
          <Typography variant="body2" paragraph>
            Recibirá respuesta en un plazo no mayor a 5 días hábiles. En caso de
            ser aceptada, daremos trámite en un máximo de 20 días a través del
            correo que nos proporcionó.
          </Typography>
          <Typography variant="body2" paragraph>
            Responsable: Ing. Isrrael López, Avenida Cuauhtémoc 694, Piso 2,
            Colonia Narvarte Poniente, C.P. 03020, CDMX. Correo:
            avisosdeprivacidad@qardeal.com.mx
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Revocación de Consentimiento
          </Typography>
          <Typography variant="body1" paragraph>
            Usted puede revocar el consentimiento otorgado para el tratamiento
            de sus datos personales escribiendo a:{" "}
            <Link
              href="mailto:avisosdeprivacidad@qardeal.com.mx"
              underline="hover"
            >
              avisosdeprivacidad@qardeal.com.mx
            </Link>
            . Sin embargo, en algunos casos, por obligaciones legales, no
            podremos atender su solicitud de forma inmediata.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" paragraph>
            El presente aviso de privacidad puede sufrir modificaciones o
            actualizaciones, las cuales estarán disponibles en nuestro sitio web{" "}
            <Link
              href="https://www.qardeal.com.mx"
              target="_blank"
              underline="hover"
            >
              www.qardeal.com.mx
            </Link>
            , app de Qardeal o plataformas digitales que pongamos a su
            disposición. También podrán notificarse en puntos de venta físicos.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Uso de Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            Nuestro sitio web utiliza cookies para mejorar la experiencia del
            usuario, recordar preferencias, ofrecer productos personalizados y
            generar estadísticas de navegación.
          </Typography>
          <Typography variant="body1" paragraph>
            Estas cookies recopilan información como el tipo de navegador,
            páginas visitadas antes y después, vínculos que sigue, dirección IP,
            ubicación aproximada y tiempo de permanencia.
          </Typography>
          <Typography variant="body1" paragraph>
            Usted puede desactivar las cookies en su navegador. Instrucciones
            disponibles para:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>
              <Link
                href="http://www.microsoft.com/info/cookies.mspx"
                target="_blank"
                underline="hover"
              >
                Microsoft Internet Explorer
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

          <Typography variant="body2" paragraph>
            Su información se encuentra protegida conforme a la Norma Oficial
            Mexicana NMX-COE-001-SCFI-2018, sobre Comercio Electrónico.
          </Typography>

          {/* <Box sx={{ mt: 4, textAlign: "right" }}>
            <Typography variant="body1" paragraph>
              He leído y acepto los términos y contenido del presente aviso de
              privacidad.
            </Typography>
          </Box> */}
        </Box>
      </Container>
    </Box>
  );
}
