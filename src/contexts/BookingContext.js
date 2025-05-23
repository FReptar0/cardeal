"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [userData, setUserData] = useState({});
  const [discount, setDiscount] = useState(null);

  // 🔄 Nuevo estado: indica si selectedCar ya se cargó desde localStorage
  const [isCarLoaded, setIsCarLoaded] = useState(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const cleared = sessionStorage.getItem("bookingCleared") === "true";
    if (cleared) {
      sessionStorage.removeItem("bookingCleared");
    } else {
      // ───── Tu lógica de carga desde localStorage ─────
      const carFromStorage = localStorage.getItem("selectedCar");
      if (carFromStorage) setSelectedCar(JSON.parse(carFromStorage));
      // … resto de cargas (insurance, extras, userData, discount)
    }

    const carFromStorage = localStorage.getItem("selectedCar");
    const insuranceFromStorage = localStorage.getItem("selectedInsurance");
    const extrasFromStorage = localStorage.getItem("selectedExtras");
    const userFromStorage = localStorage.getItem("userData");
    const discountFromStorage = localStorage.getItem("discount");

    if (carFromStorage) setSelectedCar(JSON.parse(carFromStorage));
    if (insuranceFromStorage)
      setSelectedInsurance(JSON.parse(insuranceFromStorage));
    if (extrasFromStorage) setSelectedExtras(JSON.parse(extrasFromStorage));
    if (userFromStorage) setUserData(JSON.parse(userFromStorage));
    if (discountFromStorage) setDiscount(JSON.parse(discountFromStorage));

    // ✅ Marca que ya se intentó cargar el coche
    setIsCarLoaded(true);
  }, []);

  // Guardar cada valor en localStorage
  useEffect(() => {
    if (selectedCar) {
      localStorage.setItem("selectedCar", JSON.stringify(selectedCar));
    } else {
      localStorage.removeItem("selectedCar");
    }
  }, [selectedCar]);

  useEffect(() => {
    if (selectedInsurance) {
      localStorage.setItem(
        "selectedInsurance",
        JSON.stringify(selectedInsurance)
      );
    } else {
      localStorage.removeItem("selectedInsurance");
    }
  }, [selectedInsurance]);

  useEffect(() => {
    if (selectedExtras) {
      localStorage.setItem("selectedExtras", JSON.stringify(selectedExtras));
    } else {
      localStorage.removeItem("selectedExtras");
    }
  }, [selectedExtras]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if (discount !== null) {
      localStorage.setItem("discount", JSON.stringify(discount));
    } else {
      localStorage.removeItem("discount");
    }
  }, [discount]);

  // Función para limpiar todo
  const clearBooking = () => {
    setSelectedCar(null);
    setSelectedInsurance(null);
    setSelectedExtras({});
    setUserData({});
    setDiscount(null);

    localStorage.removeItem("selectedCar");
    localStorage.removeItem("selectedInsurance");
    localStorage.removeItem("selectedExtras");
    localStorage.removeItem("userData");
    localStorage.removeItem("discount");

    sessionStorage.setItem("bookingCleared", "true");
  };

  return (
    <BookingContext.Provider
      value={{
        selectedCar,
        setSelectedCar,
        selectedInsurance,
        setSelectedInsurance,
        selectedExtras,
        setSelectedExtras,
        userData,
        setUserData,
        discount,
        setDiscount,
        isCarLoaded, // ✅ lo exportamos
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
