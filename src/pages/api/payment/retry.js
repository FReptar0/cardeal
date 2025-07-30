// pages/api/payment/retry.js
import { connectToDatabase } from "@/utils/mongodb";
import { decryptId } from "@/utils/encryption";
import CryptoJS from "crypto-js";
import { logEvent } from "@/utils/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { encryptedBookingId } = req.body;
  
  if (!encryptedBookingId) {
    return res.status(400).json({ 
      message: "ID de reserva encriptado es requerido" 
    });
  }

  try {
    // Decrypt booking ID
    const bookingId = decryptId(encryptedBookingId);
    
    // Connect to database and find the booking
    const { db } = await connectToDatabase();
    const booking = await db.collection("bookings").findOne({ _id: bookingId });
    
    if (!booking) {
      return res.status(404).json({ 
        message: "Reserva no encontrada" 
      });
    }

    // Validate that booking is in a retryable state
    const retryableStatuses = ["FAILED", "PENDING", "PENDING_PAYMENT"];
    if (!retryableStatuses.includes(booking.status)) {
      return res.status(400).json({ 
        message: "Esta reserva no puede ser reintentada",
        currentStatus: booking.status,
        retryableStatuses
      });
    }

    if (!booking.paidOnline) {
      return res.status(400).json({ 
        message: "Esta reserva no requiere pago en línea" 
      });
    }

    // Check if booking is not too old (optional: prevent retry after X days)
    const maxRetryDays = 1; // Allow retry for 7 days
    const bookingAge = (new Date() - new Date(booking.createdAt)) / (1000 * 60 * 60 * 24);
    
    if (bookingAge > maxRetryDays) {
      return res.status(400).json({ 
        message: "Esta reserva es demasiado antigua para reintentar el pago",
        bookingAge: Math.floor(bookingAge)
      });
    }

    // Reset booking status for retry
    await db.collection("bookings").updateOne(
      { _id: bookingId },
      {
        $set: {
          status: "PENDING_PAYMENT",
          retryAttempts: (booking.retryAttempts || 0) + 1,
          lastRetryAt: new Date(),
          emailSent: false, // Allow email to be sent again after successful payment
        },
        $unset: {
          failureReason: ""
        }
      }
    );

    // Generate new payment data
    const account = process.env.MP_ACCOUNT;
    const product = process.env.MP_PRODUCT;
    const secret = process.env.HMAC_SECRET;
    const endpoint = process.env.MP_ENDPOINT;
    const urlSuccess = process.env.MP_URL_SUCCESS;
    const urlFailure = process.env.MP_URL_FAILURE;

    // Use original booking data
    const order = booking._id;
    const reference = booking.contact?.email || `user-${bookingId}`;
    const amount = booking.totalWithIva || booking.total;
    const node = "PSE"; // Or from original booking
    const concept = `Retry Payment - Rental ${booking.car?.name || 'Vehicle'}`;

    const payload = `${order}${reference}${amount}`;
    const signature = CryptoJS.HmacSHA256(payload, secret).toString(
      CryptoJS.enc.Hex
    );

    // Log retry attempt
    await logEvent({
      webhook: "payment-retry",
      type: "retry_attempt",
      mp_order: order,
      payload: {
        bookingId,
        retryAttempt: booking.retryAttempts || 1,
        amount,
        reference
      },
      message: "Intento de reintento de pago",
      details: {
        mp_signature: signature,
        mp_amount: amount,
        mp_reference: reference,
        mp_node: node,
        mp_concept: concept,
        originalFailureReason: booking.failureReason
      },
    });

    // Return payment form data
    return res.status(200).json({
      success: true,
      booking: {
        id: bookingId,
        car: booking.car,
        search: booking.search,
        contact: booking.contact,
        insurance: booking.insurance,
        extras: booking.extras,
        total: amount,
        retryAttempt: (booking.retryAttempts || 0) + 1
      },
      payment: {
        action: endpoint,
        fields: {
          mp_account: account,
          mp_product: product,
          mp_order: order,
          mp_reference: reference,
          mp_amount: amount,
          mp_currency: "1",
          mp_node: node,
          mp_concept: concept,
          mp_signature: signature,
          mp_urlsuccess: urlSuccess,
          mp_urlfailure: urlFailure,
        },
      }
    });

  } catch (error) {
    console.error("Error en retry de pago:", error);
    
    await logEvent({
      webhook: "payment-retry",
      type: "retry_error",
      payload: req.body,
      message: "Error al procesar reintento de pago",
      details: { error: error.message },
    });

    return res.status(500).json({ 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
}