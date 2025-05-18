"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Define estados globales para vehículo, seguro, extras y datos del usuario
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [userData, setUserData] = useState({});
  const [discount, setDiscount] = useState(null); // Nuevo estado para el descuento

  // Al montar, intenta leer los datos del localStorage
  useEffect(() => {
    if (sessionStorage.getItem("bookingCleared") === "true") {
      sessionStorage.removeItem("bookingCleared");
      return;
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
  }, []);

  // Sincroniza cada estado con localStorage cuando cambia
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
    localStorage.setItem("selectedExtras", JSON.stringify(selectedExtras));
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

  // Función para limpiar toda la data (por ejemplo, al finalizar la reserva)
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
    sessionStorage.setItem("bookingCleared", "true");
    localStorage.removeItem("discount");
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
        setDiscount, // Nuevo campo
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
