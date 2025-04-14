// /pages/api/user/profile.js
import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Obtener el token de los encabezados
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const token = authHeader.split(" ")[1];

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Extraer el userId (se asumió que en el login se envió: userId: user._id)
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Remover datos sensibles, por ejemplo la contraseña
        delete user.password;

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error en la verificación del token:", error);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
