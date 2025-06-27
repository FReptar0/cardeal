/**
 * Genera los slots de horario entre dos horas dadas, con opción de filtrar para hoy (+2h).
 * @param {string} startTime - Hora de inicio en formato "HH:mm"
 * @param {string} endTime - Hora de fin en formato "HH:mm"
 * @param {boolean} [forToday=false] - Si es true, omite horarios menores a +2h desde ahora
 * @returns {string[]} Array de horarios en formato "HH:mm AM/PM"
 */
export function generateTimeSlots(startTime, endTime, forToday = false) {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const now = new Date();
    const limit = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 horas

    const slots = [];
    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);

    while (current <= end) {
        if (!forToday || current > limit) {
            const h = current.getHours();
            const m = current.getMinutes();
            const suffix = h < 12 ? "AM" : "PM";
            const formatted = `${h.toString().padStart(2, "0")}:${m
                .toString()
                .padStart(2, "0")}` + ` ${suffix}`;
            slots.push(formatted);
        }
        current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
}
