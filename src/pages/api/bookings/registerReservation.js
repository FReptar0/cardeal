// pages/api/registerReservation.js
import { parseStringPromise } from "xml2js";

function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  let h = date.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // Convert to 12-hour format
  return (
    `${pad(date.getMonth() + 1)}${pad(date.getDate())}${date.getFullYear()} ` +
    `${pad(h)}:${pad(date.getMinutes())} ${ampm}`
  );
}

export default async function handler(req, res) {
  console.log("🔍 Handler reached: Processing request...");
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
    passcode: TSD_PASSCODE,
  });

  console.log("🔑 CustomerNumber:", process.env.TSD_CUSTOMER_NUMBER);
  console.log("🔑 Passcode:", process.env.TSD_PASSCODE);

  // Datos que envia el cliente
  const {
    pickupLocationId,
    returnLocationId,
    pickupDateTime, // ya formateado como "MMDDYYYY hh:mm AM/PM"
    returnDateTime, // idem
    classCode,
    unitNumber,
    renterFirst,
    renterLast,
    customerNumber, // debería coincidir con TSD_CUSTOMER_NUMBER
    passcode, // idem
    extrasCodes = [], // array de strings con códigos TSD de extras
    insuranceCode = "", // string con código TSD de seguro o vacío
  } = req.body;

  // Log the received XML payload
  console.log("📥 XML recibido en el backend:", req.body);

  // Add a console log to print protection code and extras
  console.log("🔒 Insurance Code:", insuranceCode);
  console.log("🛠️ Extras Codes:", extrasCodes);

  // Construye el bloque de <ExtraCode> con códigos de extras y protección
  let extrasXML = extrasCodes
    .map((code) => `    <ExtraCode>${code}</ExtraCode>`) // Agrega cada código de extra
    .join("\n");
  if (insuranceCode) {
    extrasXML = `    <ExtraCode>${insuranceCode}</ExtraCode>\n` + extrasXML; // Agrega el código de protección al inicio
  }

  console.log("🚀 registerReservation Payload:", req.body);

  // Por si se va alv
  //<Dategmtime TimeZone="UTC">05132025 05:30 PM</Dategmtime>

  // Genera el XML con los datos recibidos
  const xmlBody = `
<?xml version="1.0" encoding="UTF-8"?>
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatDateTime(new Date())}</Dategmtime>
  <Sender><SenderID>GRAN1</SenderID></Sender>
  <Recipient><RecipientID>TRN</RecipientID></Recipient>
  <TradingPartner><TradingPartnerCode>WEB01</TradingPartnerCode></TradingPartner>
  <Customer>
    <CustomerNumber>${TSD_CUSTOMER_NUMBER}</CustomerNumber>
    <Passcode>${TSD_PASSCODE}</Passcode>
  </Customer>
  <Message>
    <MessageID>ADDREZ</MessageID>
    <MessageDesc>Make Reservation</MessageDesc>
  </Message>
  <Payload>
    <RentalLocationID>${pickupLocationId}</RentalLocationID>
    <ReturnLocationID>${returnLocationId}</ReturnLocationID>
    <PickupDateTime>${pickupDateTime}</PickupDateTime>
    <ReturnDateTime>${returnDateTime}</ReturnDateTime>
    <ClassCode>${classCode}</ClassCode>
    <UnitNumber>${unitNumber}</UnitNumber>
    <RenterFirst>${renterFirst}</RenterFirst>
    <RenterLast>${renterLast}</RenterLast>
    ${extrasXML}
  </Payload>
</TRNXML>`.trim();

  // Imprime el XML generado en la consola
  console.log("XML final para tsd:", xmlBody);

  // Commented out the POST request to TSD to prevent sending it
  /*
  try {
    console.log("⏳ Enviando petición a TSD...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    console.log(
      `✅ Petición completada. Status: ${response.status} ${response.statusText}`
    );
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
  */
}
