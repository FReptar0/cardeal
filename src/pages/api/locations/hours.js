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
  const locationId = req.body?.locationId;
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
      <MessageDesc>Request Location</MessageDesc>
    </Message>
    <Payload>
      <RentalLocationID>${locationId}</RentalLocationID>
      <BusinessHours>1</BusinessHours>
    </Payload>
  </TRNXML>
  `;

  try {
    // console.log("XML BODY QUE SE ENVÍA A TSD >>>", xmlBody);

    const response = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlBody,
    });

    const xml = await response.text();
    const json = await parseStringPromise(xml, { explicitArray: false });

    const hours = json?.PRE?.TRNXML?.Payload?.RentalLocation?.BusinessHours;
    console.log("BusinessHours:", hours);
    //console.log("JSON completo:", JSON.stringify(json, null, 2));

    res.status(200).json(hours || {});
  } catch (error) {
    console.error("Error al consultar horarios:", error);
    res.status(500).json({ error: "No se pudo obtener horarios" });
  }
}
