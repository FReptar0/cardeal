// pages/api/tsdRates.js
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

  const { pickupLocationId, returnLocationId, pickupDateTime, returnDateTime } =
    req.body;

  // Las 5 categorías que vamos a pedir (pipe-delimited)
  const classCodes = ["ECAR", "FCAR", "FFAR", "SCAR", "SFAR"].join("|");

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
      <MessageID>REQRAT</MessageID>
      <MessageDesc>Request Rates</MessageDesc>
    </Message>
    <PayLoad>
      <RentalLocationID>${pickupLocationId}</RentalLocationID>
      <ReturnLocationID>${returnLocationId}</ReturnLocationID>
      <PickupDateTime>${pickupDateTime}</PickupDateTime>
      <ReturnDateTime>${returnDateTime}</ReturnDateTime>
      <ClassCode>${classCodes}</ClassCode>
    </PayLoad>
  </TRNXML>
  `;

  try {
    const response = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });
    const xml = await response.text();
    //console.log("Respuesta XML de TSD:", xml);
    const json = await parseStringPromise(xml, { explicitArray: false });

    // Extraemos los RateProduct (podría venir un solo objeto o array)
    let products = json?.PRE?.TRNXML?.Payload?.RateProduct || [];
    products = Array.isArray(products) ? products : [products];

    // console.log("RateProducts:", products);
    // Simplificamos a [{ category, baseRate, totalCharges }, …]
    const rates = products.map((rp) => ({
      category: rp.ClassCode,
      rateId: rp.RateID,
      baseRate: rp.RateAmount,
      totalCharges: rp.TotalPricing?.TotalCharges,
    }));

    res.status(200).json(rates);
  } catch (error) {
    console.error("Error al consumir REQRAT:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}
