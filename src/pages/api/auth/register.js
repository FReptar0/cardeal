import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import { generateUuid } from '@/utils/uuid';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { fullName, phone, email, password, birthDate, location } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const { db } = await connectToDatabase();

        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            _id: generateUuid(),
            fullName,
            phone,
            email,
            password: hashedPassword,
            birthDate,
            location,
            position: '',
            bio: '',
            profilePicture: '',
            userType: 'user', 
            avatar: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            isActive: true,
            isVerified: false,
            lastVerificationEmailSent: new Date(),
        };

        await db.collection('users').insertOne(newUser);

        // Enviar email de verificación directamente desde backend
        try {
            const { sendEmail } = await import('@/utils/sendEmail');
            await sendEmail({
                to: email,
                templateId: 'verify-account',
                data: {
                    name: fullName,
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${newUser._id}`,
                },
            });
        } catch (error) {
            console.error('Error al enviar el email de verificación:', error);
            // No detener el registro del usuario si falla el envío del email
        }

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
