// pages/api/webhook-failure.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";
import { encryptId } from "@/utils/encryption";
import { logEvent } from "@/utils/logger";
import { sendEmail } from "@/utils/sendEmail";

async function sendPaymentFailureEmail(booking, baseUrl, failureReason) {
  try {
    console.log('🔍 Debugging payment failure email data:', {
      bookingId: booking._id,
      hasContact: !!booking.contact,
      contactEmail: booking.contact?.email,
      userName: booking.contact?.fullName,
      carName: booking.car?.name,
      totalAmount: booking.totalWithIva || booking.total
    });
    
    if (!booking.contact?.email) {
      console.warn('⚠️ No se puede enviar email: email no encontrado en la reserva', {
        bookingId: booking._id,
        contact: booking.contact
      });
      return false;
    }

    const encryptedId = encryptId(booking._id);
    const alternativePaymentUrl = `${baseUrl}/payment/retry/${encryptedId}`;
    const supportUrl = `${baseUrl}/atencion-cliente`;
    
    const emailData = {
      userName: booking.contact?.fullName || 'Cliente',
      reservationId: booking._id,
      carInfo: {
        name: booking.car?.name || 'Vehículo seleccionado',
        category: booking.car?.category || 'Categoría estándar'
      },
      paymentAmount: Number(booking.totalWithIva || booking.total || 0),
      paymentError: failureReason || 'Error en el procesamiento del pago',
      alternativePaymentUrl: alternativePaymentUrl,
      supportUrl: supportUrl
    };

    console.log('📧 Sending payment failure email with data:', {
      to: booking.contact.email,
      templateId: 'payment-failure',
      alternativePaymentUrl,
      paymentAmount: emailData.paymentAmount
    });

    await sendEmail({
      to: booking.contact.email,
      templateId: 'payment-failure',
      data: emailData
    });

    console.log('✅ Email de fallo de pago enviado exitosamente a:', booking.contact.email);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de fallo de pago:', {
      error: error.message,
      stack: error.stack,
      bookingId: booking._id,
      contactEmail: booking.contact?.email
    });
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Método no permitido");
  }

  const {
    mp_order,
    mp_reference,
    mp_amount,
    mp_authorization,
    mp_response,
    mp_signature,
    mp_node,
    mp_concept,
  } = req.body;

  // 1) Verificar firma HMAC
  const secret = process.env.HMAC_SECRET;
  const payload = `${mp_order}${mp_reference}${mp_amount}${mp_authorization}`;
  const expected = CryptoJS.HmacSHA256(payload, secret).toString(
    CryptoJS.enc.Hex
  );

  if (expected !== mp_signature) {
    console.error("❌ Firma inválida (failure)", {
      expected,
      received: mp_signature,
    });
    await logEvent({
      webhook: "failure",
      type: "invalid_signature",
      mp_order,
      payload: req.body,
      message: "Firma inválida",
      details: { expected, received: mp_signature },
    });
    return res.status(400).send("Invalid signature");
  }

  const invalidAuth =
    mp_authorization === null ||
    mp_authorization === undefined ||
    mp_authorization === "" ||
    mp_authorization === "0" ||
    mp_authorization === 0 ||
    /^0+$/.test(mp_authorization);

  if (invalidAuth) {
    console.error(
      "Pago NO aprobado por el banco (failure). mp_authorization inválido:",
      mp_authorization
    );
    await logEvent({
      webhook: "failure",
      type: "invalid_auth",
      mp_order,
      payload: req.body,
      message: "Autorización bancaria inválida",
      details: { mp_authorization },
    });
    return res
      .status(402)
      .json({ error: "Pago no aprobado por el banco", mp_authorization });
  }

  try {
    const { db } = await connectToDatabase();
    
    // First, get the booking before updating it
    const booking = await db.collection("bookings").findOne({ _id: mp_order });
    
    if (!booking) {
      console.warn("⚠️ No se encontró la reserva con ID:", mp_order);
      await logEvent({
        webhook: "failure",
        type: "booking_not_found",
        mp_order,
        payload: req.body,
        message: "Reserva no encontrada",
        details: {},
      });
      return res.status(404).send("Reserva no encontrada");
    }
    
    console.log(`✅ Booking found for failure processing:`, {
      id: booking._id,
      hasContact: !!booking.contact,
      contactEmail: booking.contact?.email,
      status: booking.status,
      emailSent: booking.emailSent
    });

    const result = await db.collection("bookings").updateOne(
      { _id: mp_order },
      {
        $set: {
          paid: false,
          status: "FAILED",
          failureReason: mp_response || `Autorización inválida: ${mp_authorization}`,
          node: mp_node,
          concept: mp_concept,
          updatedAt: new Date(),
          emailSent: false, // Reset email status for potential retry
        },
      }
    );

    // Send payment failure email
    console.log(`📧 Processing payment failure email for booking ${mp_order}`);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const emailSent = await sendPaymentFailureEmail(
      booking, 
      baseUrl, 
      mp_response || `Autorización bancaria inválida: ${mp_authorization}`
    );
    
    if (emailSent) {
      console.log(`✅ Payment failure email sent successfully for booking ${mp_order}`);
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
    } else {
      console.log(`❌ Failed to send payment failure email for booking ${mp_order}`);
    }

    await logEvent({
      webhook: "failure",
      type: "failure_handled",
      mp_order,
      payload: req.body,
      message: "Reserva marcada como FAILED correctamente",
      details: {},
    });

    const encryptedId = encryptId(mp_order);
    const redirectUrl = `${baseUrl}/confirm/${encryptedId}`;

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("❌ Error actualizando reserva (failure):", err);

    await logEvent({
      webhook: "failure",
      type: "internal_error",
      mp_order,
      payload: req.body,
      message: "Error interno al actualizar reserva",
      details: { error: err.message },
    });
    return res.status(500).send("Error interno");
  }
}
