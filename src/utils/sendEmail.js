import { getEmailData } from '@/emails/templateResolver';
import * as nodeMailer from 'nodemailer';

export async function sendEmail({ to, templateId, data }) {
    if (!to || !templateId || !data) {
        throw new Error('Faltan parámetros: to, templateId o data');
    }

    let responseGetEmailData;
    try {
        responseGetEmailData = getEmailData(templateId, data);
    } catch (error) {
        console.error('Error al obtener la plantilla de email:', error);
        throw new Error('Plantilla de email no encontrada: ' + error.message);
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

    try {
        const info = await transport.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error al enviar el email:', error);
        throw new Error('Error al enviar el email: ' + error.message);
    }
}
