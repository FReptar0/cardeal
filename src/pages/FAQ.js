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

      {/* 1. ¿Cual es el tiempo mínimo de Renta? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Cual es el tiempo mínimo de Renta?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>El periodo mínimo de renta es de un día.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* 2. ¿Que incluye el costo de mi reservación? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que incluye el costo de mi reservación?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            El precio de su reservación incluye los servicios mencionados en
            esta reservación, y Cobertura de Protección de Responsabilidad Civil
            contra daños a terceros hasta por $350,000.00 Moneda Nacional.
            Cualquier Cobertura de Protección y Servicios que no se encuentren
            mencionados como incluidos en esta reservación tienen un costo
            adicional de acuerdo a la tarifa pública vigente exhibida a la vista
            del público en la localidad de entrega de la Unidad.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 3. ¿Cuales son los requisitos para rentar? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Cuales son los requisitos para rentar?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Para realizar la renta de un vehículo se deberán cubrir los
            siguientes requisitos en original, así como firmar y aceptar el
            contrato de arrendamiento:
            {"\n\n"}
            <strong>EDAD:</strong> La edad mínima para rentar es de 25 años. En
            caso de ser menor de dicha edad, entre el rango de los 18 y 24 años
            será sujeto de un cargo adicional por concepto de conductor menor.
            El cargo de conductor adicional es por cada conductor que el
            arrendatario principal desee agregar a la renta.
            {"\n\n"}
            <strong>IDENTIFICACIÓN:</strong> Presentar identificación oficial
            vigente, siendo aceptadas: Credencial de Elector (IFE o INE) o
            pasaporte, Cedula Profesional. Para el caso de extranjeros deberán
            de presentar Pasaporte vigente o Documento Migratorio actualizado.
            {"\n\n"}
            <strong>LICENCIA DE CONDUCIR:</strong> Todos los conductores
            principales o adicionales deben de presentar licencia de conducir
            vigente al momento de la renta y hasta el cierre del contrato de la
            persona que será designada como conductor de la unidad.
            {"\n\n"}
            <strong>Tarjetas de Crédito:</strong> Todos nuestros clientes
            deberán presentar una tarjeta de crédito vigente al momento de la
            apertura del contrato. Se aceptan tarjetas de crédito VISA,
            MasterCard y American Express.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 4. ¿Como se que auto me entregaran? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Como se que auto me entregaran?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Para la renta de autos los vehículos se encuentran clasificados en
            categorías de autos que cumplen con las características y
            especificaciones, según el estándar internacional de la organización
            ACRIS, por lo que no se podrá garantizar la entrega de auto de marca
            o modelo en específico.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 5. ¿Cuales son las formas de pago al reservar o pagar alquiler? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            ¿Cuales son las formas de pago al reservar o pagar alquiler?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <strong>Tarjeta de crédito:</strong> Las tarjetas de crédito
            aceptadas son VISA, MasterCard y American Express. La tarjeta que
            usted utilice al momento de reservar, debe estar al mismo nombre que
            el conductor principal, estando personalizada y con el nombre del
            titular grabado en relieve. Si la tarjeta de crédito no está a
            nombre del conductor, puede reservar siempre que el titular acompañe
            al conductor a recoger el vehículo.
            {"\n\n"}
            Por cuestiones de seguridad, solo se aceptan tarjetas emitidas por
            instituciones bancarias, quedando excluidas las tarjetas de crédito
            departamentales y las tarjetas digitales.
            {"\n\n"}
            Se recomienda que la tarjeta de crédito utilizada para la
            reservación sea la misma que se utilice para la retención por
            depósito en garantía que se realiza al momento de recoger el auto.
            Si usted utiliza una tarjeta diferente para pagar su reservación y
            otra para el depósito en garantía, considere que, al recoger el
            auto, previo a la retención de la garantía, se realizará la
            validación correspondiente.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 6. ¿Que es el Deposito en Garantia? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el Deposito en Garantia?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Al momento de la apertura del contrato se le solicitará una tarjeta
            de crédito para realizar un depósito en garantía de la renta del
            vehículo, de acuerdo con la cobertura y/o paquete de protección
            contratada.
            {"\n\n"}
            Para el depósito en garantía no se aceptan tarjetas de débito y/o
            virtuales. Solo serán aceptadas como forma de pago al momento de
            regresar el vehículo.
            {"\n\n"}
            La vigencia del Depósito en Garantía será la duración del contrato
            de arrendamiento. Se solicitará al cliente la renovación de manera
            presencial y con tarjeta en caso de exceder más de 28 días
            naturales.
            {"\n\n"}
            El Depósito en Garantía se libera de su tarjeta de crédito al
            momento del cierre del contrato; la devolución dependerá de los
            tiempos que la institución bancaria emisora tarde en procesar.
            {"\n\n"}
            En caso de Daño/Robo al automóvil y que el monto del depósito sea
            insuficiente, DENG MOTORS, S.A. DE C.V. podrá exigir judicial o
            extrajudicialmente el pago de una cantidad adicional.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 7. ¿Que tipo de coberturas puedo contratar? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que tipo de coberturas puedo contratar?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <strong>Protección incluida:</strong> RESPONSABILIDAD CIVIL + GASTOS
            MÉDICOS. Esta cobertura incluye protección de daños a terceros y
            responsabilidad civil hasta $350,000.00 pesos mexicanos, así como
            una cobertura a los pasajeros contra accidentes con un seguro de
            gastos médicos de hasta $250,000 (monto total, no por pasajero).
            {"\n\n"}
            <strong>Protección Básica 80%:</strong> Incluye protección de daños
            a terceros y responsabilidad civil hasta $700,000.00 pesos
            mexicanos, y a los pasajeros contra accidentes con un seguro de
            gastos médicos de hasta $500,000. Adicionalmente, protege el auto
            contra daños por colisiones o robo con un deducible máximo del 20%
            del valor comercial del auto; excepto llaves, placas, multas,
            documentos y accesorios interiores. No cubre daños/robos parciales
            en ventanas, llantas y espejos. <em>No incluye asistencia vial.</em>
            {"\n\n"}
            <strong>Protección Intermedia 90%:</strong> Amplía la protección
            hasta $700,000.00 pesos y cuenta con un seguro de gastos médicos
            hasta $500,000. Además, protege el auto contra colisiones o robo con
            un deducible máximo del 10% del valor comercial.{" "}
            <em>
              No incluye ciertos accesorios (llaves, placas, documentos, etc.)
            </em>{" "}
            y sí incluye asistencia vial (0 a 40 km).
            {"\n\n"}
            <strong>Protección Premium 95%:</strong> Además de lo anterior,
            cubre la ruptura o pérdida de neumáticos, retrovisores y vidrios sin
            deducible, y ofrece cobertura al 100% por cualquier daño por
            colisión y robo (excepto ciertos accesorios). Incluye asistencia
            vial en un radio de 0 a 100 km.
            {"\n\n"}
            Nota: En caso de robo, el cliente debe acudir a la autoridad
            correspondiente para levantar acta o denuncia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 8. ¿Que NO incluye las protecciones? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que NO incluye las protecciones?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            EXCLUSIONES GENERALES DE TODAS LAS COBERTURAS: No cubren pérdida de
            placas, multas, estadías en corralón o llaves. Tampoco cubren si el
            conductor no es el registrado en el contrato, daños a llantas,
            rines, espejos laterales y cristales. Se declinan si no se reporta
            el accidente dentro de las 24 horas (salvo fuerza mayor) y se
            invalidan en caso de consumo de alcohol, estupefacientes y/o drogas,
            conducción en caminos no pavimentados o negligencia.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 9. ¿Que SI incluye las protecciones? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que SI incluye las protecciones?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            INCLUSIONES GENERALES: El cliente es responsable solo del porcentaje
            del deducible sobre el valor total del auto a valor comercial. Si el
            daño es menor al deducible, pagará el valor del daño; si es mayor,
            se aplicará el porcentaje acordado en la protección. También se
            establece que el robo parcial de partes es responsabilidad del
            contratante y que el precio es por día de renta (periodos fijos de
            24 horas) y no es reembolsable.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 10. ¿Que significa OTROS CARGOS? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que significa OTROS CARGOS?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Se refiere a los costos derivados del uso del vehículo que son
            obligaciones del arrendatario, tales como extravío de placas,
            tarjeta de circulación, pérdida de documentos, pago de deducibles,
            servicios de grúas, gestoría, notarías, gastos legales por
            recuperación vehicular y cuotas locales o federales.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 11. ¿Tengo que pagar las multas e infracciones? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Tengo que pagar las multas e infracciones?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Se aplicará el cargo de las multas que se generen durante la renta,
            aplicándose también cargos adicionales por pérdida de placas y
            multas extemporáneas (incluyendo el costo de la gestoría).
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 12. ¿Tengo que pagar los daños y/o faltantes? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Tengo que pagar los daños y/o faltantes?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Se realizará un cargo por los daños estéticos y/o mecánicos sufridos
            por el auto, el cual cubrirá el deducible señalado en las
            protecciones contratadas o el daño completo en caso de haber
            declinado dichas protecciones. Asimismo se cobrará por la reparación
            o reposición de llaves, llantas, cristales, daños ocultos o daños
            por colisión no registrados en la inspección inicial.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 13. ¿Que es el PPG (Pre Pago de Gasolina)? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el PPG (Pre Pago de Gasolina)?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            DENG MOTORS SA de CV entregará la unidad con tanque lleno (8/8) al
            inicio de la renta. Es obligación del cliente devolver el vehículo
            con la misma cantidad de gasolina. En caso de no hacerlo, se cobrará
            por los litros faltantes (a precio promedio más un cargo de $15.00
            pesos por litro). La opción de PPG permite prepagar el tanque
            completo y devolverlo vacío sin cargo adicional; si se devuelve con
            gasolina, no será reembolsable.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 14. ¿Tengo que contratar un Asiento para Bebé? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Tengo que contratar un Asiento para Bebé?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Los asientos para bebé tienen un costo adicional por día. Deng
            Motors, S.A. de C.V. ofrece tres tipos de sillas según la
            legislación vigente:
            {"\n\n"}
            a) Silla de bebé (grupo 0+) para niños de 1 a 13 kg.
            {"\n"}
            b) Silla de bebé (grupo 0/1/2) para niños de 1 a 25 kg.
            {"\n"}
            c) Asiento elevador de coche sin respaldo para niños de 18 a 45 kg.
            {"\n\n"}
            Deng Motors se reserva el derecho de cancelar la reserva en caso de
            detectar que se transporten menores sin la silla correspondiente. La
            solicitud debe realizarse con 72 horas de anticipación y la
            disponibilidad puede variar según la ubicación.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 15. ¿Que es el Conductor Menor? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el Conductor Menor?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Todo conductor registrado en el contrato como titular o adicional,
            que tenga entre 18 y 24 años, deberá cubrir una cuota de riesgo por
            edad.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 16. ¿Que es el Cargo por perdida de uso? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el Cargo por perdida de uso?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            En caso de que la unidad sufra un siniestro y las protecciones
            queden inválidas, el cliente pagará los días que el vehículo
            permanezca en reparación y no pueda ser rentado. Además, si la
            unidad es detenida por autoridades y llevada a un corralón, se
            cobrará hasta el momento de liberación.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 17. ¿Que es la Cuota de Limpieza? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es la Cuota de Limpieza?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Es la cuota que se aplica al arrendatario en caso de que devuelva el
            vehículo con objetos en su interior, manchas en las vestiduras,
            alfombras, cielo, vidrios y/o asientos, o con pelo de mascotas.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 18. ¿Que es el Cargo por devolución tardía? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el Cargo por devolución tardía?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Además de cobrar días adicionales por retraso en la devolución, se
            puede aplicar un cargo extra para cubrir los gastos en los que se
            incurre para conseguir un vehículo alternativo, así como los gastos
            de gestión de contacto.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 19. ¿Que es el DROP OFF? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>¿Que es el DROP OFF?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Es el cargo correspondiente a la devolución del vehículo en una
            locación distinta a la de entrega, cuyo costo y disponibilidad
            varían según la ciudad y locación.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 20. ¿Hay servicios de entrega y/o devolución a domicilio? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            ¿Hay servicios de entrega y/o devolución a domicilio?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Sí, se ofrecen servicios de entrega o devolución del vehículo en el
            domicilio del cliente, previa validación de la documentación
            obligatoria; el costo y la disponibilidad varían según la locación.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 21. ¿Que aplica si mi auto en renta fue remolcado? */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            ¿Que aplica si mi auto en renta fue remolcado?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            En caso de que el vehículo haya sido incautado por cualquier
            autoridad, el arrendatario deberá cubrir los gastos y honorarios
            necesarios para la recuperación del vehículo.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default FAQ;
