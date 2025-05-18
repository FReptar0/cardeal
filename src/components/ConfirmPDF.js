// components/BookingPdfDocument.jsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { COLORS, FONTS, SIZES } from "@/utils/pdfStyles";

// (Opcional) Registrar Google Fonts o tu tipografía corporativa
// Font.register({ family: 'Open Sans', fonts: [ ... ] });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: FONTS.regular,
    fontSize: SIZES.normal,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: { width: 100, height: 30 },
  title: {
    fontSize: SIZES.title,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  section: { marginBottom: 12 },
  label: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.text,
  },
  value: {
    marginLeft: 4,
    color: COLORS.text,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.muted,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: COLORS.muted,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: SIZES.small,
    color: COLORS.muted,
  },
});

export default function ConfirmPDF({ booking }) {
  const {
    car,
    search,
    contact,
    insurance,
    extras,
    discount,
    orderNumber,
    paidOnline,
  } = booking;
  const days =
    Math.ceil(
      (new Date(search.returnDate) - new Date(search.pickupDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;
  const carCost = paidOnline ? car.price : car.price2;
  const subtotal = carCost * days;
  const insuranceCost = insurance
    ? parseFloat(insurance.total.replace(/[^\d.]/g, "")) * days
    : 0;
  const extrasArr = Object.entries(extras || {})
    .filter(([_, qty]) => qty > 0)
    .map(([key, qty]) => ({ name: key, qty }));
  const extrasTotal = extrasArr.reduce(
    (sum, e) => sum + e.qty * (e.price || 0),
    0
  );
  const total = subtotal + insuranceCost + extrasTotal - (discount || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logos/Qardeal-original.png" style={styles.logo} />
          <Text style={styles.title}>
            Confirmación de Reserva #{orderNumber}
          </Text>
        </View>
        {/* Datos del cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{contact.fullName}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{contact.email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{contact.phone}</Text>
        </View>
        {/* Datos del vehículo */}
        <View style={styles.section}>
          <Text style={styles.label}>Vehículo:</Text>
          <Text style={styles.value}>
            {car.name} ({car.class || car.category || ""})
          </Text>
        </View>
        <View style={styles.section}>
          <Image
            src={
              car.photoUrl || car.photo || car.image || "/cars/camioneta.png"
            }
            style={{ width: 180, height: 120, marginVertical: 8 }}
          />
        </View>
        {/* Fechas de renta */}
        <View style={styles.section}>
          <Text style={styles.label}>Fechas de Renta:</Text>
          <Text style={styles.value}>
            Recogida: {new Date(search.pickupDate).toLocaleString("es-MX")}
          </Text>
          <Text style={styles.value}>
            Entrega: {new Date(search.returnDate).toLocaleString("es-MX")}
          </Text>
        </View>
        {/* Extras seleccionados */}
        <View style={styles.section}>
          <Text style={styles.label}>Extras seleccionados:</Text>
          {extrasArr.length === 0 ? (
            <Text style={styles.value}>-</Text>
          ) : (
            extrasArr.map((e, i) => (
              <Text key={i} style={styles.value}>
                • {e.name} x{e.qty}
              </Text>
            ))
          )}
        </View>
        {/* Totales */}
        <View style={styles.section}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>
            {subtotal.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </Text>
          <Text style={styles.label}>Seguro:</Text>
          <Text style={styles.value}>
            {insuranceCost.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </Text>
          <Text style={styles.label}>Descuento:</Text>
          <Text style={styles.value}>
            -
            {(discount || 0).toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </Text>
          <Text style={[styles.label, { marginTop: 8 }]}>Total a Pagar:</Text>
          <Text
            style={[
              styles.value,
              { color: COLORS.primary, fontSize: SIZES.title },
            ]}
          >
            {total.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </Text>
        </View>
        {/* Footer */}
        <Text style={styles.footer}>
          Gracias por confiar en Qardeal • www.qardeal.com
        </Text>
      </Page>
    </Document>
  );
}
