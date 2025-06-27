import { es } from "date-fns/locale";
import format from "date-fns/format";

/**
 * Devuelve el nombre del día de la semana en español.
 * @param {Date} date
 * @returns {string}
 */
export const formatDay = (date) =>
    date instanceof Date && !isNaN(date)
        ? format(date, "EEEE", { locale: es })
        : "Día inválido";

/**
 * Devuelve el número del día del mes (dos dígitos).
 * @param {Date} date
 * @returns {string}
 */
export const formatNumber = (date) =>
    date instanceof Date && !isNaN(date) ? format(date, "dd") : "--";

/**
 * Devuelve el mes y año en español (ej: junio 2025).
 * @param {Date} date
 * @returns {string}
 */
export const formatMonthYear = (date) =>
    date instanceof Date && !isNaN(date)
        ? format(date, "MMMM yyyy", { locale: es })
        : "Fecha inválida";

/**
 * Devuelve la fecha actual en formato yyyy-MM-dd para la zona de México.
 * @returns {string}
 */
export const getTodayDate = () => {
    const mexicoDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
    );
    return format(mexicoDate, "yyyy-MM-dd");
};
