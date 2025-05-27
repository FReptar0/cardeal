// pages/api/webhook-failure.js
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
    mp_response,
    mp_signature,
    mp_node,
    mp_concept,
  } = req.body;

  console.log("📥 Webhook de fallo recibido:", req.body);

  // 1) Verificar firma HMAC
  const secret = process.env.HMAC_SECRET;
  const payload = `${mp_order}${mp_reference}${mp_amount}${mp_response}`;
  const expected = CryptoJS.HmacSHA256(payload, secret).toString(
    CryptoJS.enc.Hex
  );

  if (expected !== mp_signature) {
    console.error("❌ Firma inválida (failure)", {
      expected,
      received: mp_signature,
    });
    return res.status(400).send("Invalid signature");
  }

  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("bookings").updateOne(
      { _id: mp_order },
      {
        $set: {
          paid: false,
          status: "FAILED",
          failureReason: mp_response,
          node: mp_node,
          concept: mp_concept,
          updatedAt: new Date(),
        },
      }
    );

    console.log("📦 Resultado de updateOne:", result);

    if (result.matchedCount === 0) {
      console.warn("⚠️ No se encontró la reserva con ID:", mp_order);
      return res.status(404).send("Reserva no encontrada");
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error actualizando reserva (failure):", err);
    return res.status(500).send("Error interno");
  }
}
