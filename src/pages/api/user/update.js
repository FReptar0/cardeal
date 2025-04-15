import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    const userId = decoded.userId;

    // Campos permitidos para actualización: fullName, phone, birthDate, location, bio, position y avatar (base64)
    const { fullName, phone, birthDate, location, bio, position, avatar } = req.body;

    try {
        const { db } = await connectToDatabase();

        const updateData = {
            fullName,
            phone,
            birthDate,
            location,
            bio,
            position,
            avatar,
            updatedAt: new Date(),
        };
        // Eliminar claves indefinidas
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        await db.collection('users').updateOne({ _id: userId }, { $set: updateData });

        return res.status(200).json({ message: 'Información actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la información' });
    }
}
