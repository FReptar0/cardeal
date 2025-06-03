// pages/api/webhook-failure.js
import { connectToDatabase } from "@/utils/mongodb";
import CryptoJS from "crypto-js";
import { encryptId } from "@/utils/encryption";

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
    return res
      .status(402)
      .json({ error: "Pago no aprobado por el banco", mp_authorization });
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

    if (result.matchedCount === 0) {
      console.warn("⚠️ No se encontró la reserva con ID:", mp_order);
      return res.status(404).send("Reserva no encontrada");
    }

    const encryptedId = encryptId(mp_order);
    const redirectUrl = `https://cardeal-beige.vercel.app/confirm/${encryptedId}`;

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error("❌ Error actualizando reserva (failure):", err);
    return res.status(500).send("Error interno");
  }
}
