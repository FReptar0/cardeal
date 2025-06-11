// pages/api/auth/verify-account.js
import { connectToDatabase } from "@/utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Falta el ID del usuario" });
  }

  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { isVerified: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Cuenta verificada con éxito" });
  } catch (err) {
    console.error("Error al verificar usuario:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
