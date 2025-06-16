import { connectToDatabase } from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const JWT_SECRET = process.env.JWT_SECRET;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }

  try {
    // Desencriptamos el token
    const bytes = CryptoJS.AES.decrypt(token, ENCRYPTION_KEY);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedToken) {
      return res.status(401).json({ message: "Token inválido o malformado" });
    }

    const decoded = jwt.verify(decryptedToken, JWT_SECRET);
    const userId = decoded.userId;

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const THREE_DAYS_IN_MS = 72 * 60 * 60 * 1000;
    const now = Date.now();
    const requestedAt = user.passwordResetRequestedAt
      ? new Date(user.passwordResetRequestedAt).getTime()
      : 0;

    if (!user.passwordResetRequested) {
      return res.status(403).json({
        message: "No se ha solicitado restablecimiento de contraseña.",
      });
    }

    if (now - requestedAt > THREE_DAYS_IN_MS) {
      // Asegurar que se actualiza el estado aunque falle el return
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            passwordResetRequested: false,
            updatedAt: new Date(),
          },
        }
      );

      // Luego respondemos
      return res.status(403).json({
        message: "El enlace ha expirado. Vuelve a solicitar el cambio.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
          passwordResetRequested: false,
          passwordResetRequestedAt: null,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
