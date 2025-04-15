import { connectToDatabase } from '@/utils/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Las nuevas contraseñas no coinciden' });
    }

    try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que la contraseña actual sea correcta
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.collection('users').updateOne(
            { _id: userId },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
}
