import React from "react";
import { Box, Typography } from "@mui/material";

export default function TerminosYCondiciones() {
    return (
        <Box
            sx={{
                width: "100%",
                textAlign: "center",
                height: "auto",
                marginBottom: 10,
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ marginTop: 15, marginBottom: 2 }}
            >
                Términos y Condiciones
            </Typography>

            {/* Contenedor para el texto, centrado el título pero alineado a la izquierda el contenido */}
            <Box sx={{ maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
                <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
                    ANEXO “B “
                </Typography>

                <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
                    CARGOS EXTRAS
                </Typography>

                {/* 1 */}
                <Typography variant="body1">
                    <strong>1.- MULTAS E INFRACCIONES VEHICULARES:</strong> Se aplicará el
                    cargo de las multas que durante la renta del auto se generen en el
                    vehículo derivada del incumplimiento al reglamento de tránsito
                    aplicable, o por cualquier otra causa imputable al mismo. (Agregar la
                    nota para poder para cobro de multas que resulten posteriores al
                    cierre del contrato)
                </Typography>

                {/* 2 */}
                <Typography variant="body1" component="div">
                    <strong>2.- DAÑOS Y/O FALTANTES:</strong> Se realizará el cargo por
                    este concepto cuando el auto haya sufrido un accidente y cuente con
                    daños estéticos y/o mecánicos, el cargo se realizará para cubrir el
                    deducible señalado en las protecciones contratadas o el daño completo
                    en caso de haber declinado las protecciones. Así mismo también se
                    realizará el cargo por la reparación o reposición del daño y/o
                    faltante en:
                    <ul style={{ marginTop: "8px", marginLeft: "24px" }}>
                        <li>Llaves</li>
                        <li>Llantas</li>
                        <li>Cristales</li>
                        <li>Daños ocultos</li>
                        <li>
                            Daños por una colisión o daños no registrados en la inspección
                            inicial.
                        </li>
                    </ul>
                </Typography>

                {/* 3 */}
                <Typography variant="body1">
                    <strong>3.- REMOLQUE:</strong> En caso de que el vehículo objeto del
                    arrendamiento deba ser remolcado o de cualquier forma transportado por
                    medio del uso de otro vehículo para efectos de lograr su devolución a
                    la Arrendadora, el Arrendatario cubrirá los gastos que lo mismo
                    genere.
                </Typography>

                {/* 4 */}
                <Typography variant="body1">
                    <strong>4.- INCAUTACION:</strong> En caso de que el vehículo haya sido
                    incautado por cualquier autoridad (entendiéndose por incautar el hecho
                    de que la autoridad haya tomado posesión del vehículo). El
                    Arrendatario se obliga a cubrir los gastos y honorarios necesarios
                    para la recuperación del vehículo.
                </Typography>

                {/* 5 */}
                <Typography variant="body1">
                    <strong>5.- ASIENTOS PARA BEBÉ:</strong> Los asientos para bebe
                    tendrán un costo adicional por día. (Será la responsabilidad del
                    arrendatario la colocación en el auto de dicho asiento).
                </Typography>

                {/* 6 */}
                <Typography variant="body1">
                    <strong>6.- CONDUCTOR ADICIONAL:</strong> La tarifa diaria de la renta
                    de auto otorga el derecho al registro de un conductor mayor a 25 años,
                    mismo que queda amparado dentro de las protecciones, el registro de
                    conductores adicionales genera un cargo por día por cada conductor
                    adicional. Será necesario que cada conductor adicional cumpla con los
                    Requisitos de Renta y estar presente al momento de la apertura del
                    contrato para la firma de registro.
                </Typography>

                {/* 7 */}
                <Typography variant="body1">
                    <strong>7.- CONDUCTOR MENOR DE 25 AÑOS:</strong> Se cobrará un cargo
                    adicional por día a los conductores jóvenes de 18 a 24 años. Será
                    necesario que cada conductor menor cumpla con los Requisitos de Renta
                    y estar presente al momento de la apertura del contrato para la firma
                    de registro.
                </Typography>

                {/* 8 */}
                <Typography variant="body1">
                    <strong>8.- GASOLINA:</strong> Todas las oficinas de Deng Motors, S.A.
                    de C.V. México entregan los autos con tanque lleno de combustible al
                    momento de la renta. Si al momento del regreso de la unidad cuenta con
                    una cantidad menor de combustible que la registrada en la hoja de
                    inspección generada al momento de la entrega del auto se deberán pagar
                    el costo establecido por la arrendadora por el servicio por llenar
                    nuevamente el tanque junto con el costo del combustible.
                </Typography>

                {/* 9 */}
                <Typography variant="body1">
                    <strong>9.- CARGO POR PERDIDA DE USO:</strong> En caso de que la
                    unidad sufra un siniestro y las protecciones queden invalidadas el
                    cliente será responsable también por el pago de los días que el
                    vehículo siniestrado deba permanecer en reparación y por consecuencia
                    no pueda ser rentado. El cargo comenzará a partir del día del
                    siniestro y hasta el momento de finalizar su reparación. En caso de
                    que la unidad sea detenida por cualquier autoridad local, estatal o
                    federal y llevada a un corralón derivado de cualquier situación
                    imputable al cliente, el cliente será responsable por el pago de la
                    tarifa hasta el momento de su liberación.
                </Typography>

                {/* 10 */}
                <Typography variant="body1">
                    <strong>10.- GASTOS ADMINISTRATIVOS:</strong> Se refiere a los costos
                    derivados del uso del Vehículo, y que forman parte de las obligaciones
                    del Arrendatario, incluyendo de manera enunciativa más no limitativa,
                    los siguientes: extravío de placas, tarjeta de circulación, pérdida de
                    documentos, pago de deducibles del seguro, servicios de grúas, gastos
                    y costas de gestoría, notarías y gastos legales por recuperación
                    vehicular, así como cualquier reparación que hubiera que realizar al
                    Vehículo, cuotas locales/federal.
                </Typography>

                {/* 11 */}
                <Typography variant="body1">
                    <strong>11.- CUOTA DE LIMPIEZA:</strong> Será la cuota que se aplicará
                    al Arrendatario en el supuesto de que regrese el vehículo con objetos
                    dentro del mismo, manchas en sus vestiduras, alfombras, cielo, vidrios
                    y/o asientos, pelo de mascotas.
                </Typography>

                {/* 12 */}
                <Typography variant="body1">
                    <strong>12.- CARGO POR DEVOLUCIÓN TARDIA:</strong> Adicional al cobro
                    de los días de alquiler excedentes por el retraso en la devolución,
                    nos reservamos el derecho de cobrar un Cargo por devolución tardía
                    para compensar en parte los gastos generados por la misma.
                </Typography>

                {/* 13 */}
                <Typography variant="body1">
                    <strong>13.- CARGO POR CANCELACION:</strong> Se aplicará cargo por
                    cancelación equivalente a un día de renta tiempo y kilometraje.
                </Typography>

                {/* 14 */}
                <Typography variant="body1">
                    <strong>14.- OTROS CARGOS:</strong> Estos incluyen cuotas locales y
                    federales, licencias de uso vehicular
                </Typography>

                {/* 15 */}
                <Typography variant="body1">
                    <strong>15.- DROP OFF:</strong> Cargo correspondiente a la devolución
                    del vehículo en una locación distinta a la entrega, costo y
                    disponibilidad por cada locación de cada ciudad.
                </Typography>

                {/* 16 */}
                <Typography variant="body1">
                    <strong>16.- ENTREGA O DEVOLUCION A DOMICILIO:</strong> Cargo por
                    solicitud de entrega o devolución del vehículo en el domicilio del
                    cliente, previa validación de la documentación obligatoria, costo y
                    disponibilidad por cada locación de cada ciudad.
                </Typography>
            </Box>
        </Box>
    );
}
