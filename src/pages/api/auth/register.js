import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import { generateUuid } from '@/utils/uuid';
import { validateRegistrationInput, sanitizeInput } from '@/utils/validation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { fullName: rawFullName, phone: rawPhone, email: rawEmail, password, birthDate } = req.body;

    // Sanitize inputs
    const fullName = sanitizeInput(rawFullName);
    const phone = sanitizeInput(rawPhone);
    const email = sanitizeInput(rawEmail);

    // Validate inputs
    const validation = validateRegistrationInput({ fullName, phone, email, password, birthDate });
    if (!validation.isValid) {
        console.error('Registration validation failed:', {
            error: validation.error,
            email: email,
            timestamp: new Date().toISOString()
        });
        return res.status(400).json({ message: validation.error });
    }

    try {
        const { db } = await connectToDatabase();

        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            console.error('User registration failed - duplicate email:', {
                email: email,
                timestamp: new Date().toISOString()
            });
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
        };

        const result = await db.collection('users').insertOne(newUser);
        if (!result.insertedId) {
            console.error('User registration failed - database insert error:', {
                email: email,
                timestamp: new Date().toISOString()
            });
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        // Enviar email de verificación directamente desde backend
        let emailError = null;
        try {
            const { sendEmail } = await import('@/utils/sendEmail');
            await sendEmail({
                to: email,
                templateId: 'verify-account',
                data: {
                    name: fullName,
                    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify?token=${newUser._id}`,
                },
            });
        } catch (error) {
            console.error('Error al enviar el email de verificación:', {
                error: error.message,
                userId: newUser._id,
                email: email,
                timestamp: new Date().toISOString()
            });
            emailError = 'No se pudo enviar el email de verificación';
        }

        return res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            ...(emailError && { 
                warning: emailError,
                note: 'El usuario fue creado pero no se envió el email de verificación'
            })
        });
    } catch (error) {
        console.error('User registration failed - unexpected error:', {
            error: error.message,
            stack: error.stack,
            email: email,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
