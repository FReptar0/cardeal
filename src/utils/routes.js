// src/utils/routes.js

/**
 * Rutas consideradas como "páginas de renta"
 */
export const RENTAL_PAGES = [
    "/rental",
    "/proteccion",
    "/extras-renta"
];

/**
 * Determina si una ruta es una página de renta
 * @param {string} pathname
 * @returns {boolean}
 */
export function isRentalPage(pathname) {
    return RENTAL_PAGES.includes(pathname);
}

/**
 * Determina si se debe mostrar la imagen del auto
 * @param {string} pathname
 * @returns {boolean}
 */
export function showCarImageOnPage(pathname) {
    return pathname === "/extras-renta" || pathname === "/proteccion";
}
