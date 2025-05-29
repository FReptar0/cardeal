// pages/api/webhook-success.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.warn("⚠️ Método no permitido:", req.method);
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

  console.log("Webhook success received:", {
    mp_order,
    mp_reference,
    mp_amount,
    mp_authorization,
    mp_signature,
    mp_node,
    mp_concept,
  });

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
    return res.status(400).send("Invalid signature");
  }

  try {
    const { db } = await connectToDatabase();

    const booking = await db.collection("bookings").findOne({ _id: mp_order });
    if (!booking) {
      console.error("❌ Reserva no encontrada con ID:", mp_order);
      return res.status(404).send("Reserva no encontrada");
    }

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

      const tsdRes = await fetch(
        `https://cardeal-beige.vercel.app/api/bookings/registerReservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      } else {
        console.warn("TSD no devolvió confirmNum. XML parseado:", tsdJson);
      }
    }

    const redirectUrl = `https://cardeal-beige.vercel.app/confirm/${mp_order}`;

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("Error inesperado en webhook-success:", err);
    return res.status(500).send("Error interno");
  }
}
