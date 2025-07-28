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
  // --- Lógica original comentada porque ya no se usa fetch para horarios ---
  // const [pickupHours, setPickupHours] = useState(null);
  // const [returnHours, setReturnHours] = useState(null);
  // const [loadingPickupHours, setLoadingPickupHours] = useState(false);
  // const [loadingReturnHours, setLoadingReturnHours] = useState(false);

  // // Función para hacer fetch de horarios
  // const fetchBusinessHours = useCallback(async (locationId, setHoursFn, setLoadingFn) => {
  //     try {
  //         setLoadingFn?.(true);
  //         const res = await fetch("/api/locations/hours", {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ locationId }),
  //         });
  //         const data = await res.json();
  //         // Forzar horarios de sábado y domingo a 09:00-16:00
  //         if (data && typeof data === 'object') {
  //             if (Array.isArray(data.OpenCloseSat) && data.OpenCloseSat.length > 0) {
  //                 data.OpenCloseSat[0] = "0900-1600";
  //             }
  //             if (Array.isArray(data.OpenCloseSun) && data.OpenCloseSun.length > 0) {
  //                 data.OpenCloseSun[0] = "0900-1600";
  //             }
  //         }
  //         setHoursFn(data);
  //     } catch (err) {
  //         console.error("Error al obtener horarios:", err);
  //         setHoursFn(null);
  //     } finally {
  //         setLoadingFn?.(false);
  //     }
  // }, []);

  // --- Retorno vacío, ya no se usa este hook para horarios ---
  return {
    // pickupHours,
    // setPickupHours,
    // loadingPickupHours,
    // setLoadingPickupHours,
    // returnHours,
    // setReturnHours,
    // loadingReturnHours,
    // setLoadingReturnHours,
    // fetchBusinessHours,
  };
}
