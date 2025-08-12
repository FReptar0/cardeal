"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Zona horaria de la Ciudad de México
const timeZone = "America/Mexico_City";

// Función para obtener la fecha actual considerando la zona horaria de CDMX
function getCurrentMexicoDate() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone }));
  now.setHours(0, 0, 0, 0); // <-- Forzamos a medianoche de CDMX
  return now;
}


const getInitialSearchData = () => ({
  pickupLocation: null,
  returnLocation: null,
  sameOffice: true,
  // Usamos getCurrentMexicoDate para las fechas iniciales
  pickupDate: getCurrentMexicoDate(),
  returnDate: (() => {
    const d = getCurrentMexicoDate();
    d.setDate(d.getDate() + 1);
    return d;
  })(),
  pickupTime: "08:00 AM",
  returnTime: "08:00 AM",
});

// Fallback default locations only for cases where no user selection exists
const defaultLocations = {
  pickupLocation: {
    id: "AIBJ-T1-048",
    ciudad: "CDMX",
    nombre: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
  },
  returnLocation: {
    id: "AIBJ-T1-048",
    ciudad: "CDMX", 
    nombre: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
  },
};

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // Inicialización perezosa: intenta leer desde localStorage o usa el valor por defecto
  const [searchData, setSearchData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("searchData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          // Preserve user selections, only update dates if they're in the past
          const today = getCurrentMexicoDate();
          let pickupDate = new Date(parsed.pickupDate);
          let returnDate = new Date(parsed.returnDate);
          
          // Only update dates if they're in the past, preserve user location choices
          if (pickupDate < today) {
            pickupDate = getCurrentMexicoDate();
            returnDate = new Date(pickupDate);
            returnDate.setDate(returnDate.getDate() + 1);
          }
          
          return {
            ...parsed,
            pickupDate,
            returnDate,
            // Preserve user location selections from localStorage
            pickupLocation: parsed.pickupLocation || null,
            returnLocation: parsed.returnLocation || null,
          };
        } catch (error) {
          console.warn("Error parsing stored search data:", error);
          return getInitialSearchData();
        }
      }
      return getInitialSearchData();
    }
    return getInitialSearchData();
  });

  // Cada vez que searchData cambie, se guarda en el localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("searchData", JSON.stringify(searchData));
    }
  }, [searchData]);

  // Verificación de fechas para evitar fechas pasadas - ONLY updates dates, preserves locations
  useEffect(() => {
    const today = getCurrentMexicoDate();

    setSearchData((prev) => {
      const pickup = new Date(prev.pickupDate);
      const returnD = new Date(prev.returnDate);

      pickup.setHours(0, 0, 0, 0);
      returnD.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (pickup < today || returnD < today) {
        const updatedPickupDate = new Date(today);
        const updatedReturnDate = new Date(today);
        updatedReturnDate.setDate(today.getDate() + 1);

        // CRITICAL: Only update dates, preserve all user location selections
        return {
          ...prev,
          pickupDate: updatedPickupDate,
          returnDate: updatedReturnDate,
          // Explicitly preserve user location choices
          pickupLocation: prev.pickupLocation,
          returnLocation: prev.returnLocation,
          sameOffice: prev.sameOffice,
        };
      }

      return prev; // No hay cambio necesario
    });
  }, []); // 👈 Solo se ejecuta una vez al montar

  const clearSearch = () => {
    setSearchData(getInitialSearchData());
    localStorage.removeItem("searchData");
  };

  return (
    <SearchContext.Provider value={{ searchData, setSearchData, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
