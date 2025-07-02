import { sendEmail } from '@/utils/sendEmail';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { nombre, email, telefono, nombreEmpresa, rfc, mensaje } = req.body;

    if (!nombre || !email || !telefono || !nombreEmpresa) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        await sendEmail({
            to: process.env.GMAIL_SENDER_EMAIL.replace('@', '+crm@'),
            templateId: 'crm-contact',
            data: { nombre, email, telefono, nombreEmpresa, rfc, mensaje },
        });
        return res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Error enviando correo' });
    }
}
