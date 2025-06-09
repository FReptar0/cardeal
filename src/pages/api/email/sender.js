import * as nodeMailer from 'nodemailer';
export default async function handler(req, res) {

    try {
        const { to, subject, text, html } = req.body;

        if (req.method !== 'POST')
            return res.status(405).json({ message: 'Método no permitido' });

        if (!to || !subject || !text || !templateId || !data)
            return res.status(400).json({ message: 'Faltan parámetros: to, subject, text o html' });

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
            subject,
            text,
            html
        };

        const info = await transport.sendMail(mailOptions);
        console.log('Email enviado:', info.response);
        return res.status(200).json({ message: 'Email enviado correctamente', info });
    } catch (error) {
        console.error('Error al enviar el email:', error);
        return res.status(500).json({ message: 'Error al enviar el email', error: error.message });
    }

}