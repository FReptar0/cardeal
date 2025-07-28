// /pages/api/user/profile.js
import { connectToDatabase } from '@/utils/mongodb';
import { authenticateRequest } from '@/utils/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Authenticate request
    const authResult = authenticateRequest(req);
    if (!authResult.success) {
        return res.status(401).json({
            message: authResult.error,
            ...(authResult.code === 'TOKEN_EXPIRED' && { expired: true })
        });
    }

    try {
        const decoded = authResult.decoded;

        // Extraer el userId (se asumió que en el login se envió: userId: user._id)
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: decoded.userId });

        if (!user) {
            console.error('User profile fetch failed - user not found:', {
                userId: decoded.userId,
                timestamp: new Date().toISOString()
            });
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Remover datos sensibles, por ejemplo la contraseña
        delete user.password;

        return res.status(200).json({ user });
    } catch (error) {
        console.error('User profile fetch failed - unexpected error:', {
            error: error.message,
            stack: error.stack,
            userId: authResult.decoded?.userId,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
