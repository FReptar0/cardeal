// /contexts/AuthContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [jwt, setJwt] = useState(null);
    const [sessionStart, setSessionStart] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Al montar, intenta leer los datos del localStorage
    useEffect(() => {
        const storedJwt = localStorage.getItem("authJwt");
        const storedSessionStart = localStorage.getItem("sessionStart");
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

        if (storedJwt && storedSessionStart && storedIsLoggedIn === "true") {
            setJwt(storedJwt);
            setSessionStart(new Date(storedSessionStart));
            setIsLoggedIn(true);
        }
    }, []);

    // Sincroniza cada estado con localStorage
    useEffect(() => {
        if (jwt) {
            localStorage.setItem("authJwt", jwt);
        } else {
            localStorage.removeItem("authJwt");
        }
    }, [jwt]);

    useEffect(() => {
        if (sessionStart) {
            localStorage.setItem("sessionStart", sessionStart.toString());
        } else {
            localStorage.removeItem("sessionStart");
        }
    }, [sessionStart]);

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    }, [isLoggedIn]);

    // Verificar automáticamente si el token sigue siendo válido
    useEffect(() => {
        if (jwt) {
            try {
                const decoded = jwtDecode(jwt);
                // Si el token tiene la propiedad "exp"
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    // El token ha expirado; cerrar sesión
                    logout();
                }
            } catch (error) {
                console.error("Error decodificando el token", error);
                logout();
            }
        }
    }, [jwt]);

    // Función para iniciar sesión: guarda el JWT, la fecha de inicio y establece el status en true
    const login = (token) => {
        setJwt(token);
        setSessionStart(new Date());
        setIsLoggedIn(true);
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
            value={{
                jwt,
                sessionStart,
                isLoggedIn,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
