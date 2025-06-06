// components/ConfirmPDF.js
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Definición de nombres y precios de extras
const extrasDefinitions = {
  conductor_adicional: { nombre: "Conductor Adicional" },
  conductor_menor: { nombre: "Conductor Menor" },
  baby_seat: { nombre: "Baby Seat" },
  child_seat: { nombre: "Child Seat" },
  booster: { nombre: "Booster" },
};

// Estilos PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#141414",
  },
  headerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 2,
  },
  sectionValue: {
    fontSize: 10,
    marginBottom: 4,
  },
  italicValue: {
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 2,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    marginVertical: 4,
  },
  twoColumn: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: "#cccccc",
    marginRight: 4,
  },
  columnLast: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#141414",
    marginRight: 4,
    marginTop: 4,
  },
});

export default function ConfirmPDF({ booking }) {
  if (!booking || typeof booking !== "object") {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: No hay datos de reserva para mostrar el PDF.</Text>
        </Page>
      </Document>
    );
  }

  const { car, insurance, extras, search, contact, discount, tsdConfirmNum } =
    booking;

  // Fecha y hora actuales formato MMDDYYYY hh:mm AM/PM
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  let hour = now.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const dateTime = `${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${now.getFullYear()} ${pad(hour)}:${pad(now.getMinutes())} ${ampm}`;

  // Días de renta
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(search.returnDate) - new Date(search.pickupDate)) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Extras seleccionados (solo nombre y cantidad)
  const extrasArr = Object.entries(extras || {})
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => ({
      nombre: extrasDefinitions[key]?.nombre || key,
      qty,
    }));

  // Formateo de fechas para mostrar
  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: logo a la derecha, título grande a la izquierda */}
        <View style={styles.headerLine}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Confirmación de la{"\n"}reserva</Text>
            <Text style={styles.sectionLabel}>ARRENDATARIO</Text>
            <Text
              style={[
                styles.sectionValue,
                { fontFamily: "Helvetica-Bold", fontSize: 14 },
              ]}
            >
              {contact.fullName || "NOMBRE COMPLETO"}
            </Text>

            {/* --------- AÑADIDO: Datos de vehículo, extras, días y fechas --------- */}
            <View style={{ marginTop: 8 }}></View>
            {/* ------------------------------------------------------------- */}
          </View>
          <Image
            src="/logos/Qardeal-original.png"
            style={{ width: 170, height: 80, marginLeft: 8 }}
          />
        </View>

        {/* Fecha arriba a la derecha */}
        <Text
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            fontSize: 10,
          }}
        >
          {dateTime}
        </Text>

        <View style={styles.divider} />

        {/* Importes y fechas */}
        <View style={styles.twoColumn}>
          <View style={{ flex: 2 }}>
            {tsdConfirmNum && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 6 }]}>
                  Número de confirmación:
                </Text>
                <Text style={styles.sectionValue}>{tsdConfirmNum}</Text>
              </>
            )}
            <Text style={styles.sectionLabel}>Vehículo:</Text>
            <Text style={styles.sectionValue}>{car.name}</Text>

            <Text style={styles.sectionLabel}>Días de renta:</Text>
            <Text style={styles.sectionValue}>{days}</Text>

            <Text style={styles.sectionLabel}>Entrega:</Text>
            <Text style={styles.sectionValue}>
              {formatDateTime(search.pickupDate)}
            </Text>

            <Text style={styles.sectionLabel}>Devolución:</Text>
            <Text style={styles.sectionValue}>
              {formatDateTime(search.returnDate)}
            </Text>

            <Text style={styles.sectionLabel}>Extras:</Text>
            {extrasArr.length === 0 ? (
              <Text style={styles.sectionValue}>— Ninguno —</Text>
            ) : (
              extrasArr.map((e, i) => (
                <View style={styles.listItem} key={i}>
                  <View style={styles.bullet} />
                  <Text style={styles.sectionValue}>
                    {e.nombre} x{e.qty}
                  </Text>
                </View>
              ))
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionLabel, { fontSize: 12 }]}>
              RECEPCIÓN
            </Text>
            <Text style={styles.sectionValue}>
              {formatDateTime(search.pickupDate)}
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de Recepción
            </Text>
            <Text style={styles.italicValue}>
              {search.pickupLocation?.ciudad
                ? search.pickupLocation.ciudad
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : "[Ciudad no disponible]"}
            </Text>
            <Text style={styles.sectionValue}>
              {search.pickupLocation?.direccion ??
                "[Dirección de Recepción no disponible]"}
            </Text>

            <Text style={[styles.sectionLabel, { fontSize: 12, marginTop: 8 }]}>
              DEVOLUCIÓN
            </Text>
            <Text style={styles.sectionValue}>
              {formatDateTime(search.returnDate)}
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de devolución
            </Text>
            <Text style={styles.italicValue}>
              {search.sameOffice
                ? search.pickupLocation?.ciudad
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : search.returnLocation?.city
                ? `Ciudad ${search.returnLocation.city
                    .charAt(0)
                    .toUpperCase()}${search.returnLocation.city
                    .slice(1)
                    .toLowerCase()}`
                : "[Ciudad no disponible]"}
            </Text>
            <Text style={styles.sectionValue}>
              {search.sameOffice
                ? search.pickupLocation?.direccion
                : search.returnLocation?.direccion ??
                  "[Dirección de devolución no disponible]"}
            </Text>
          </View>
        </View>

        {/* Instrucciones */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>
              Instrucciones para la Recepción
            </Text>
            <Text style={styles.sectionValue}>
              Instrucciones: Qardeal pondrá a disposición del cliente una
              oficina de alquiler donde podrás firmar el contrato de alquiler y
              retirar tu vehículo de manera cómoda. Puedes encontrar la
              dirección de la oficina en el correo de confirmación de tu
              reserva.
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de Recepción
            </Text>
            <Text style={styles.italicValue}>
              {search.pickupLocation?.ciudad
                ? search.pickupLocation.ciudad
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : "[Ciudad no disponible]"}
            </Text>
            <Text style={styles.sectionValue}>
              {search.pickupLocation?.direccion ??
                "[Dirección de Recepción no disponible]"}
            </Text>
          </View>
          <View style={styles.columnLast}>
            <Text style={styles.sectionLabel}>
              Instrucciones para la devolución
            </Text>
            <Text style={styles.sectionValue}>
              Instrucciones: En el momento de la devolución, solicita
              instrucciones directamente al empleado en el mostrador de
              alquiler.
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de devolución
            </Text>
            <Text style={styles.italicValue}>
              {search.sameOffice
                ? search.pickupLocation?.ciudad
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : search.returnLocation?.city
                ? `Ciudad ${search.returnLocation.city
                    .charAt(0)
                    .toUpperCase()}${search.returnLocation.city
                    .slice(1)
                    .toLowerCase()}`
                : "[Ciudad no disponible]"}
            </Text>
            <Text style={styles.sectionValue}>
              {search.sameOffice
                ? search.pickupLocation?.direccion
                : search.returnLocation?.direccion ??
                  "[Dirección de devolución no disponible]"}
            </Text>
          </View>
        </View>

        {/* Reserva y protecciones */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>Tu reserva:</Text>
            <Text style={styles.bold}>{car.name || "Vehículo Nombre"}</Text>
            {/* Características */}
            {[
              car.seats && `${car.seats} Pasajeros`,
              car.airConditioning && "Aire Acondicionado",
              car.doors && `${car.doors} Puertas`,
              car.transmission && car.transmission,
            ]
              .filter(Boolean)
              .map((f, i) => (
                <View style={styles.listItem} key={i}>
                  <View style={styles.bullet} />
                  <Text style={styles.sectionValue}>{f}</Text>
                </View>
              ))}
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Servicios adicionales contratados
            </Text>
            {extrasArr.length === 0 ? (
              <Text style={styles.sectionValue}>-</Text>
            ) : (
              extrasArr.map((e, i) => (
                <Text style={styles.sectionValue} key={i}>
                  • {e.nombre} x{e.qty}
                </Text>
              ))
            )}
          </View>
          <View style={styles.columnLast}>
            <Text style={styles.sectionLabel}>Protección seleccionada</Text>
            {insurance ? (
              <>
                <Text style={styles.sectionValue}>{insurance.nombre}</Text>
                {Array.isArray(insurance.coberturas) &&
                  insurance.coberturas.length > 0 && (
                    <View style={{ marginTop: 4 }}>
                      <Text style={[styles.sectionLabel, { marginBottom: 2 }]}>
                        Coberturas incluidas
                      </Text>
                      {insurance.coberturas.map((cov, i) => (
                        <Text style={styles.sectionValue} key={i}>
                          • {cov}
                        </Text>
                      ))}
                    </View>
                  )}
              </>
            ) : (
              <Text style={styles.sectionValue}>
                [No se seleccionó ninguna protección]
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
