// pages/api/webhook-success.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";

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
    mp_signature,
    mp_node,
    mp_concept,
  } = req.body;

  // 1) Verificar firma HMAC: order + reference + amount + authorization
  const secret = process.env.HMAC_SECRET;
  const payload = `${mp_order}${mp_reference}${mp_amount}${mp_authorization}`;
  const expected = CryptoJS.HmacSHA256(payload, secret).toString(
    CryptoJS.enc.Hex
  );
  if (expected !== mp_signature) {
    console.error("Firma inválida (success)", {
      expected,
      received: mp_signature,
    });
    return res.status(400).send("Invalid signature");
  }

  try {
    const { db } = await connectToDatabase();

    // 1) Verificar que la reserva existe
    const booking = await db.collection("bookings").findOne({ _id: mp_order });
    if (!booking) return res.status(404).send("Reserva no encontrada");

    // 2) Actualizar la reserva: marque como pagada
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
      console.error("❌ booking.searchData está vacío o no definido:", booking);
      return res.status(500).json({
        message: "La reserva no contiene datos de búsqueda para TSD",
        booking,
      });
    }

    if (!booking.confirmNum) {
      const tsdBody = {
        pickupLocationId: booking.search.pickupLocation.id,
        returnLocationId: booking.search.returnLocation.id,
        pickupDate: booking.search.pickupDate,
        pickupTime: booking.search.pickupTime,
        returnDate: booking.search.returnDate,
        returnTime: booking.search.returnTime,
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

      const tsdRes = await fetch(
        `https://cardeal-beige.vercel.app/api/bookings/registerReservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tsdBody),
        }
      );

      const responseText = await tsdRes.text();

      try {
        const tsdJson = JSON.parse(responseText);
        const confirmNum = tsdJson?.PRE?.TRNXML?.PayLoad?.ConfirmNum || null;

        if (confirmNum) {
          await db
            .collection("bookings")
            .updateOne({ _id: mp_order }, { $set: { confirmNum } });
          console.log("✅ confirmNum guardado:", confirmNum);
        } else {
          console.error(
            "⚠️ TSD no devolvió confirmNum. JSON recibido:",
            tsdJson
          );
        }
      } catch (err) {
        console.error("❌ Error al parsear respuesta TSD:", err);
        console.error("🔍 Respuesta TSD sin parsear:", responseText);
      }
    }

    return res.redirect(
      302,
      `https://cardeal-beige.vercel.app/confirm/${mp_order}`
    );
  } catch (err) {
    console.error("Error actualizando reserva (success):", err);
    return res.status(500).send("Error interno");
  }
}
