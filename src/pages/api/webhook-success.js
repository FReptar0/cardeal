// pages/api/webhook-success.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";
import { logEvent } from "@/utils/logger";
import { encryptId } from "@/utils/encryption";
import { sendEmail } from "@/utils/sendEmail";

async function validateBookingExists(db, mp_order, res) {
  const booking = await db.collection("bookings").findOne({ _id: mp_order });
  if (!booking) {
    console.error("❌ Reserva no encontrada con ID:", mp_order);
    return res.status(404).send("Reserva no encontrada");
  }
  return booking;
}

async function sendReservationEmail(booking, stage, baseUrl) {
  try {
    if (!booking.contact?.email) {
      console.warn('⚠️ No se puede enviar email: email no encontrado en la reserva');
      return false;
    }

    const encryptedId = encryptId(booking._id);
    const reservationUrl = `${baseUrl}/confirm/${encryptedId}`;
    
    const emailData = {
      url: reservationUrl,
      userName: booking.contact?.fullName || 'Cliente',
      reservationId: booking.tsdConfirmNum || booking._id,
      stage: stage,
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

    console.log('✅ Email de reserva enviado exitosamente a:', booking.contact.email);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de reserva:', error);
    return false;
  }
}

async function sendPaymentFailureEmail(booking, baseUrl, failureReason) {
  try {
    if (!booking.contact?.email) {
      console.warn('⚠️ No se puede enviar email: email no encontrado en la reserva');
      return false;
    }

    const encryptedId = encryptId(booking._id);
    const alternativePaymentUrl = null; // Retry functionality disabled
    const supportUrl = `${baseUrl}/atencion-cliente`;
    
    const emailData = {
      userName: booking.contact?.fullName || 'Cliente',
      reservationId: booking._id,
      carInfo: {
        name: booking.car?.name || 'Vehículo seleccionado',
        category: booking.car?.category || 'Categoría estándar'
      },
      paymentAmount: booking.totalWithIva || booking.total || 0,
      paymentError: failureReason || 'Error en el procesamiento del pago',
      alternativePaymentUrl: alternativePaymentUrl,
      supportUrl: supportUrl
    };

    await sendEmail({
      to: booking.contact.email,
      templateId: 'payment-failure',
      data: emailData
    });

    console.log('✅ Email de fallo de pago enviado exitosamente a:', booking.contact.email);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de fallo de pago:', error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.warn("Método no permitido:", req.method);
    res.setHeader("Allow", "POST");
    return res.status(405).send("Método no permitido");
  }

  const {
    mp_order,
    mp_reference,
    mp_amount,
    mp_authorization,
    mp_signature,
    mp_node,
    mp_concept,
  } = req.body;

  const secret = process.env.HMAC_SECRET;
  const payload = `${mp_order}${mp_reference}${mp_amount}${mp_authorization}`;
  const expected = CryptoJS.HmacSHA256(payload, secret).toString(
    CryptoJS.enc.Hex
  );

  if (expected !== mp_signature) {
    console.error("❌ Firma inválida (success)", {
      expected,
      received: mp_signature,
    });

    await logEvent({
      webhook: "success",
      type: "invalid_signature",
      mp_order,
      payload: req.body,
      message: "Firma inválida",
      details: { expected, received: mp_signature },
    });

    return res.status(400).send("Invalid signature");
  }

  // Validación de aprobación bancaria
  const invalidAuth =
    mp_authorization === null ||
    mp_authorization === undefined ||
    mp_authorization === "" ||
    mp_authorization === "0" ||
    mp_authorization === 0 ||
    /^0+$/.test(mp_authorization);

  if (invalidAuth) {
    console.error(
      "❌ Pago NO aprobado por el banco. mp_authorization inválido:",
      mp_authorization
    );

    await logEvent({
      webhook: "success",
      type: "invalid_auth",
      mp_order,
      payload: req.body,
      message: "Autorización bancaria inválida",
      details: { mp_authorization },
    });

    try {
      const { db } = await connectToDatabase();

      const booking = await validateBookingExists(db, mp_order, res);
      if (!booking) return;

      await db.collection("bookings").updateOne(
        { _id: mp_order },
        {
          $set: {
            paid: false,
            status: "FAILED",
            failureReason: `Autorización inválida: ${mp_authorization}`,
            node: mp_node,
            concept: mp_concept,
            updatedAt: new Date(),
            emailSent: false
          },
        }
      );

      // Send payment failure email if not already sent
      if (!booking.emailSent) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        const emailSent = await sendPaymentFailureEmail(
          booking, 
          baseUrl, 
          `Autorización bancaria inválida: ${mp_authorization}`
        );
        
        if (emailSent) {
          await db.collection("bookings").updateOne(
            { _id: mp_order },
            {
              $set: {
                emailSent: true,
                emailSentAt: new Date(),
                emailType: 'payment-failure',
                emailStage: 'online-failed'
              }
            }
          );
        }
      }

      return res
        .status(402)
        .json({ error: "Pago no aprobado por el banco", mp_authorization });
    } catch (err) {
      console.error("Error actualizando booking tras invalidAuth:", err);
      return res.status(500).send("Error interno");
    }
  }

  try {
    const { db } = await connectToDatabase();

    const booking = await validateBookingExists(db, mp_order, res);
    if (!booking) return;

    let confirmNum = null;

    await db.collection("bookings").updateOne(
      { _id: mp_order },
      {
        $set: {
          paid: true,
          status: "PAID",
          authorization: mp_authorization,
          node: mp_node,
          concept: mp_concept,
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (!booking.search) {
      console.error("❌ booking.search está vacío o no definido:", booking);
      return res.status(500).json({
        message: "La reserva no contiene datos de búsqueda para TSD",
        booking,
      });
    }

    if (!booking.tsdConfirmNum) {
      const tsdBody = {
        pickupLocationId: booking.search.pickupLocation.id,
        returnLocationId: booking.search.returnLocation.id,
        pickupDateTime: `${booking.search.pickupDate} ${booking.search.pickupTime}`,
        returnDateTime: `${booking.search.returnDate} ${booking.search.returnTime}`,
        classCode: booking.car.abbreviation,
        renterFirst: booking.contact.fullName.split(" ")[0],
        renterLast: booking.contact.fullName.split(" ").slice(1).join(" "),
        extrasCodes: booking.extras.map((e) => ({
          id: e.id,
          cantidad: e.cantidad,
        })),
        insuranceCode: booking.insurance?.code || "",
        rateId: booking.car?.rateId || "",
      };

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      const tsdRes = await fetch(
        `${baseUrl}/api/bookings/registerReservation`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-webhook-call": "true" // Identify this as a webhook call
          },
          body: JSON.stringify(tsdBody),
        }
      );

      const tsdJson = await tsdRes.json();

      const msg = tsdJson?.PRE?.TRNXML?.Message || {};
      if (msg.MessageID === "RSPERR") {
        console.error("TSD respondió error:", msg.MessageDescription);
        return res.status(400).json({ error: msg.MessageDescription });
      }

      const confirmNum = tsdJson?.PRE?.TRNXML?.ConfirmNum || null;

      if (confirmNum) {
        await db
          .collection("bookings")
          .updateOne(
            { _id: mp_order },
            { $set: { tsdConfirmNum: confirmNum } }
          );
          
        await logEvent({
          webhook: "success",
          type: "success",
          mp_order,
          payload: req.body,
          message: "Pago registrado correctamente",
          details: {
            tsdConfirmNum: confirmNum,
          },
        });
        
        // Send reservation confirmation email if not already sent
        if (!booking.emailSent) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
          const updatedBooking = { ...booking, tsdConfirmNum: confirmNum };
          const emailSent = await sendReservationEmail(updatedBooking, 'online', baseUrl);
          
          if (emailSent) {
            await db.collection("bookings").updateOne(
              { _id: mp_order },
              {
                $set: {
                  emailSent: true,
                  emailSentAt: new Date(),
                  emailType: 'reservation-success',
                  emailStage: 'online'
                }
              }
            );
          }
        }
      } else {
        await logEvent({
          webhook: "success",
          type: "internal_error",
          mp_order,
          payload: req.body,
          message: "Error interno al procesar el webhook",
          details: { error: "TSD no devolvió confirmNum" },
        });
        
        // Even without confirmNum, send email with booking ID
        if (!booking.emailSent) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
          const emailSent = await sendReservationEmail(booking, 'online', baseUrl);
          
          if (emailSent) {
            await db.collection("bookings").updateOne(
              { _id: mp_order },
              {
                $set: {
                  emailSent: true,
                  emailSentAt: new Date(),
                  emailType: 'reservation-success',
                  emailStage: 'online'
                }
              }
            );
          }
        }
      }
    }

    const encryptedId = encryptId(mp_order);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/confirm/${encryptedId}`;

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("Error inesperado en webhook-success:", err);
    await logEvent({
      webhook: "success",
      type: "internal_error",
      mp_order,
      payload: req.body,
      message: "Error interno al procesar el webhook",
      details: { error: err.message },
    });
    return res.status(500).send("Error interno");
  }
}
