// pages/api/registerReservation.js
import { parseStringPromise } from "xml2js";
import { connectToDatabase } from "@/utils/mongodb";
import { sendEmail } from "@/utils/sendEmail";
import { encryptId } from "@/utils/encryption";
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

async function sendCounterReservationEmail(bookingData, tsdResponse) {
  try {
    const { db } = await connectToDatabase();
    
    // Try to find the booking by various identifiers
    let booking = null;
    if (bookingData.bookingId) {
      booking = await db.collection("bookings").findOne({ _id: bookingData.bookingId });
    }
    
    if (!booking && bookingData.renterFirst && bookingData.renterLast) {
      // Fallback: search by name and recent date
      const fullName = `${bookingData.renterFirst} ${bookingData.renterLast}`;
      booking = await db.collection("bookings").findOne({
        "contact.fullName": fullName,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
      });
    }
    
    if (!booking) {
      console.warn('⚠️ No se encontró la reserva para enviar email de mostrador');
      return;
    }
    
    if (booking.emailSent) {
      console.log('📧 Email ya enviado para esta reserva, saltando...');
      return;
    }
    
    if (!booking.contact?.email) {
      console.warn('⚠️ No se puede enviar email: email no encontrado en la reserva');
      return;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const encryptedId = encryptId(booking._id);
    const reservationUrl = `${baseUrl}/confirm/${encryptedId}`;
    const confirmNum = tsdResponse?.PRE?.TRNXML?.ConfirmNum;
    
    const emailData = {
      url: reservationUrl,
      userName: booking.contact?.fullName || 'Cliente',
      reservationId: confirmNum || booking._id,
      stage: 'counter',
      carInfo: {
        name: booking.car?.name || 'Vehículo seleccionado',
        category: booking.car?.category || 'Categoría estándar'
      },
      rentalDates: {
        pickup: `${booking.search?.pickupDate} ${booking.search?.pickupTime}`,
        return: `${booking.search?.returnDate} ${booking.search?.returnTime}`
      },
      locationInfo: {
        pickup: booking.search?.pickupLocation?.name || 'Ubicación de recogida',
        return: booking.search?.returnLocation?.name || 'Ubicación de devolución'
      },
      totalAmount: booking.totalWithIva || booking.total || 0
    };

    await sendEmail({
      to: booking.contact.email,
      templateId: 'reservation-info',
      data: emailData
    });

    // Update booking to mark email as sent
    await db.collection("bookings").updateOne(
      { _id: booking._id },
      {
        $set: {
          emailSent: true,
          emailSentAt: new Date(),
          emailType: 'reservation-success',
          emailStage: 'counter',
          tsdConfirmNum: confirmNum // Update with TSD confirmation if available
        }
      }
    );

    console.log('✅ Email de reserva en mostrador enviado exitosamente a:', booking.contact.email);
  } catch (error) {
    console.error('❌ Error enviando email de reserva en mostrador:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  const endpoint = process.env.TSD_ENDPOINT;
  const {
    TSD_SENDER_ID,
    TSD_RECIPIENT_ID,
    TSD_TRADING_PARTNER_CODE,
    TSD_CUSTOMER_NUMBER,
    TSD_PASSCODE,
  } = process.env;

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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    const xml = await response.text();

    const json = await parseStringPromise(xml, { explicitArray: false });

    const msg = json?.PRE?.TRNXML?.Message || {};
    if (msg.MessageID === "RSPERR") {
      console.error("❌ TSD respondió error:", msg.MessageDescription);
      return res.status(400).json({ error: msg.MessageDescription });
    }

    // Check if this is being called from webhook (has booking context)
    const isFromWebhook = req.headers['x-webhook-call'] === 'true';
    
    if (!isFromWebhook) {
      // This is a direct counter reservation, send email
      try {
        await sendCounterReservationEmail(req.body, json);
      } catch (emailError) {
        console.error('⚠️ Error enviando email para reserva en mostrador:', emailError);
        // Don't fail the reservation if email fails
      }
    }
    
    return res.status(200).json(json);
  } catch (error) {
    console.error("❌ Error al registrar reserva:", error);
    return res.status(500).json({ error: "No se pudo registrar la reserva" });
  }
}
