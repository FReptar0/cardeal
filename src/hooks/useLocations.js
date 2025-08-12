// src/hooks/useLocations.js
// Hook personalizado para manejar el fetch y selección automática de sucursales
import { useState, useEffect } from "react";

/**
 * Hook para obtener sucursales y seleccionar automáticamente una por defecto
 * @param {Function} setSearchData - Setter del contexto de búsqueda para actualizar pickupLocation
 * @returns {{ locations: any[], setLocations: Function, loadingLocations: boolean, errorLocations: any }}
 */
export function useLocations(setSearchData) {
    const [locations, setLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setErrorLocations] = useState(null);

    useEffect(() => {
        setLoadingLocations(true);
        fetch("/api/locations")
            .then((res) => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setLocations(data);
                // Only set default location if user hasn't selected one yet
                if (data && data.length >= 3 && typeof setSearchData === "function") {
                    setSearchData((prev) => {
                        // Don't override if user already has a pickup location selected
                        if (prev.pickupLocation && prev.pickupLocation.id) {
                            return prev;
                        }
                        // Only set default if no location is selected
                        return {
                            ...prev,
                            pickupLocation: data[2],
                            returnLocation: prev.sameOffice ? data[2] : prev.returnLocation,
                        };
                    });
                }
            })
            .catch((err) => {
                setErrorLocations(err);
            })
            .finally(() => setLoadingLocations(false));
    }, [setSearchData]);

    return { locations, setLocations, loadingLocations, errorLocations };
}
