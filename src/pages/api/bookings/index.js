import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Verificar el token del usuario
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
    const userId = decoded.userId;

    try {
        const { db } = await connectToDatabase();

        // Para determinar qué reservas mostrar, primero se consulta el usuario
        const user = await db.collection("users").findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        let bookings;
        if (user.userType === "admin" || user.userType === "superadmin") {
            // Si el usuario es admin o superadmin, se extraen todas las reservas
            bookings = await db.collection("bookings").find({}).toArray();
        } else {
            // De otro modo, sólo se extraen las reservas del usuario autenticado
            bookings = await db.collection("bookings").find({ userId }).toArray();
        }

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las reservas" });
    }
}
