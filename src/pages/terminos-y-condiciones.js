import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function TerminosYCondiciones() {
  return (
    <Box sx={{ width: "100%", mb: 10 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ mt: 15, mb: 4 }}
      >
        Términos y Condiciones
      </Typography>

      <Container maxWidth="md">
        <Box sx={{ p: 4, bgcolor: "background.paper" }}>
          {[
            {
              title: "1. MULTAS E INFRACCIONES VEHICULARES",
              content:
                "Se aplicará el cargo de las multas que durante la renta del auto se generen en el vehículo derivadas del incumplimiento al reglamento de tránsito aplicable, o por cualquier otra causa imputable al mismo.",
            },
            {
              title: "2. DAÑOS Y/O FALTANTES",
              content: (
                <>
                  Se realizará el cargo por este concepto cuando el auto haya
                  sufrido un accidente y cuente con daños estéticos y/o
                  mecánicos; el cargo se realizará para cubrir el deducible
                  señalado en las protecciones contratadas o el daño completo en
                  caso de haber declinado las protecciones. Así mismo, también
                  se realizará el cargo por la reparación o reposición del daño
                  y/o faltante en:
                  <ul style={{ marginTop: 8, marginLeft: 24 }}>
                    <li>Llaves</li>
                    <li>Llantas</li>
                    <li>Cristales</li>
                    <li>Daños ocultos</li>
                    <li>
                      Daños por una colisión o daños no registrados en la
                      inspección inicial.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: "3. REMOLQUE",
              content:
                "En caso de que el vehículo en contrato deba ser remolcado o de cualquier forma transportado por medio del uso de otro vehículo para efectos de lograr su devolución a la Qardeal, el cliente cubrirá los gastos que lo mismo genere.",
            },
            {
              title: "4. INCAUTACIÓN",
              content:
                "En caso de que el vehículo haya sido incautado por cualquier autoridad (entendiéndose por incautar el hecho de que la autoridad haya tomado posesión del vehículo). El cliente se obliga a cubrir los gastos administrativos necesarios para la recuperación del vehículo.",
            },
            {
              title: "5. ASIENTOS PARA BEBÉ",
              content:
                "Los asientos para bebé tendrán un costo adicional por día. (Será la responsabilidad del cliente la colocación en el auto de dicho asiento).",
            },
            {
              title: "6. CONDUCTOR ADICIONAL",
              content:
                "El registro de conductores adicionales genera un cargo por día por cada conductor adicional. Será necesario que cada conductor adicional cumpla con los requisitos de renta y esté presente al momento de la apertura del contrato para su firma.",
            },
            {
              title: "7. CONDUCTOR MENOR DE 25 AÑOS",
              content:
                "Se cobrará un cargo adicional por día a los conductores jóvenes de 18 a 24 años. Será necesario que cada conductor menor cumpla con los requisitos de renta y esté presente al momento de la apertura del contrato para su firma.",
            },
            {
              title: "8. GASOLINA",
              content:
                "Si al momento del regreso de la unidad cuenta con una cantidad menor de combustible que la registrada en la entrega del auto, deberá pagar el costo de recarga de combustible establecido por Qardeal.",
            },
            {
              title: "9. CARGO POR PÉRDIDA DE USO",
              content:
                "En caso de que la unidad sufra un siniestro y las protecciones queden invalidadas, el cliente será responsable también por el pago de los días que el vehículo siniestrado deba permanecer en reparación y por consecuencia no pueda ser rentado. El cargo comenzará a partir del día del siniestro y hasta el momento de finalizar su reparación. En caso de que la unidad sea detenida por cualquier autoridad local, estatal o federal y llevada a un corralón derivado de cualquier situación imputable al cliente, el cliente será responsable por el pago de la tarifa diaria hasta el momento de su liberación.",
            },
            {
              title: "10. GASTOS ADMINISTRATIVOS",
              content:
                "Se refiere a los costos derivados del uso del vehículo, y que forman parte de las obligaciones del cliente, incluyendo de manera enunciativa más no limitativa los siguientes: extravío de placas, tarjeta de circulación, pérdida de documentos, pago de deducibles del seguro, servicios de grúas, gastos y costas de gestoría, notarías y gastos legales por recuperación vehicular, así como cualquier reparación que hubiera que realizar al vehículo, cuotas locales/federales.",
            },
            {
              title: "11. CUOTA DE LIMPIEZA",
              content:
                "Será la cuota que se aplicará al cliente en el supuesto de que regrese el vehículo con objetos dentro del mismo, manchas en sus vestiduras, alfombras, tapicerías, vidrios, pelo de mascotas.",
            },
            {
              title: "12. CARGO POR CANCELACIÓN",
              content:
                "Se aplicará cargo por cancelación equivalente a un día de renta, tiempo y kilometraje.",
            },
            {
              title: "13. OTROS CARGOS",
              content:
                "Incluyen licencias de uso vehicular, cuotas locales y federales.",
            },
            {
              title: "14. DEVOLUCIÓN EN LOCACIÓN DISTINTA (DROP OFF)",
              content:
                "Cargo correspondiente a la devolución del vehículo en una locación distinta a la ubicación de origen, costo y disponibilidad varía por cada locación y cada ciudad.",
            },
            {
              title: "15. ENTREGA O DEVOLUCIÓN A DOMICILIO",
              content:
                "Cargo por solicitud de entrega o devolución del vehículo en el domicilio del cliente, previa validación de la documentación obligatoria, costo y disponibilidad por cada locación de cada ciudad.",
            },
          ].map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>{item.title}</strong>
              </Typography>
              <Typography variant="body1">{item.content}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
