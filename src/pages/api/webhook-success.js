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
    const expected = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);
    if (expected !== mp_signature) {
        console.error("Firma inválida (success)", { expected, received: mp_signature });
        return res.status(400).send("Invalid signature");
    }

    try {
        const { db } = await connectToDatabase();

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

        return res.status(200).send("OK");
    } catch (err) {
        console.error("Error actualizando reserva (success):", err);
        return res.status(500).send("Error interno");
    }
}
