import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // — Verificar token —
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    const userId = decoded.userId;

    // — Parámetros de paginación (5 por página) —
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 4, 1);
    const skip = (page - 1) * limit;

    try {
        const { db } = await connectToDatabase();

        // — Validar usuario —
        const user = await db.collection("users").findOne({ _id: userId });
        if (!user) {
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
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las reservas' });
    }
}
