"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para almacenar el token JWT, la fecha/hora de inicio de sesión y el status de autenticación
  const [jwt, setJwt] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const isJwtExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return false; // Token sin expiración (remember=true)
      const now = Math.floor(Date.now() / 1000); // en segundos
      return payload.exp < now;
    } catch (e) {
      return true; // Token corrupto o mal formado
    }
  };

  const decodeJwt = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Al montar el componente, intenta leer los datos del localStorage
  useEffect(() => {
    const storedJwt = localStorage.getItem("authJwt");
    const storedSessionStart = localStorage.getItem("sessionStart");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedIsVerified = localStorage.getItem("isVerified");

    if (storedJwt && storedSessionStart && storedIsLoggedIn === "true") {
      if (isJwtExpired(storedJwt)) {
        logout();
      } else {
        setJwt(storedJwt);
        setSessionStart(new Date(storedSessionStart));
        setIsLoggedIn(true);
        setIsVerified(storedIsVerified === "true"); 
      }
    }
  }, []);

  // Sincroniza el JWT con localStorage
  useEffect(() => {
    if (jwt) {
      localStorage.setItem("authJwt", jwt);
    } else {
      localStorage.removeItem("authJwt");
    }
  }, [jwt]);

  // Sincroniza la fecha/hora de inicio de sesión con localStorage
  useEffect(() => {
    if (sessionStart) {
      localStorage.setItem("sessionStart", sessionStart.toString());
    } else {
      localStorage.removeItem("sessionStart");
    }
  }, [sessionStart]);

  // Sincroniza el status de autenticación con localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  // Función para iniciar sesión: guarda el JWT, la fecha de inicio y establece el status en true
  const login = (token) => {
    return new Promise((resolve) => {
      const payload = decodeJwt(token);
      setJwt(token);
      setSessionStart(new Date());
      setIsLoggedIn(true);
      setIsVerified(payload?.isVerified ?? true);

      localStorage.setItem(
        "isVerified",
        (payload?.isVerified ?? true).toString()
      );

      setTimeout(() => {
        resolve(token);
      }, 0);
    });
  };

  // Función para cerrar sesión: limpia todos los estados y el localStorage
  const logout = () => {
    setJwt(null);
    setSessionStart(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authJwt");
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider
      value={{ jwt, sessionStart, isLoggedIn, isVerified, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
