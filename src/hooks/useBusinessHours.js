// src/hooks/useBusinessHours.js
// Hook personalizado para manejar el fetch y estado de horarios de sucursal
import { useState, useCallback } from "react";

/**
 * Hook para obtener y manejar los horarios de una sucursal
 * @returns {{
 *   pickupHours: any,
 *   setPickupHours: Function,
 *   loadingPickupHours: boolean,
 *   setLoadingPickupHours: Function,
 *   returnHours: any,
 *   setReturnHours: Function,
 *   loadingReturnHours: boolean,
 *   setLoadingReturnHours: Function,
 *   fetchBusinessHours: Function
 * }}
 */
export function useBusinessHours() {
    const [pickupHours, setPickupHours] = useState(null);
    const [returnHours, setReturnHours] = useState(null);
    const [loadingPickupHours, setLoadingPickupHours] = useState(false);
    const [loadingReturnHours, setLoadingReturnHours] = useState(false);

    // Función para hacer fetch de horarios
    const fetchBusinessHours = useCallback(async (locationId, setHoursFn, setLoadingFn) => {
        try {
            setLoadingFn?.(true);
            const res = await fetch("/api/locations/hours", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locationId }),
            });
            const data = await res.json();
            setHoursFn(data);
        } catch (err) {
            console.error("Error al obtener horarios:", err);
            setHoursFn(null);
        } finally {
            setLoadingFn?.(false);
        }
    }, []);

    return {
        pickupHours,
        setPickupHours,
        loadingPickupHours,
        setLoadingPickupHours,
        returnHours,
        setReturnHours,
        loadingReturnHours,
        setLoadingReturnHours,
        fetchBusinessHours,
    };
}
