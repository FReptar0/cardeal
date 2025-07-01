// /pages/api/bookings/createGuest.js
import { connectToDatabase } from "@/utils/mongodb";
import { generateUuid } from "@/utils/uuid";

const IVA_RATE = 0.16;

function generateGuestId() {
    // Prefijo GUEST y 8 dígitos aleatorios
    return `GUEST-${Math.floor(10000000 + Math.random() * 90000000)}`;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    // Leer payload
    const {
        selectedCar,
        selectedInsurance,
        selectedExtras,
        searchData,
        contactName,
        contactEmail,
        contactPhone,
        paid,         // boolean
        paidOnline,   // boolean
        discount = 0, // número
        otherCharges = 0,     // cargo mostrador
        otherChargesOnline = 0, // cargo en línea
        tsdConfirmNum
    } = req.body;

    // Validación básica
    if (
        !selectedCar ||
        !searchData?.pickupDate ||
        !searchData?.returnDate ||
        !contactName ||
        !contactEmail ||
        !contactPhone ||
        typeof paid !== "boolean" ||
        typeof paidOnline !== "boolean"
    ) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    try {
        const { db } = await connectToDatabase();

        // Generar orderNumber único
        const genOrder = () => Math.floor(100000 + Math.random() * 900000).toString();
        let orderNumber, isUnique = false;
        while (!isUnique) {
            orderNumber = genOrder();
            if (!await db.collection("bookings").findOne({ orderNumber })) {
                isUnique = true;
            }
        }

        // Cálculo de días de renta
        const pickup = new Date(searchData.pickupDate);
        const dropoff = new Date(searchData.returnDate);
        const msInDay = 1000 * 60 * 60 * 24;
        const rentalDays = Math.ceil((dropoff - pickup) / msInDay);

        // Costos por segmento
        const dailyCarCost = paidOnline
            ? Number(selectedCar.priceOnline ?? selectedCar.price)
            : Number(selectedCar.price);
        const totalCarCost = dailyCarCost * rentalDays;

        const dailyInsCost = selectedInsurance?.price
            ? Number(selectedInsurance.price)
            : 0;
        const totalInsCost = dailyInsCost * rentalDays;

        let totalExtrasCost = 0;
        Object.values(selectedExtras).forEach(({ precio, cantidad }) => {
            totalExtrasCost += Number(precio) * Number(cantidad) * rentalDays;
        });

        // Cargos adicionales y descuento
        const additionalCharge = paidOnline
            ? Number(otherChargesOnline)
            : Number(otherCharges);

        const subtotal = totalCarCost
            + totalInsCost
            + totalExtrasCost
            + additionalCharge
            - Number(discount);

        // Aplicar IVA
        const totalAmount = Number((subtotal * (1 + IVA_RATE)).toFixed(2));

        // Armar y guardar la reserva
        const newBooking = {
            _id: generateUuid(),
            userId: generateGuestId(),
            isGuest: true,
            orderNumber,
            contact: {
                fullName: contactName,
                email: contactEmail,
                phone: contactPhone,
            },
            car: selectedCar,
            insurance: selectedInsurance || null,
            extras: Object.values(selectedExtras),
            search: {
                pickupLocation: searchData.pickupLocation,
                returnLocation: searchData.returnLocation,
                sameOffice: searchData.sameOffice,
                pickupDate: pickup,
                returnDate: dropoff,
                pickupTime: searchData.pickupTime,
                returnTime: searchData.returnTime,
            },
            paid,
            paidOnline,
            rentalDays,
            lineItems: {
                totalCarCost,
                totalInsuranceCost: totalInsCost,
                totalExtrasCost,
                additionalCharge,
                discount: Number(discount),
                iva: Number((subtotal * IVA_RATE).toFixed(2)),
            },
            totalAmount,                     // importe neto con IVA
            status: paidOnline ? "PENDING" : "OFFLINE",
            discount: Number(discount),
            tsdConfirmNum,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection("bookings").insertOne(newBooking);

        // Devolver al frontend todos los totales para mostrar
        return res.status(201).json({
            message: "Pre-reserva invitado creada correctamente",
            bookingId: newBooking._id,
            totalAmount,
            breakdown: newBooking.lineItems,
            rentalDays,
            isGuest: true,
        });
    } catch (error) {
        console.error("Error creando reserva invitado:", error);
        return res.status(500).json({ message: "Error al crear la reserva invitado" });
    }
}
