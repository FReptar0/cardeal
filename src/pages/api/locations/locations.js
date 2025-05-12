import { parseStringPromise } from "xml2js";

export default async function handler(req, res) {
  try {
    const {
      TSD_ENDPOINT,
      TSD_SENDER_ID,
      TSD_RECIPIENT_ID,
      TSD_TRADING_PARTNER_CODE,
      TSD_CUSTOMER_NUMBER,
      TSD_PASSCODE,
    } = process.env;

    // 1) Validar que existan todas las env vars
    if (
      !TSD_ENDPOINT ||
      !TSD_SENDER_ID ||
      !TSD_RECIPIENT_ID ||
      !TSD_TRADING_PARTNER_CODE ||
      !TSD_CUSTOMER_NUMBER ||
      !TSD_PASSCODE
    ) {
      console.error("Faltan variables de entorno para TSD");
      return res
        .status(500)
        .json({ error: "Configuración TSD incompleta en el servidor" });
    }

    // 2) Armar el XML (etiqueta <Dategmtime> tal como en los ejemplos)
    const xmlBody = `
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatDateTime(new Date())}</Dategmtime>
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
    <MessageID>REQLOC</MessageID>
    <MessageDesc>Request Locations</MessageDesc>
  </Message>
  <PayLoad></PayLoad>
</TRNXML>`.trim();

    // 3) Hacer la llamada a TSD
    const tsdRes = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });
    if (!tsdRes.ok) {
      console.error("TSD respondió con status", tsdRes.status);
      return res
        .status(tsdRes.status)
        .json({ error: `TSD error: ${tsdRes.status}` });
    }

    // 4) Parsear y extraer sólo el array de sucursales
    const text = await tsdRes.text();
    const data = await parseStringPromise(text, { explicitArray: false });
    const raw =
      data.TRNXML?.MessageResponse?.RentalLocations?.RentalLocation || [];
    const locations = Array.isArray(raw) ? raw : [raw];

    return res.status(200).json({ locations });
  } catch (err) {
    console.error("Error interno en /api/locations:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Función auxiliar (la de tu código original)
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
