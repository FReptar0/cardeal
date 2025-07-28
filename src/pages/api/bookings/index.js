import { connectToDatabase } from '@/utils/mongodb';
import { authenticateRequest } from '@/utils/auth';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // — Verificar token —
    const authResult = authenticateRequest(req);
    if (!authResult.success) {
        return res.status(401).json({
            message: authResult.error,
            ...(authResult.code === 'TOKEN_EXPIRED' && { expired: true })
        });
    }
    const userId = authResult.decoded.userId;

    // — Parámetros de paginación (5 por página) —
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 4, 1);
    const skip = (page - 1) * limit;

    try {
        const { db } = await connectToDatabase();

        // — Validar usuario —
        const user = await db.collection("users").findOne({ _id: userId });
        if (!user) {
            console.error('Bookings fetch failed - user not found:', {
                userId: userId,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // — Filtrar según rol —
        const filter = (user.userType === "admin" || user.userType === "superadmin")
            ? {}
            : { userId };

        // — Conteo y consulta paginada —
        const total = await db.collection("bookings").countDocuments(filter);
        const bookings = await db
            .collection("bookings")
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalPages = Math.ceil(total / limit);
        return res.status(200).json({ bookings, total, totalPages });
    } catch (error) {
        console.error('Bookings fetch failed - unexpected error:', {
            error: error.message,
            stack: error.stack,
            userId: userId,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: 'Error al obtener las reservas' });
    }
}
