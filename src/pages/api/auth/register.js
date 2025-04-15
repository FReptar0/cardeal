import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import { generateUuid } from '@/utils/uuid';
import { positions } from '@mui/system';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { fullName, phone, email, password, birthDate, location } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const { db } = await connectToDatabase();

        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            _id: generateUuid(),
            fullName,
            phone,
            email,
            password: hashedPassword,
            birthDate,
            location,
            position: '',
            bio: '',
            profilePicture: '',
            userType: 'user', 
            avatar: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            isActive: true,
            isVerified: false,
        };

        await db.collection('users').insertOne(newUser);

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
