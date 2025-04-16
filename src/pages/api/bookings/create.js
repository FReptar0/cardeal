import { connectToDatabase } from '@/utils/mongodb';
import { generateUuid } from '@/utils/uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Verificar que se envíe el token en el encabezado Authorization
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

    // Extraer los datos de la reserva del body
    const { selectedCar, selectedInsurance, selectedExtras, searchData } = req.body;
    if (!selectedCar || !searchData) {
        return res.status(400).json({ message: 'Faltan datos requeridos para crear la reserva' });
    }

    try {
        const { db } = await connectToDatabase();

        // Construir la reserva con una estructura desglosada
        const newBooking = {
            _id: generateUuid(),
            userId,
            car: selectedCar, // Objeto con la información del vehículo
            insurance: selectedInsurance || null, // Objeto o null si no se seleccionó seguro
            extras: selectedExtras || {},
            search: {
                pickupLocation: searchData.pickupLocation,
                returnLocation: searchData.returnLocation,
                sameOffice: searchData.sameOffice,
                // Convertir las fechas a objetos Date
                pickupDate: new Date(searchData.pickupDate),
                returnDate: new Date(searchData.returnDate),
                pickupTime: searchData.pickupTime,
                returnTime: searchData.returnTime,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection("bookings").insertOne(newBooking);

        return res.status(201).json({ message: "Reserva creada exitosamente", booking: newBooking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la reserva" });
    }
}
