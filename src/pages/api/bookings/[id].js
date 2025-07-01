// /pages/api/bookings/[id].js
import { connectToDatabase } from "@/utils/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const {
    query: { id },
    method,
    headers,
  } = req;

  // 1) Verificar método
  if (method === "GET") {
    // ————————————— GET /api/bookings/[id] —————————————
    // Permitir acceso sin JWT solo si la reserva es de invitado
    let decoded = null;
    let userId = null;
    const authHeader = headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado" });
      }
    }

    try {
      const { db } = await connectToDatabase();
      const booking = await db.collection("bookings").findOne({ _id: id });

      if (!booking) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      // Si es invitado, permitir acceso sin autenticación
      if (booking.isGuest === true) {
        const { discount, ...rest } = booking;
        return res.status(200).json({
          booking: {
            ...rest,
            discount: discount || 0,
          },
        });
      }

      // Si no es invitado, requerir autenticación y permisos
      if (!decoded) {
        return res.status(401).json({ message: "No autorizado" });
      }
      // Solo el dueño o admin/superadmin pueden verla
      if (
        booking.userId !== userId &&
        decoded.userType !== "admin" &&
        decoded.userType !== "superadmin"
      ) {
        return res.status(403).json({ message: "Prohibido" });
      }

      // Incluir descuento incluso si es undefined
      const { discount, ...rest } = booking;
      return res.status(200).json({
        booking: {
          ...rest,
          discount: discount || 0,
        },
      });
    } catch (error) {
      console.error("Error al obtener la reserva:", error);
      return res.status(500).json({ message: "Error al obtener la reserva" });
    }
  }

  if (method === "DELETE") {
    // ——————————— DELETE /api/bookings/[id] ———————————
    // Autenticación
    const authHeader = headers.authorization;
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
    const isAdmin =
      decoded.userType === "admin" || decoded.userType === "superadmin";

    try {
      const { db } = await connectToDatabase();
      // Si es admin, puede eliminar cualquier reserva; si no, solo la propia
      const filter = isAdmin ? { _id: id } : { _id: id, userId };

      const result = await db.collection("bookings").deleteOne(filter);

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Reserva no encontrada o no tienes permiso" });
      }

      return res.status(200).json({ message: "Reserva eliminada" });
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      return res.status(500).json({ message: "Error al eliminar la reserva" });
    }
  }

  if (method === "PATCH") {
    // PATCH /api/bookings/[id]
    const authHeader = headers.authorization;
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

    const { confirmNum } = req.body;
    if (!confirmNum) {
      return res.status(400).json({ message: "Falta confirmNum en el body" });
    }

    try {
      const { db } = await connectToDatabase();
      const result = await db
        .collection("bookings")
        .updateOne({ _id: id }, { $set: { tsdConfirmNum: confirmNum } });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      return res
        .status(200)
        .json({ message: "ConfirmNum actualizado con éxito" });
    } catch (err) {
      console.error("❌ Error al guardar ConfirmNum:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  }

  // 2) Si no es GET ni DELETE
  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ message: "Método no permitido" });
}
