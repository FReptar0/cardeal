// src/hooks/useAutoOpenSelectors.js
// Hook personalizado para exponer funciones que abren automáticamente los selectores de hora y fecha
import { useCallback } from "react";

/**
 * Provee funciones para abrir programáticamente los selectores de hora y fecha
 * @param {object} refs - Refs de los inputs/selectores
 * @returns {{ openPickupTime: Function, openReturnDate: Function, openReturnTime: Function }}
 */
export function useAutoOpenSelectors({ pickupTimeRef, returnDateRef, returnTimeRef }) {
    // Abre el selector de hora de recogida
    const openPickupTime = useCallback(() => {
        if (pickupTimeRef?.current) {
            pickupTimeRef.current.focus();
            setTimeout(() => {
                const event = new MouseEvent("mousedown", { bubbles: true });
                pickupTimeRef.current.dispatchEvent(event);
            }, 150);
        }
    }, [pickupTimeRef]);

    // Abre el selector de fecha de devolución
    const openReturnDate = useCallback(() => {
        if (returnDateRef?.current) {
            returnDateRef.current.showPicker();
        }
    }, [returnDateRef]);

    // Abre el selector de hora de devolución
    const openReturnTime = useCallback(() => {
        if (returnTimeRef?.current) {
            returnTimeRef.current.focus();
            setTimeout(() => {
                const event = new MouseEvent("mousedown", { bubbles: true });
                returnTimeRef.current.dispatchEvent(event);
            }, 150);
        }
    }, [returnTimeRef]);

    return { openPickupTime, openReturnDate, openReturnTime };
}
