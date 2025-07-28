// /pages/api/bookings/create.js
import { connectToDatabase } from "@/utils/mongodb";
import { generateUuid } from "@/utils/uuid";
import { authenticateRequest } from "@/utils/auth";

const IVA_RATE = 0.16;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // 1) Autenticación
  const authResult = authenticateRequest(req);
  if (!authResult.success) {
    return res.status(401).json({
      message: authResult.error,
      ...(authResult.code === 'TOKEN_EXPIRED' && { expired: true })
    });
  }
  const userId = authResult.decoded.userId;

  // 2) Leer payload (ahora incluye cargos extra)
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
    otherChargesOnline = 0 // cargo en línea
  } = req.body;

  // 3) Validación básica
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
    console.error('Booking creation failed - validation error:', {
      userId: userId,
      timestamp: new Date().toISOString()
    });
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const { db } = await connectToDatabase();

    // 4) Generar orderNumber único
    const genOrder = () => Math.floor(100000 + Math.random() * 900000).toString();
    let orderNumber, isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      orderNumber = genOrder();
      try {
        const existing = await db.collection("bookings").findOne({ orderNumber });
        if (!existing) {
          isUnique = true;
        }
      } catch (error) {
        console.error('Booking creation failed - order number verification error:', {
          error: error.message,
          userId: userId,
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: "Error al crear la reserva" });
      }
      attempts++;
    }
    
    if (!isUnique) {
      console.error('Booking creation failed - could not generate unique order number:', {
        attempts: attempts,
        userId: userId,
        timestamp: new Date().toISOString()
      });
      return res.status(500).json({ message: "Error al crear la reserva" });
    }

    // 5) Cálculo de días de renta
    const pickup = new Date(searchData.pickupDate);
    const dropoff = new Date(searchData.returnDate);
    const msInDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.ceil((dropoff - pickup) / msInDay);

    // 6) Costos por segmento
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

    // 7) Cargos adicionales y descuento
    const additionalCharge = paidOnline
      ? Number(otherChargesOnline)
      : Number(otherCharges);

    const subtotal = totalCarCost
      + totalInsCost
      + totalExtrasCost
      + additionalCharge
      - Number(discount);

    // 8) Aplicar IVA
    const totalAmount = Number((subtotal * (1 + IVA_RATE)).toFixed(2));

    // 9) Armar y guardar la reserva
    const newBooking = {
      _id: generateUuid(),
      userId,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await db.collection("bookings").insertOne(newBooking);
      if (!result.insertedId) {
        console.error('Booking creation failed - database insert error:', {
          userId: userId,
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({ message: "Error al crear la reserva" });
      }
    } catch (error) {
      console.error('Booking creation failed - database insert error:', {
        error: error.message,
        userId: userId,
        timestamp: new Date().toISOString()
      });
      return res.status(500).json({ message: "Error al crear la reserva" });
    }

    // 10) Devolver al frontend todos los totales para mostrar
    return res.status(201).json({
      message: "Pre-reserva creada correctamente",
      bookingId: newBooking._id,
      totalAmount,
      breakdown: newBooking.lineItems,
      rentalDays,
    });
  } catch (error) {
    console.error('Booking creation failed - unexpected error:', {
      error: error.message,
      stack: error.stack,
      userId: userId,
      timestamp: new Date().toISOString()
    });
    return res.status(500).json({ message: "Error al crear la reserva" });
  }
}
