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
  conductor_adicional: { nombre: "Conductor Adicional", precio: 110 },
  conductor_menor: { nombre: "Conductor Menor", precio: 110 },
  baby_seat: { nombre: "Baby Seat", precio: 150 },
  child_seat: { nombre: "Child Seat", precio: 150 },
  booster: { nombre: "Booster", precio: 150 },
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
    marginBottom: 4,
  },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  coupon: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
    marginBottom: 6,
  },
  sectionLabel: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 2 },
  sectionValue: { fontSize: 10, marginBottom: 4 },
  bold: { fontFamily: "Helvetica-Bold" },
  divider: { borderBottomWidth: 1, borderColor: "#cccccc", marginVertical: 4 },
  twoColumn: { flexDirection: "row" },
  column: {
    flex: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: "#cccccc",
    marginRight: 4,
  },
  columnLast: { flex: 1, padding: 4, borderWidth: 1, borderColor: "#cccccc" },
  warningBox: {
    borderWidth: 1,
    borderColor: "#d9534f",
    padding: 6,
    marginVertical: 6,
  },
  warningText: { fontSize: 9, lineHeight: 1.2 },
  listItem: { flexDirection: "row", alignItems: "flex-start" },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#141414",
    marginRight: 4,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
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

  const {
    car,
    insurance,
    extras,
    search,
    contact,
    discount,
    orderNumber,
    coupon,
  } = booking;

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

  // Características del vehículo
  const features = [
    car.seats && `${car.seats} Pasajeros`,
    car.airConditioning && "Aire Acondicionado",
    car.doors && `${car.doors} Puertas`,
    car.transmission && car.transmission,
  ].filter(Boolean);

  // Extras seleccionados
  const extrasArr = Object.entries(extras || {})
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => ({
      key,
      nombre: extrasDefinitions[key]?.nombre || key,
      qty,
    }));

  // Cálculo de importes
  const subtotal = (car.price || 0) * days;
  const insuranceCost = insurance
    ? parseFloat(String(insurance.total).replace(/[^\d.]/g, "")) * days
    : 0;
  const extrasCost = extrasArr.reduce(
    (sum, e) => sum + e.qty * (extrasDefinitions[e.key]?.precio || 0) * days,
    0
  );
  const totalValue = subtotal + insuranceCost + extrasCost - (discount || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header tipo rentcars: logo a la derecha, título grande a la izquierda */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Helvetica-Bold",
                marginBottom: 2,
              }}
            >
              Confirmación de la
              {"\n"}reserva
            </Text>
            {coupon && (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Helvetica-Bold",
                  marginBottom: 6,
                }}
              >
                Cupón: {coupon}
              </Text>
            )}
            <Text style={styles.sectionLabel}>ARRENDATARIO</Text>
            <Text
              style={[
                styles.sectionValue,
                { fontFamily: "Helvetica-Bold", fontSize: 14 },
              ]}
            >
              {contact.fullName || "NOMBRE COMPLETO"}
            </Text>
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
            {booking.tsdConfirmNum && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 6 }]}>
                  Número de confirmación:
                </Text>
                <Text style={styles.sectionValue}>{booking.tsdConfirmNum}</Text>
              </>
            )}
            {/* <Text style={[styles.sectionValue, { fontSize: 12 }]}>
              {totalValue.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </Text> */}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionLabel, { fontSize: 12 }]}>
              Recepción
            </Text>
            <Text style={styles.sectionValue}>
              {new Date(search.pickupDate).toLocaleString("es-MX", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de Recepción
            </Text>
            <Text style={styles.sectionValue}>
              {search.pickupLocation?.direccion ??
                "[Dirección de Recepción no disponible]"}
            </Text>

            <Text style={[styles.sectionLabel, { fontSize: 12, marginTop: 8 }]}>
              DEVOLUCIÓN
            </Text>
            <Text style={styles.sectionValue}>
              {new Date(search.returnDate).toLocaleString("es-MX", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </Text>
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              Dirección de devolución
            </Text>
            <Text style={styles.sectionValue}>
              {search.sameOffice
                ? search.pickupLocation?.direccion
                : search.returnLocation?.direccion ??
                  "[Dirección de devolución no disponible]"}
            </Text>

            <Text style={[styles.sectionLabel, { fontSize: 12, marginTop: 8 }]}>
              EMPRESA DE ALQUILER
            </Text>
            <Text style={styles.sectionValue}>Qardeal</Text>
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
            {features.map((f, i) => (
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

        {/* Footer */}
        <Text style={styles.footer}>
          Gracias por tu preferencia • www.qardeal.com
        </Text>
      </Page>
    </Document>
  );
}
