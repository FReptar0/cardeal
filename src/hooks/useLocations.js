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
                // Seleccionar la tercera opción automáticamente y deshabilitar el Autocomplete
                if (data && data.length >= 3 && typeof setSearchData === "function") {
                    setSearchData((prev) => ({
                        ...prev,
                        pickupLocation: data[2],
                    }));
                }
            })
            .catch((err) => {
                setErrorLocations(err);
            })
            .finally(() => setLoadingLocations(false));
    }, [setSearchData]);

    return { locations, setLocations, loadingLocations, errorLocations };
}
