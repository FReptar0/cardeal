import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email, password, remember } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const { db } = await connectToDatabase();

        // Buscar usuario por correo electrónico
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Comparar la contraseña hasheada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Actualizar el campo lastLogin
        await db.collection('users').updateOne(
            { email },
            { $set: { lastLogin: new Date() } }
        );

        // Generar JWT: si "remember" es true, el token dura 10 años, de lo contrario expira en 1 hora.
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
            JWT_SECRET,
            remember ? { expiresIn: '10y' } : { expiresIn: '1h' }
        );

        return res.status(200).json({ token, sessionStart: new Date() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error de autenticación' });
    }
}
