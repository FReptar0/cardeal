// pages/api/registerReservation.js
import { parseStringPromise } from "xml2js";
function formatDateTimeForTSD(dateInput) {
  // Asegúrate de trabajar siempre con un Date
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Si quieres la hora en UTC (coincidiendo con TimeZone="UTC"), usa los getters UTC:
  const pad = (n) => String(n).padStart(2, "0");
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const year = date.getUTCFullYear();
  let h = date.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // convierte a 12-hour
  const hours = pad(h);
  const minutes = pad(date.getUTCMinutes());

  return `${month}${day}${year} ${hours}:${minutes} ${ampm}`;
}

function formatCustomDateTime(inputString) {
  // 1. Quita los paréntesis y su contenido
  const noParens = inputString.replace(/\s*\([^)]*\)/g, "").trim();

  // 2. Extrae la hora al final ("05:30 PM")
  const timeMatch = noParens.match(/(\d{1,2}:\d{2}\s[AP]M)$/);
  const timePart = timeMatch ? timeMatch[1] : "";

  // 3. Quita el GMT offset y la hora del final, dejando solo la parte de fecha
  let dateStr = noParens
    .replace(/\s*GMT[+-]\d{4}/, "") // elimina "GMT-0600"
    .replace(/\s*\d{1,2}:\d{2}\s[AP]M$/, "") // elimina la hora extraída
    .trim();

  // 4. Parsea la fecha limpia
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = date.getFullYear();

  return `${month}${day}${year} ${timePart}`;
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

  //

  // Datos que envia el cliente
  const {
    pickupLocationId,
    returnLocationId,
    pickupDateTime, // ya formateado como "MMDDYYYY hh:mm AM/PM"
    returnDateTime, // idem
    classCode, // abbreviation passed as classCode
    unitNumber,
    renterFirst,
    renterLast,
    extrasCodes = [], // array de strings con códigos TSD de extras
    insuranceCode = "", // string con código TSD de seguro o vacío
    rateId = "", // string con ID de tarifa o vacío
  } = req.body;

  console.log("Fecha", formatCustomDateTime(pickupDateTime));
  console.log("Fecha", formatCustomDateTime(returnDateTime));

  let extrasXML = extrasCodes
    .flatMap((code) => {
      // Si ya estás pasando objetos { id, cantidad }, adapta aquí
      if (typeof code === "object" && code.id && code.cantidad) {
        return Array(code.cantidad).fill(`<ExtraCode>${code.id}</ExtraCode>`);
      }
      return `<ExtraCode>${code}</ExtraCode>`; // compatibilidad con versiones anteriores
    })
    .join("\n");

  if (insuranceCode) {
    extrasXML = `    <ExtraCode>${insuranceCode}</ExtraCode>\n` + extrasXML;
  }

  console.log("🚀 registerReservation Payload:", req.body);

  const formattedPickupDateTime = formatCustomDateTime(pickupDateTime);
  const formattedReturnDateTime = formatCustomDateTime(returnDateTime);

  const xmlBody = `
<?xml version="1.0" encoding="UTF-8"?>
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatDateTimeForTSD(new Date())}</Dategmtime>
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
    <PickupDateTime>${formattedPickupDateTime}</PickupDateTime>
    <ReturnDateTime>${formattedReturnDateTime}</ReturnDateTime>
    <ClassCode>${classCode}</ClassCode>
    <RateID>${rateId}</RateID>
    <RenterFirst>${renterFirst}</RenterFirst>
    <RenterLast>${renterLast}</RenterLast>
    ${extrasXML}
  </Payload>
</TRNXML>`.trim();

  try {
    console.log("📨 XML enviado:\n", xmlBody);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

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
