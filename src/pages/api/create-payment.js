// pages/api/create-payment.js
import CryptoJS from 'crypto-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const {
        order,
        reference,
        amount,
        node,
        concept
    } = req.body;

    if (
        !order ||
        !reference ||
        !amount ||
        !node ||
        !concept
    ) {
        return res.status(400).json({ message: 'Faltan parámetros para crear el pago' });
    }

    // Parámetros de configuración desde .env
    const account = process.env.MP_ACCOUNT;
    const product = process.env.MP_PRODUCT;
    const secret = process.env.HMAC_SECRET;
    const endpoint = process.env.MP_ENDPOINT;
    const urlSuccess = process.env.MP_URL_SUCCESS;
    const urlFailure = process.env.MP_URL_FAILURE;

    // 1) Generar la firma HMAC SHA256 sobre mp_order + mp_reference + mp_amount
    const payload = `${order}${reference}${amount}`;
    const signature = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);

    // 2) Construir la respuesta con action y fields
    return res.status(200).json({
        action: endpoint,
        fields: {
            mp_account: account,
            mp_product: product,
            mp_order: order,
            mp_reference: reference,
            mp_amount: amount,
            mp_currency: '1',
            mp_node: node,
            mp_concept: concept,
            mp_signature: signature,
            mp_urlsuccess: urlSuccess,
            mp_urlfailure: urlFailure
        }
    });
}
