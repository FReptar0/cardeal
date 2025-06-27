/**
 * Ajusta la fecha de devolución para que nunca sea igual o anterior a la de recogida.
 * Si la devolución es igual o anterior, la mueve al día siguiente de la recogida.
 * @param {Date} pickupDate
 * @param {Date} returnDate
 * @returns {{pickupDate: Date, returnDate: Date}}
 */
export function adjustReturnDate(pickupDate, returnDate) {
    const newPickup = new Date(pickupDate);
    newPickup.setHours(0, 0, 0, 0);
    let newReturn = new Date(returnDate);
    newReturn.setHours(0, 0, 0, 0);
    if (newReturn <= newPickup) {
        newReturn = new Date(newPickup);
        newReturn.setDate(newReturn.getDate() + 1);
    }
    return { pickupDate: newPickup, returnDate: newReturn };
}

/**
 * Lógica para validar y ajustar la fecha de devolución según reglas de negocio.
 * Si la devolución es igual a la recogida, la mueve un día después.
 * Si la devolución es antes que la recogida, ajusta ambas según reglas.
 * @param {Date} pickupDate
 * @param {Date} returnDate
 * @returns {{pickupDate: Date, returnDate: Date}}
 */
export function validateAndAdjustDates(pickupDate, returnDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newPickup = new Date(pickupDate);
    newPickup.setHours(0, 0, 0, 0);
    let newReturn = new Date(returnDate);
    newReturn.setHours(0, 0, 0, 0);

    if (newReturn.getTime() === newPickup.getTime()) {
        newReturn.setDate(newReturn.getDate() + 1);
        return { pickupDate: newPickup, returnDate: newReturn };
    }
    if (newReturn.getTime() < newPickup.getTime()) {
        const adjustedPickup = new Date(newReturn);
        adjustedPickup.setDate(adjustedPickup.getDate() - 1);
        if (adjustedPickup < today) {
            newReturn = new Date(newPickup);
            newReturn.setDate(newReturn.getDate() + 1);
            return { pickupDate: newPickup, returnDate: newReturn };
        } else {
            return { pickupDate: adjustedPickup, returnDate: newReturn };
        }
    }
    return { pickupDate: newPickup, returnDate: newReturn };
}
