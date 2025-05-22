// /pages/api/bookings/create.js
import { connectToDatabase } from "@/utils/mongodb";
import { generateUuid } from "@/utils/uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // 1) Verificar token Bearer
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

  // 2) Leer payload
  const {
    selectedCar,
    selectedInsurance,
    selectedExtras,
    searchData,
    contactName,
    contactEmail,
    contactPhone,
    paid,        // boolean
    paidOnline,  // boolean
    discount,    // number (o null)
  } = req.body;

  // 3) Validación básica
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

    // 4) Generar orderNumber único
    const generateOrderNumber = () =>
      Math.floor(100000 + Math.random() * 900000).toString();
    let orderNumber;
    let isUnique = false;
    while (!isUnique) {
      orderNumber = generateOrderNumber();
      const exists = await db
        .collection("bookings")
        .findOne({ orderNumber });
      if (!exists) isUnique = true;
    }

    // 5) Calcular totalAmount
    let total = 0;
    // a) Precio del auto
    if (selectedCar.price) total += Number(selectedCar.price);
    // b) Precio del seguro
    if (selectedInsurance?.price) total += Number(selectedInsurance.price);
    // c) Extras: asumimos {id, nombre, cantidad, precio}
    Object.values(selectedExtras).forEach(({ cantidad, precio }) => {
      total += Number(precio) * Number(cantidad);
    });
    // d) Aplicar descuento (se resta si es valor absoluto)
    if (discount) total -= Number(discount);
    const totalAmount = Number(total.toFixed(2));

    // 6) Armar objeto de reserva
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
        pickupDate: new Date(searchData.pickupDate),
        returnDate: new Date(searchData.returnDate),
        pickupTime: searchData.pickupTime,
        returnTime: searchData.returnTime,
      },
      paid,             // guardamos el flag enviado
      paidOnline,       // guardamos el flag enviado
      totalAmount,      // importe calculado
      status: paidOnline ? "PENDING" : "OFFLINE", // PENDING para online, OFFLINE para mostrador
      discount: discount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 7) Insertar en BD
    await db.collection("bookings").insertOne(newBooking);

    // 8) Devolver bookingId y totalAmount
    return res.status(201).json({
      message: "Pre-reserva creada exitosamente",
      bookingId: newBooking._id,
      totalAmount, // para usar como mp_amount en el frontend
    });
  } catch (error) {
    console.error("Error creando reserva:", error);
    return res.status(500).json({ message: "Error al crear la reserva" });
  }
}
