import { connectToDatabase } from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

let decoded = jwt.decode(token); 

const email = decoded?.email;
if (!email) {
  return res.status(400).json({ message: "Email no encontrado en el token" });
}


  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "La cuenta ya está verificada" });
  }

  const lastSent = user.lastVerificationEmailSent || new Date(0);
  const now = new Date();
  const diffHours = (now - new Date(lastSent)) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return res
      .status(429)
      .json({ message: "Ya se envió un correo en las últimas 24 horas" });
  }

  try {
    await sendEmail({
      to: email,
      templateId: "verify-account",
      data: {
        name: user.fullName,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${user._id}`,
      },
    });

    await db
      .collection("users")
      .updateOne(
        { email },
        { $set: { lastVerificationEmailSent: new Date() } }
      );

    return res
      .status(200)
      .json({ message: "Correo de verificación reenviado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al enviar el correo" });
  }
}
