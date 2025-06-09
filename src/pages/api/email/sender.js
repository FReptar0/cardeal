import { getEmailData } from '@/emails/templateResolver';
import * as nodeMailer from 'nodemailer';
export default async function handler(req, res) {

    try {
        const { to, templateId, data } = req.body;

        let responseGetEmailData

        if (req.method !== 'POST')
            return res.status(405).json({ message: 'Método no permitido' });

        if (!to || !templateId || !data)
            return res.status(400).json({ message: 'Faltan parámetros: to, templateId o data' });


        try {
            responseGetEmailData = getEmailData(templateId, data);
        } catch (error) {
            console.error('Error al obtener la plantilla de email:', error);
            return res.status(400).json({ message: 'Plantilla de email no encontrada', error: error.message });
        }

        const transport = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_SENDER_EMAIL,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_SECRET_CLIENT,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_SENDER_EMAIL,
            to,
            subject: responseGetEmailData.subject,
            html: responseGetEmailData.template,
        };

        const info = await transport.sendMail(mailOptions);
        console.log('Email enviado:', info.response);
        return res.status(200).json({ message: 'Email enviado correctamente', info });
    } catch (error) {
        console.error('Error al enviar el email:', error);
        return res.status(500).json({ message: 'Error al enviar el email', error: error.message });
    }

}