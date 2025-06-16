import { connectToDatabase } from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/sendEmail";
import CryptoJS from "crypto-js";

const JWT_SECRET = process.env.JWT_SECRET;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No se encontró un usuario con ese correo" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "72h" }
    );

    const encryptedToken = CryptoJS.AES.encrypt(
      token,
      ENCRYPTION_KEY
    ).toString();

    const resetUrl = `${FRONTEND_URL}/cambiar-acceso?token=${encodeURIComponent(
      encryptedToken
    )}`;

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetRequested: true,
          passwordResetRequestedAt: new Date(),
        },
      }
    );

    await sendEmail({
      to: email,
      templateId: "reset-password",
      data: {
        name: user.name || "Usuario",
        url: resetUrl,
      },
    });

    return res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
