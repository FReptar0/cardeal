import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import { validateLoginInput, sanitizeInput } from '@/utils/validation';
import { generateJWT } from '@/utils/auth';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email: rawEmail, password, remember } = req.body;

    // Sanitize inputs
    const email = sanitizeInput(rawEmail);

    // Validate inputs
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
        console.error('Login validation failed:', {
            error: validation.error,
            email: email,
            timestamp: new Date().toISOString()
        });
        return res.status(400).json({ message: validation.error });
    }

    try {
        const { db } = await connectToDatabase();

        // Buscar usuario por correo electrónico
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            console.error('Login failed - user not found:', {
                email: email,
                timestamp: new Date().toISOString()
            });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Comparar la contraseña hasheada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.error('Login failed - invalid password:', {
                email: email,
                timestamp: new Date().toISOString()
            });
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Actualizar el campo lastLogin
        try {
            await db.collection('users').updateOne(
                { email },
                { $set: { lastLogin: new Date() } }
            );
        } catch (error) {
            console.error('Error al actualizar lastLogin:', {
                error: error.message,
                email: email,
                timestamp: new Date().toISOString()
            });
            // No fallar el login por esto
        }

        // Generar JWT: si "remember" es true, el token dura 30 días, de lo contrario expira en 1 hora.
        const token = generateJWT(
            {
                userId: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
            remember ? { expiresIn: '30d' } : { expiresIn: '1h' }
        );

        return res.status(200).json({ token, sessionStart: new Date() });
    } catch (error) {
        console.error('Login failed - unexpected error:', {
            error: error.message,
            stack: error.stack,
            email: email,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: 'Error de autenticación' });
    }
}
