// pages/api/webhook-success.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";
import { logEvent } from "@/utils/logger";
import { encryptId } from "@/utils/encryption";

async function validateBookingExists(db, mp_order, res) {
  const booking = await db.collection("bookings").findOne({ _id: mp_order });
  if (!booking) {
    console.error("❌ Reserva no encontrada con ID:", mp_order);
    return res.status(404).send("Reserva no encontrada");
  }
  return booking;
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
          },
        }
      );

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

      const tsdRes = await fetch(
        `https://cardeal-beige.vercel.app/api/bookings/registerReservation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tsdBody),
        }
      );

      const tsdJson = await tsdRes.json();
      console.log(
        "Respuesta completa de TSD:",
        JSON.stringify(tsdJson, null, 2)
      );

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
      } else {
        console.warn("TSD no devolvió confirmNum. XML parseado:", tsdJson);
        await logEvent({
          webhook: "success",
          type: "internal_error",
          mp_order,
          payload: req.body,
          message: "Error interno al procesar el webhook",
          details: { error: "TSD no devolvió confirmNum" },
        });
      }
    }

    const encryptedId = encryptId(mp_order);
    const redirectUrl = `https://cardeal-beige.vercel.app/confirm/${encryptedId}`;

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
