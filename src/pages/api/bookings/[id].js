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

    // 1) Verificar método
    if (method === 'GET') {
        // ————————————— GET /api/bookings/[id] —————————————
        // Autenticación
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

            // Solo el dueño o admin/superadmin pueden verla
            if (
                booking.userId !== userId &&
                decoded.userType !== 'admin' &&
                decoded.userType !== 'superadmin'
            ) {
                return res.status(403).json({ message: 'Prohibido' });
            }

            // Incluir descuento incluso si es undefined
            const { discount, ...rest } = booking;
            return res.status(200).json({
                booking: {
                    ...rest,
                    discount: discount || 0,
                },
            });
        } catch (error) {
            console.error('Error al obtener la reserva:', error);
            return res.status(500).json({ message: 'Error al obtener la reserva' });
        }
    }

    if (method === 'DELETE') {
        // ——————————— DELETE /api/bookings/[id] ———————————
        // Autenticación
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
        const isAdmin =
            decoded.userType === 'admin' || decoded.userType === 'superadmin';

        try {
            const { db } = await connectToDatabase();
            // Si es admin, puede eliminar cualquier reserva; si no, solo la propia
            const filter = isAdmin
                ? { _id: id }
                : { _id: id, userId };

            const result = await db.collection('bookings').deleteOne(filter);

            if (result.deletedCount === 0) {
                return res
                    .status(404)
                    .json({ message: 'Reserva no encontrada o no tienes permiso' });
            }

            return res.status(200).json({ message: 'Reserva eliminada' });
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            return res.status(500).json({ message: 'Error al eliminar la reserva' });
        }
    }

    // 2) Si no es GET ni DELETE
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ message: 'Método no permitido' });
}
