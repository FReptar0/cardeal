// pages/api/tsdExtras.js
import { parseStringPromise } from "xml2js";

function formatDateTimeForTSD(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const pad = (n) => String(n).padStart(2, "0");
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const year = date.getUTCFullYear();
  let h = date.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const hours = pad(h);
  const minutes = pad(date.getUTCMinutes());
  return `${month}${day}${year} ${hours}:${minutes} ${ampm}`;
}

function formatCustomDateTime(inputString) {
  const noParens = inputString.replace(/\s*\([^)]*\)/g, "").trim();
  const timeMatch = noParens.match(/(\d{1,2}:\d{2}\s[AP]M)$/);
  const timePart = timeMatch ? timeMatch[1] : "";
  let dateStr = noParens
    .replace(/\s*GMT[+-]\d{4}/, "")
    .replace(/\s*\d{1,2}:\d{2}\s[AP]M$/, "")
    .trim();
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = date.getFullYear();
  return `${month}${day}${year} ${timePart}`;
}

export default async function handler(req, res) {
  console.log("🔁 Handler ejecutado - Inicio de /api/tsdExtras");

  const {
    pickupLocationId,
    returnLocationId,
    pickupDateTime,
    returnDateTime,
    classCode,
    allExtras = [],
  } = req.body;

  console.log("📦 Payload recibido:");
  console.log({ pickupLocationId, returnLocationId, pickupDateTime, returnDateTime, classCode, allExtras });

  const {
    TSD_ENDPOINT,
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

  console.log("🔐 Variables de entorno:");
  console.log({
    TSD_ENDPOINT,
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  });

  const formattedPickup = formatCustomDateTime(pickupDateTime);
  const formattedReturn = formatCustomDateTime(returnDateTime);

  console.log("🗓️ Fechas formateadas:");
  console.log({ formattedPickup, formattedReturn });

  const extraCodesXML = allExtras
    .map((e) => `<ExtraCode>${e.codeExtras}</ExtraCode>`)
    .join("\n");

  const xmlBody = `
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatDateTimeForTSD(new Date())}</Dategmtime>
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
    <PickupDateTime>${formattedPickup}</PickupDateTime>
    <ReturnDateTime>${formattedReturn}</ReturnDateTime>
    <ClassCode>${classCode}</ClassCode>
    ${extraCodesXML}
    <TotalPricing>1</TotalPricing>
  </PayLoad>
</TRNXML>`.trim();

  console.log("📤 XML generado:");
  console.log(xmlBody);

  try {
    console.log("⏳ Enviando solicitud a TSD...");
    const response = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    const xml = await response.text();
    console.log("📨 Respuesta XML recibida:");
    console.log(xml);

    const json = await parseStringPromise(xml, { explicitArray: false });
    console.log("🧾 JSON parseado:");
    console.dir(json, { depth: null });

    const dailyExtras =
      json?.PRE?.TRNXML?.Payload?.RateProduct?.TotalPricing?.DailyExtra;

    if (!dailyExtras) {
      console.warn("⚠️ No se encontraron extras en la respuesta.");
      return res.status(200).json([]);
    }

    const extras = Array.isArray(dailyExtras) ? dailyExtras : [dailyExtras];
    console.log("🎯 Extras encontrados:");
    console.log(extras);

    const result = extras
      .map((extra) => {
        const match = allExtras.find(
          (e) => e.codeExtras === extra.ExtraCode
        );
        if (!match) return null;
        return {
          id: match.id,
          nombre: match.nombre,
          descripcion: match.descripcion,
          imagen: match.imagen,
          precio: parseFloat(extra.ExtraAmount),
        };
      })
      .filter(Boolean);

    console.log("✅ Resultado final a retornar:");
    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener extras desde TSD" });
  }
}
