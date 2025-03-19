"use client";

import { useState } from "react";
import { Container, Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";
import RentalStepper from "../components/Stepper";

export default function RentalPage() {
    const [filteredCars, setFilteredCars] = useState(carsData);

    const handleSearch = (filters) => {
        setFilteredCars(carsData);
    };

    return (
        <Container sx={{ marginTop: 4, paddingX: 0 }}> {/* Eliminamos maxWidth para evitar recortes */}
            <RentalStepper />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // Centrar las tarjetas
                    width: "100%",
                }}
            >
                {/* Contenedor de las cards mejorado */}
                <Box
                    sx={{
                        pb: 3,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        minHeight: "80vh",
                        alignItems: "center", // Centra las tarjetas horizontalmente
                    }}
                >
                    {filteredCars.map((car, index) => (
                        <CarCard
                            key={index}
                            car={car}
                            sx={{
                                width: "100%", // Usa todo el ancho disponible
                                maxWidth: "1200px", // Límite para que no se expanda demasiado
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
