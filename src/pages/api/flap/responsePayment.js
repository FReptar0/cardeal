// pages/api/flap/responsePayment.js
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const {
        mp_order,
        mp_reference,
        mp_amount,
        mp_authorization,
        mp_signature
    } = req.body;

    // verify signature: order + reference + amount + authorization
    const secret = process.env.HMAC_SECRET;
    const base = `${mp_order}${mp_reference}${mp_amount}${mp_authorization}`;
    const expected = CryptoJS.HmacSHA256(base, secret).toString(CryptoJS.enc.Hex);
    if (expected !== mp_signature) {
        console.error("Flap callback signature mismatch", { expected, got: mp_signature });
        return res.status(400).send("Invalid signature");
    }

    // TODO: update your booking/order in DB to 'paid'
    console.log("✅ Flap payment confirmed:", req.body);

    // respond OK so Flap knows you got it
    res.status(200).send("OK");
}
