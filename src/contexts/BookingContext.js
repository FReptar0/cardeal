// contexts/BookingContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Define estados globales para auto, seguro, extras y datos del usuario
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [userData, setUserData] = useState({});

  // Cuando se monta, intenta leer los datos del localStorage
  useEffect(() => {
    const carFromStorage = localStorage.getItem("selectedCar");
    const insuranceFromStorage = localStorage.getItem("selectedInsurance");
    const extrasFromStorage = localStorage.getItem("selectedExtras");
    const userFromStorage = localStorage.getItem("userData");

    if (carFromStorage) setSelectedCar(JSON.parse(carFromStorage));
    if (insuranceFromStorage)
      setSelectedInsurance(JSON.parse(insuranceFromStorage));
    if (extrasFromStorage) setSelectedExtras(JSON.parse(extrasFromStorage));
    if (userFromStorage) setUserData(JSON.parse(userFromStorage));
  }, []);

  // Sincroniza cada estado con localStorage cuando cambia
  useEffect(() => {
    selectedCar
      ? localStorage.setItem("selectedCar", JSON.stringify(selectedCar))
      : localStorage.removeItem("selectedCar");
  }, [selectedCar]);

  useEffect(() => {
    selectedInsurance
      ? localStorage.setItem(
          "selectedInsurance",
          JSON.stringify(selectedInsurance)
        )
      : localStorage.removeItem("selectedInsurance");
  }, [selectedInsurance]);

  useEffect(() => {
    localStorage.setItem("selectedExtras", JSON.stringify(selectedExtras));
  }, [selectedExtras]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  // Función para limpiar toda la data (por ejemplo, al finalizar la reserva)
  const clearBooking = () => {
    setSelectedCar(null);
    setSelectedInsurance(null);
    setSelectedExtras({});
    setUserData({});
    localStorage.removeItem("selectedCar");
    localStorage.removeItem("selectedInsurance");
    localStorage.removeItem("selectedExtras");
    localStorage.removeItem("userData");
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
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
