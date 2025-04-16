// /pages/api/bookings/index.js
import { connectToDatabase } from '@/utils/mongodb';
import { generateUuid } from '@/utils/uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const authHeader = req.headers.authorization;
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

    const {
        selectedCar,
        selectedInsurance,
        selectedExtras,
        searchData,
        contactName,
        contactEmail,
        contactPhone,
        paid,               // ahora lo recibimos del cliente
    } = req.body;

    if (
        !selectedCar ||
        !searchData ||
        !contactName ||
        !contactEmail ||
        !contactPhone ||
        typeof paid !== 'boolean'
    ) {
        return res
            .status(400)
            .json({ message: 'Faltan datos requeridos para crear la reserva' });
    }

    try {
        const { db } = await connectToDatabase();

        const newBooking = {
            _id: generateUuid(),
            userId,
            contact: {
                fullName: contactName,
                email: contactEmail,
                phone: contactPhone,
            },
            car: selectedCar,
            insurance: selectedInsurance || null,
            extras: selectedExtras || {},
            search: {
                pickupLocation: searchData.pickupLocation,
                returnLocation: searchData.returnLocation,
                sameOffice: searchData.sameOffice,
                pickupDate: new Date(searchData.pickupDate),
                returnDate: new Date(searchData.returnDate),
                pickupTime: searchData.pickupTime,
                returnTime: searchData.returnTime,
            },
            paid,        // guardamos el flag que venga del cliente
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection('bookings').insertOne(newBooking);

        return res
            .status(201)
            .json({ message: 'Reserva creada exitosamente', bookingId: newBooking._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la reserva' });
    }
}
