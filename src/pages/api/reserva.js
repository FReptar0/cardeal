// pages/api/reserva.js
import { parseStringPromise } from "xml2js";

// Formatea Date() a "MMDDYYYY hh:mm AM/PM"
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sólo POST permitido" });
  }

  const {
    TSD_ENDPOINT,
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

  const {
    location,
    rateId, // opcional: si se provee, se usa <RateID>
    classCode, // opcional: si no hay rateId, se usa <ClassCode>
  } = req.body;

  const pickupDateTime = "05152025 10:00 AM"; // Fecha de recogida hardcodeada
  const returnDateTime = "05182025 10:00 AM"; // Fecha de devolución hardcodeada

  // Construcción del XML según ADDREZ (mensajes y tags obligatorios) :contentReference[oaicite:0]{index=0}
  const xmlBody = `
<TRNXML Version="1.0.0">
  <DateTimeStamp TimeZone="ET">${formatDateTime(new Date())}</DateTimeStamp>
  <Sender><SenderID>${TSD_SENDER_ID}</SenderID></Sender>
  <Recipient><RecipientID>${TSD_RECIPIENT_ID}</RecipientID></Recipient>
  <TradingPartner>
    <TradingPartnerCode>${TSD_TRADING_PARTNER_CODE}</TradingPartnerCode>
  </TradingPartner>
  <Customer>
    <CustomerNumber>${TSD_CUSTOMER_NUMBER}</CustomerNumber>
    <Passcode>${TSD_PASSCODE}</Passcode>
  </Customer>
  <Message>
    <MessageID>ADDREZ</MessageID>
  </Message>
  <PayLoad>
    <PickupDateTime>${pickupDateTime}</PickupDateTime>
    <ReturnDateTime>${returnDateTime}</ReturnDateTime>
    <RentalLocationID>${location}</RentalLocationID>
    <ReturnLocationID>${location}</ReturnLocationID>
    ${
      rateId
        ? `<RateID>${rateId}</RateID>`
        : `<ClassCode>${classCode || ""}</ClassCode>`
    }
  </PayLoad>
</TRNXML>`.trim();

  try {
    const resp = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });
    if (!resp.ok) {
      throw new Error(`TSD responded ${resp.status}`);
    }

    const xml = await resp.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    // Extraemos confirmación y, si existe, TotalPricing :contentReference[oaicite:1]{index=1}:contentReference[oaicite:2]{index=2}
    const trn = json?.TRNXML || {};
    const confirmNum = trn.ConfirmNum || null;
    const totalPricing = trn.TotalPricing || null;

    console.log("Reserva exitosa:", { confirmNum, totalPricing });

    return res.status(200).json({ confirmNum, totalPricing });
  } catch (err) {
    console.error("Error ADDREZ:", err);
    return res
      .status(500)
      .json({ error: "Error al procesar la reserva", details: err.message });
  }
}
