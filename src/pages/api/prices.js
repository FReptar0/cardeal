// pages/api/prices.js
import { parseStringPromise } from "xml2js";

function formatMxDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  const mexico = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );
  let h = mexico.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${pad(mexico.getMonth() + 1)}${pad(
    mexico.getDate()
  )}${mexico.getFullYear()} ${pad(h)}:${pad(mexico.getMinutes())} ${ampm}`;
}

export default async function handler(req, res) {
  const {
    pickupLocation,
    returnLocation,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
  } = req.query;

  // Formatea los payload dates en MMDDYYYY hh:mm AM/PM
  const makeDT = (dateStr, time) => {
    const d = new Date(dateStr);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(d.getMonth() + 1)}${pad(
      d.getDate()
    )}${d.getFullYear()} ${time}`;
  };

  const xmlPayload = `<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatMxDate(new Date())}</Dategmtime>
  <Sender><SenderID>${process.env.TSD_SENDER_ID}</SenderID></Sender>
  <Recipient><RecipientID>${
    process.env.TSD_RECIPIENT_ID
  }</RecipientID></Recipient>
  <TradingPartner><TradingPartnerCode>${
    process.env.TSD_TRADING_PARTNER_CODE
  }</TradingPartnerCode></TradingPartner>
  <Customer>
    <CustomerNumber>${process.env.TSD_CUSTOMER_NUMBER}</CustomerNumber>
    <Passcode>${process.env.TSD_PASSCODE}</Passcode>
  </Customer>
  <Message>
    <MessageID>REQRAT</MessageID>
    <MessageDesc>Request Rates</MessageDesc>
  </Message>
  <PayLoad>
    <RentalLocationID>${pickupLocation}</RentalLocationID>
    <ReturnLocationID>${returnLocation}</ReturnLocationID>
    <PickupDateTime>${makeDT(pickupDate, pickupTime)}</PickupDateTime>
    <ReturnDateTime>${makeDT(returnDate, returnTime)}</ReturnDateTime>
    <TotalPricing>1</TotalPricing>
  </PayLoad>
</TRNXML>`;

  // Llama al servicio TSD
  const tsdRes = await fetch(process.env.TSD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: xmlPayload,
  });
  const text = await tsdRes.text();

  // Parsea XML a JS
  const json = await parseStringPromise(text, { explicitArray: false });
  // Extrae RateProduct (puede variar la ruta según respuesta)
  const products = json.TRNXML?.Response?.RateProducts?.RateProduct || [];
  const list = Array.isArray(products) ? products : [products];

  // Mapea a un array de tarifas
  const rates = list.map((rp) => ({
    classCode: rp.ClassCode,
    rateAmount: parseFloat(rp.RateAmount),
    strickenRateAmount: rp.StrickenRateAmount
      ? parseFloat(rp.StrickenRateAmount)
      : null,
    totalCharges: rp.TotalPricing?.TotalCharges
      ? parseFloat(rp.TotalPricing.TotalCharges)
      : null,
  }));

  res.status(200).json(rates);
}
