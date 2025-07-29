// pages/api/payment/convert-to-counter.js
import { connectToDatabase } from "@/utils/mongodb";
import { decryptId } from "@/utils/encryption";
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

    // Validate that booking can be converted
    if (booking.status === "PAID") {
      return res.status(400).json({ 
        message: "Esta reserva ya ha sido pagada",
        currentStatus: booking.status
      });
    }

    if (!booking.paidOnline) {
      return res.status(400).json({ 
        message: "Esta reserva ya está configurada para pago en mostrador" 
      });
    }

    // Convert to counter payment
    const updateResult = await db.collection("bookings").updateOne(
      { _id: bookingId },
      {
        $set: {
          paidOnline: false,
          status: "PENDING",
          paid: false,
          convertedToCounter: true,
          convertedAt: new Date(),
          updatedAt: new Date(),
        },
        $unset: {
          failureReason: "",
          authorization: "",
          node: "",
          concept: ""
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ 
        message: "No se pudo actualizar la reserva" 
      });
    }

    // Log conversion
    await logEvent({
      webhook: "payment-conversion",
      type: "converted_to_counter",
      mp_order: bookingId,
      payload: req.body,
      message: "Reserva convertida a pago en mostrador",
      details: {
        originalStatus: booking.status,
        originalPaidOnline: booking.paidOnline
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reserva convertida exitosamente a pago en mostrador",
      booking: {
        id: bookingId,
        status: "PENDING",
        paidOnline: false,
        convertedToCounter: true
      }
    });

  } catch (error) {
    console.error("Error convirtiendo a pago en mostrador:", error);
    
    await logEvent({
      webhook: "payment-conversion",
      type: "conversion_error",
      payload: req.body,
      message: "Error al convertir a pago en mostrador",
      details: { error: error.message },
    });

    return res.status(500).json({ 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
}