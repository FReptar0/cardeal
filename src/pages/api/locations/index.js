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
  const {
    TSD_ENDPOINT,
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

  const xmlBody = `
  <TRNXML Version="1.0.0">
    <Dategmtime TimeZone="UTC">${formatDateTime(new Date())}</Dategmtime>
    <Sender><SenderID>${TSD_SENDER_ID}</SenderID></Sender>
    <Recipient><RecipientID>${TSD_RECIPIENT_ID}</RecipientID></Recipient>
    <TradingPartner><TradingPartnerCode>${TSD_TRADING_PARTNER_CODE}</TradingPartnerCode></TradingPartner>
    <Customer>
      <CustomerNumber>${TSD_CUSTOMER_NUMBER}</CustomerNumber>
      <Passcode>${TSD_PASSCODE}</Passcode>
    </Customer>
    <Message>
      <MessageID>REQLOC</MessageID>
      <MessageDesc>Request Locations</MessageDesc>
    </Message>
    <Payload></Payload>
  </TRNXML>
  `;

  try {
    console.log("XML BODY QUE SE ENVÍA A TSD >>>", xmlBody);

    const response = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlBody,
    });

    const xml = await response.text();

    // Convertimos XML a JSON
    const json = await parseStringPromise(xml, { explicitArray: false });

    const locations = json?.PRE?.TRNXML?.Payload?.RentalLocation || [];

    const cleaned = Array.isArray(locations) ? locations : [locations];

    const simplified = cleaned.map((loc) => ({
      id: loc.RentalLocationID,
      nombre: loc.RentalLocationName,
      direccion: [
        loc.AddressLine1,
        loc.AddressLine2,
        loc.AddressCity,
        loc.AddressState,
        loc.AddressZipCode,
        loc.AddressCountryName,
      ]
        .filter(Boolean)
        .join(", "),
      ciudad: loc.AddressCity,
      estado: loc.AddressState,
      pais: loc.AddressCountryName,
      horario24h: {
        pickup: loc.Pickup24Hour === "YES",
        drop: loc.Drop24Hour === "YES",
      },
    }));

    res.status(200).json(simplified);
  } catch (error) {
    console.error("Error al consumir REQLOC:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}
