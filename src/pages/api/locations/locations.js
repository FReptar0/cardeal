// pages/api/locations.js
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
  <PayLoad>
    <!-- BusinessHours=1 para incluir horarios -->
    <BusinessHours>1</BusinessHours>
  </PayLoad>
</TRNXML>`.trim();

  try {
    const tsdRes = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });
    const text = await tsdRes.text();
    const json = await parseStringPromise(text, {
      explicitArray: false,
      ignoreAttrs: true,
    });
    // en json.TRNXML.PayLoad.RentalLocation puede venir array o un solo objeto
    let locations = json.TRNXML.PayLoad.RentalLocation || [];
    if (!Array.isArray(locations)) locations = [locations];
    res.status(200).json({ locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar TSD" });
  }
}
