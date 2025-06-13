import { connectToDatabase } from "@/utils/mongodb";

export async function logEvent({ webhook, type, mp_order, payload, message, details }) {
  try {
    const { db } = await connectToDatabase();
    await db.collection("logs_webhooks").insertOne({
      webhook,
      type,
      mp_order: mp_order || null,
      payload,
      message,
      details,
      createdAt: new Date()
    });
  } catch (err) {
    console.error("❌ Error guardando log en Mongo:", err);
  }
}