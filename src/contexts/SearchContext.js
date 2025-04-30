"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Zona horaria de la Ciudad de México
const timeZone = "America/Mexico_City";

// Función para obtener la fecha actual considerando la zona horaria de CDMX
function getCurrentMexicoDate() {
  // Convierte la fecha actual al string en la zona de México y la vuelve a transformar en Date
  return new Date(new Date().toLocaleString("en-US", { timeZone }));
}

const initialSearchData = {
  pickupLocation: {
    id: "AIBJ-T1-048",
    city: "CDMX",
    name: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
  },
  returnLocation: {
    id: "AIBJ-T1-048",
    city: "CDMX",
    name: "Interior del AICM T1, local 048 Puerta 4 área Nacional, CDMX",
  },
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
};

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // Inicialización perezosa: intenta leer desde localStorage o usa el valor por defecto
  const [searchData, setSearchData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("searchData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return {
          ...parsed,
          // Rehidrata las fechas, ya que se almacenaron como string
          pickupDate: new Date(parsed.pickupDate),
          returnDate: new Date(parsed.returnDate),
        };
      }
      return initialSearchData;
    }
    return initialSearchData;
  });

  // Cada vez que searchData cambie, se guarda en el localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("searchData", JSON.stringify(searchData));
    }
  }, [searchData]);

  // Verificación de fechas para evitar fechas pasadas
  useEffect(() => {
    const today = getCurrentMexicoDate();

    if (searchData.pickupDate < today || searchData.returnDate < today) {
      const updatedPickupDate = today;
      const updatedReturnDate = new Date(today);
      updatedReturnDate.setDate(today.getDate() + 1);

      setSearchData((prev) => ({
        ...prev,
        pickupDate: updatedPickupDate,
        returnDate: updatedReturnDate,
      }));
    }
  }, [searchData]);

  const clearSearch = () => {
    setSearchData(initialSearchData);
    localStorage.removeItem("searchData");
  };

  return (
    <SearchContext.Provider value={{ searchData, setSearchData, clearSearch  }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
