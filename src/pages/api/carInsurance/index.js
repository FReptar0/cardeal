// File: /pages/api/carInsurance/index.js

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
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    pickupLocationId,
    returnLocationId,
    pickupDateTime,
    returnDateTime,
    classCode: classCodeRaw,
  } = req.body;

  console.log("📥 [carInsurance] Parámetros recibidos:", {
    pickupLocationId,
    returnLocationId,
    pickupDateTime,
    returnDateTime,
    classCodeRaw,
  });

  if (
    !pickupLocationId ||
    !returnLocationId ||
    !pickupDateTime ||
    !returnDateTime ||
    !classCodeRaw
  ) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros en el body de la petición" });
  }

  // Normalizamos classCode a mayúsculas y sin espacios al principio/final
  const classCode = classCodeRaw.trim().toUpperCase();
  console.log("🔧 [carInsurance] classCode normalizado:", classCode);

  const {
    TSD_ENDPOINT,
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

  if (
    !TSD_ENDPOINT ||
    !TSD_SENDER_ID ||
    !TSD_RECIPIENT_ID ||
    !TSD_TRADING_PARTNER_CODE ||
    !TSD_CUSTOMER_NUMBER ||
    !TSD_PASSCODE
  ) {
    console.error(
      "❌ [carInsurance] Variables de entorno de TSD no configuradas"
    );
    return res
      .status(500)
      .json({ error: "Variables de entorno de TSD no configuradas" });
  }

  // Determinamos si es SUV basado en SFAR o FFAR
  const esSUV = classCode === "SFAR" || classCode === "FFAR";
  console.log("🔧 [carInsurance] ¿Es SUV? ->", esSUV);

  const proteccionesCatalogo = esSUV
    ? [
        { codeExtras: "CDW 2 SUV" },
        { codeExtras: "CDW SUV" },
        { codeExtras: "PDW SUV" },
      ]
    : [{ codeExtras: "CDW2" }, { codeExtras: "CDW" }, { codeExtras: "PDW" }];
  console.log(
    "🔧 [carInsurance] proteccionesCatalogo utilizadas:",
    proteccionesCatalogo
  );

  // Formateamos fechas para TSD
  const formattedPickup = formatCustomDateTime(pickupDateTime);
  const formattedReturn = formatCustomDateTime(returnDateTime);
  console.log("🗓️ [carInsurance] Fechas formateadas:", {
    formattedPickup,
    formattedReturn,
  });

  // Construimos XML
  const extraCodesXML = proteccionesCatalogo
    .map((e) => `    <ExtraCode>${e.codeExtras}</ExtraCode>`)
    .join("\n");

  const xmlBody = `
<TRNXML Version="1.0.0">
  <Dategmtime TimeZone="UTC">${formatDateTimeForTSD(new Date())}</Dategmtime>
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
</TRNXML>
  `.trim();

  console.log("📤 [carInsurance] XML Body enviado a TSD:\n", xmlBody);

  try {
    const response = await fetch(TSD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        "❌ [carInsurance] TSD devolvió status:",
        response.status,
        "Response text:",
        text
      );
      return res
        .status(502)
        .json({ error: "Error al comunicarse con TSD", detail: text });
    }

    const xml = await response.text();
    console.log("📨 [carInsurance] Respuesta bruta (XML) de TSD:\n", xml);

    const json = await parseStringPromise(xml, { explicitArray: false });
    console.log(
      "🔍 [carInsurance] Respuesta parseada (JSON) de TSD:\n",
      JSON.stringify(json, null, 2)
    );

    const dailyExtras =
      json?.PRE?.TRNXML?.Payload?.RateProduct?.TotalPricing?.DailyExtra;

    if (!dailyExtras) {
      console.warn(
        "⚠️ [carInsurance] No se encontraron extras en la respuesta."
      );
      return res.status(200).json([]);
    }

    const extrasArray = Array.isArray(dailyExtras)
      ? dailyExtras
      : [dailyExtras];

    const result = extrasArray.map((extra) => ({
      codeExtras: extra.ExtraCode,
      precioTotal: parseFloat(extra.ExtraAmount),
    }));

    console.log("✅ [carInsurance] Resultado final a retornar:\n", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ [carInsurance] Error interno al procesar:", error);
    return res
      .status(500)
      .json({ error: "Error interno al procesar la solicitud" });
  }
}
