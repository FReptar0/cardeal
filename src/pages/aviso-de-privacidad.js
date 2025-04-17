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
        <Box elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
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
            <li>Datos migratorios (de ser usted extranjero)</li>
            <li>Datos laborales</li>
            <li>Datos bancarios, financieros</li>
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
              y en cualquier otra plataforma digital que pongamos a su
              disposición.
            </li>
            <li>
              Consultar y cotizar las características y precios de las
              diferentes unidades vehiculares ofertadas.
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

          {/* Finalidades secundarias */}
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

          {/* Transferencia de datos */}
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
                <Box component="th">Requiere consentim.</Box>
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
            Con relación a las finalidades secundarias y a las transferencias
            que requieren de su consentimiento, si las hubiere, usted cuenta con
            3 días contados a partir de la entrega de su información personal,
            para manifestar su deseo de que estas no ocurran, de lo contrario
            entenderemos que nos lo ha otorgado.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Derechos ARCO */}
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
            presentar la solicitud respectiva enviando un correo electrónico a
            la siguiente dirección:{" "}
            <Link
              href="mailto:avisosdeprivacidad@qardeal.com.mx"
              underline="hover"
            >
              avisosdeprivacidad@qardeal.com.mx
            </Link>
            , adjuntando copia de su identificación oficial con fotografía y en
            caso de actuar mediante representante legal, adjuntando la escritura
            pública que acredite su personalidad jurídica, indicando la fecha y
            nombre de la persona que lo atendió, el número de crédito, contrato
            u operación, número de serie del vehículo que adquirió con nosotros,
            así como el número de la factura del vehículo o de la compra de
            refacciones o ingreso del vehículo al área de servicio.
          </Typography>
          <Typography variant="body2" paragraph>
            En un tiempo no mayor a 5 días hábiles se le informará la aceptación
            o negativa de su solicitud y en caso de que esta sea aceptada,
            contamos con 20 días para dar respuesta a su solicitud, mediante
            correo electrónico a la dirección desde la cual hizo contacto con
            nosotros.
          </Typography>
          <Typography variant="body2" paragraph>
            Los datos de contacto de la persona o departamento de datos
            personales, que está a cargo de dar trámite a las solicitudes de
            derechos ARCO, son los siguientes: At’n. Ing. Isrrael López, con
            domicilio en Avenida Cuauhtémoc 694, Piso 2, Colonia Narvarte
            Poniente, Alcaldía Benito Juárez, C.P. 03020, Ciudad de México, al
            siguiente correo electrónico: avisosdeprivacidad@qardeal.com.mx.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Revocación */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Revocación de Consentimiento
          </Typography>
          <Typography variant="body1" paragraph>
            Usted puede revocar el consentimiento que, en su caso, nos haya
            otorgado para el tratamiento de sus datos personales. Sin embargo,
            es importante que tenga en cuenta que no en todos los casos podremos
            atender su solicitud o concluir el uso de forma inmediata, ya que es
            posible que por alguna obligación legal requiramos seguir tratando
            sus datos personales. Asimismo, usted deberá considerar que, para
            ciertos fines, la revocación de su consentimiento implicará que no
            le podamos seguir prestando el servicio que nos solicitó, o la
            conclusión de su relación con nosotros.
          </Typography>
          <Typography variant="body1" paragraph>
            Para revocar su consentimiento deberá presentar su solicitud a
            través de correo electrónico a la siguiente dirección:{" "}
            <Link
              href="mailto:avisosdeprivacidad@qardeal.com.mx"
              underline="hover"
            >
              avisosdeprivacidad@qardeal.com.mx
            </Link>
            .
          </Typography>
          <Typography variant="body2" paragraph>
            Con relación al procedimiento y requisitos para la revocación de su
            consentimiento, le informamos que el procedimiento es el mismo que
            ha quedado estipulado en párrafos anteriores de este aviso de
            privacidad, para el ejercicio de sus derechos ARCO.
          </Typography>
          <Typography variant="body2" paragraph>
            Con objeto de que usted pueda limitar el uso y divulgación de su
            información personal, está a su disposición el siguiente correo
            electrónico: avisosdeprivacidad@qardeal.com.mx
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Modificaciones */}
          <Typography variant="body2" paragraph>
            El presente aviso de privacidad puede sufrir modificaciones, cambios
            o actualizaciones, los cuales estarán a su disposición en nuestro
            micrositio ubicado en la página electrónica de Grupo Andrade
            www.grupoandrade.com o en la App de Grupo Andrade o de cualquier
            otra plataforma o medio digital que pongamos a su disposición.
          </Typography>
          <Typography variant="body2" paragraph>
            El procedimiento a través del cual se llevarán a cabo las
            notificaciones sobre cambios o actualizaciones al presente aviso de
            privacidad será a través de anuncios colocados en nuestras oficinas
            o puntos de venta.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Cookies */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Uso de Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            Le informamos que en nuestra página de Internet utilizamos
            “cookies”, con las cuales es posible monitorear sus preferencias en
            nuestro sitio, brindarle un mejor servicio y experiencia de usuario
            al navegar en nuestra página, así como ofrecerle nuevos productos y
            servicios.
          </Typography>
          <Typography variant="body1" paragraph>
            Las cookies son archivos de datos descargados automáticamente y
            almacenados en su equipo de cómputo o dispositivo de comunicaciones
            electrónicas al navegar en una página de Internet específica, que
            permiten recordar al servidor de Internet algunos datos sobre el
            usuario, entre ellos, sus preferencias de navegación.
          </Typography>
          <Typography variant="body1" paragraph>
            La mayoría de las cookies expiran después de un periodo determinado
            de tiempo, o bien el titular las puede borrar en el momento que lo
            desee. Así mismo el titular puede hacer que el navegador le avise
            cuando recibe una cookie de manera que pueda aceptarla o rechazarla.
          </Typography>
          <Typography variant="body1" paragraph>
            Por lo anterior, le informamos que a través de las cookies obtenemos
            información personal del titular, como la siguiente:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>El tipo de navegador y sistema operativo que utiliza.</li>
            <li>
              Las páginas de Internet que visita en forma previa y posterior a
              la entrada del sitio del responsable.
            </li>
            <li>
              Los vínculos que sigue y permanencia en el sitio del responsable.
            </li>
            <li>La dirección IP del Titular.</li>
            <li>
              Lugar desde el cual visita a la página del responsable y
              estadísticas de navegación.
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            Las cookies y otras tecnologías pueden ser deshabilitadas por el
            titular, a continuación, le proporcionamos ligas con las
            instrucciones para realizar esta acción en algunos de los
            navegadores más populares:
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

          {/* Protección de datos */}
          <Typography variant="body2" paragraph>
            Así mismo le informamos que su información se encuentra debidamente
            protegida, cumpliendo con lo estipulado por la Secretaría de
            Economía a través de la Norma Oficial Mexicana
            NMX-COE-001-SCFI-2018.
          </Typography>
          <Typography variant="body2" paragraph>
            Comercio Electrónico – Disposiciones a las que se sujetarán aquellas
            personas que ofrezcan, comercialicen o vendan bienes, productos o
            servicios.
          </Typography>

          {/* Firma y fecha */}
          {/* <Box sx={{ mt: 4, textAlign: "right" }}>
            <Typography variant="body1" paragraph>
              He leído y acepto los términos y contenido del presente aviso de
              privacidad.
            </Typography>
            <Typography variant="caption" display="block">
              Fecha: _______________________________________
            </Typography>
            <Typography variant="caption">
              Nombre y firma: ________________________________
            </Typography>
          </Box> */}
        </Box>
      </Container>
    </Box>
  );
}
