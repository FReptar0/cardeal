// /pages/api/bookings/[id].js
import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    const {
        query: { id },
        method,
        headers,
    } = req;

    if (method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Verificar token
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    const userId = decoded.userId;

    try {
        const { db } = await connectToDatabase();

        const booking = await db
            .collection('bookings')
            .findOne({ _id: id });

        if (!booking) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Asegurar que solo el dueño (o un admin) pueda verla
        if (booking.userId !== userId && decoded.userType !== 'admin' && decoded.userType !== 'superadmin') {
            return res.status(403).json({ message: 'Prohibido' });
        }

        return res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener la reserva' });
    }
}
