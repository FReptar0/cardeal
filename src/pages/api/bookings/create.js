// /pages/api/bookings/index.js
import { connectToDatabase } from "@/utils/mongodb";
import { generateUuid } from "@/utils/uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }
  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
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
    paid, // ahora lo recibimos del cliente
    paidOnline,
    discount, // Agregar el descuento como parte de la reserva
  } = req.body;

  if (
    !selectedCar ||
    !searchData ||
    !contactName ||
    !contactEmail ||
    !contactPhone ||
    typeof paid !== "boolean" ||
    typeof paidOnline !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "Faltan datos requeridos para crear la reserva" });
  }

  try {
    const { db } = await connectToDatabase();

    const generateOrderNumber = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // Generar un número de 6 dígitos
    };

    let orderNumber;
    let isUnique = false;

    // Intentar generar un número único
    while (!isUnique) {
      orderNumber = generateOrderNumber();
      const existingOrder = await db
        .collection("bookings")
        .findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    // Modificar la lógica para enviar solo el campo `price` si el pago es al entregar
    const newBooking = {
      _id: generateUuid(),
      userId,
      orderNumber, // Agregar el número de orden único
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
        pickupDate: new Date(searchData.pickupDate),
        returnDate: new Date(searchData.returnDate),
        pickupTime: searchData.pickupTime,
        returnTime: searchData.returnTime,
      },
      paid, // guardamos el flag que venga del cliente
      paidOnline, // guardamos el flag que venga del cliente
      price: paid ? totals.price : undefined, // Solo enviar `price` si el pago es al entregar
      discount: discount || 0, // Guardar el descuento recibido o 0 si no se proporciona
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("bookings").insertOne(newBooking);

    return res
      .status(201)
      .json({
        message: "Reserva creada exitosamente",
        bookingId: newBooking._id,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la reserva" });
  }
}
