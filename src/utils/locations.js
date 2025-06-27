// /utils/locations.js

export const locations = [
    /*{
        id: "AIBJ-T1-048",
        city: "CDMX",
        name: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
    },
    {
        id: "AIBJ-T1-160",
        city: "CDMX",
        name: "Interior del AICM T1, local 160 Puerta 7 Internacional, CDMX",
    },*/
    {
        id: "SAT-001",
        city: "EDOMEX",
        name: "Blvd. Manuel Avila Camacho #1834, Col. Ciudad Satélite, CP 53100 Naucalpan Edo. Mex",
    },
    // Agrega aquí nuevas ubicaciones conforme las necesites...
];

/**
 * Parsea el objeto de horarios de una sucursal y devuelve el rango de apertura/cierre para el día actual.
 * @param {object} raw - Objeto de horarios de la sucursal (ej: { OpenCloseMon: "0800-1800", ... })
 * @returns {{start: string, end: string} | null} Rango horario en formato { start: "08:00", end: "18:00" } o null si está cerrado/indefinido
 */
export function parseBusinessHours(raw) {
    const daysMap = {
        0: "OpenCloseSun",
        1: "OpenCloseMon",
        2: "OpenCloseTue",
        3: "OpenCloseWed",
        4: "OpenCloseThu",
        5: "OpenCloseFri",
        6: "OpenCloseSat",
    };

    const dayKey = daysMap[new Date().getDay()];
    const horario = raw?.[dayKey];
    const rango = Array.isArray(horario) ? horario[0] : horario;

    if (rango && /^[0-9]{4}-[0-9]{4}$/.test(rango)) {
        const [start, end] = rango.split("-");
        const formatHour = (h) => `${h.slice(0, 2)}:${h.slice(2)}`;
        return {
            start: formatHour(start),
            end: formatHour(end),
        };
    }

    return null; // Cerrado o inválido
}
