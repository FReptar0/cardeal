// pages/api/registerReservation.js
import { parseStringPromise } from "xml2js";

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  let h = date.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return (
    `${pad(date.getMonth() + 1)}${pad(date.getDate())}${date.getFullYear()} ` +
    `${pad(h)}:${pad(date.getMinutes())} ${ampm}`
  );
}

export default async function handler(req, res) {
  const endpoint = process.env.TSD_ENDPOINT;
  const {
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

  console.log("🚀 registerReservation: iniciando handler");
  console.log("📡 Endpoint TSD:", endpoint);
  console.log("🔑 Credenciales:", {
    sender: TSD_SENDER_ID,
    recipient: TSD_RECIPIENT_ID,
    partner: TSD_TRADING_PARTNER_CODE,
    customer: TSD_CUSTOMER_NUMBER,
  });

  // Payload completamente hardcodeado según tu reserva de ejemplo
  const xmlBody = `
<?xml version="1.0" encoding="UTF-8"?>
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">05132025 05:30 PM</Dategmtime>
  <Sender><SenderID>GRAN1</SenderID></Sender>
  <Recipient><RecipientID>TRN</RecipientID></Recipient>
  <TradingPartner><TradingPartnerCode>WEB01</TradingPartnerCode></TradingPartner>
  <Customer>
    <CustomerNumber>43057</CustomerNumber>
    <Passcode>43057</Passcode>
  </Customer>
  <Message>
    <MessageID>ADDREZ</MessageID>
    <MessageDesc>Make Reservation</MessageDesc>
  </Message>
  <Payload>
    <RentalLocationID>MXCSAT</RentalLocationID>
    <ReturnLocationID>MXCSAT</ReturnLocationID>
    <PickupDateTime>05152025 01:00 PM</PickupDateTime>
    <ReturnDateTime>05182025 02:00 PM</ReturnDateTime>
    <ClassCode>SFAR</ClassCode>

    <!-- Datos del conductor/clientes -->
    <RenterLast>Daniel</RenterLast>   <!-- tu nombre, campo obligatorio -->
    <RenterFirst>Carrillo</RenterFirst>   <!-- tu apellido, campo opcional -->

    <UnitNumber>KIC001</UnitNumber>


    <!-- si necesitaras otros datos (email, teléfono, etc.), hay tags disponibles -->
  </Payload>
</TRNXML>`.trim();

  console.log("📄 XML a enviar:\n", xmlBody);

  try {
    console.log("⏳ Enviando petición a TSD...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    console.log(`✅ Petición completada. Status: ${response.status} ${response.statusText}`);
    const xml = await response.text();
    console.log("📨 XML recibido:\n", xml);

    const json = await parseStringPromise(xml, { explicitArray: false });
    console.log("🔍 JSON parseado:\n", JSON.stringify(json, null, 2));

    const msg = json?.PRE?.TRNXML?.Message || {};
    if (msg.MessageID === "RSPERR") {
      console.error("❌ TSD respondió error:", msg.MessageDescription);
      return res.status(400).json({ error: msg.MessageDescription });
    }

    return res.status(200).json(json);
  } catch (error) {
    console.error("❌ Error al registrar reserva:", error);
    return res.status(500).json({ error: "No se pudo registrar la reserva" });
  }
}
