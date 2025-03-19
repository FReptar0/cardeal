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
        <Container sx={{ marginTop: 4, maxWidth: "100vw", paddingX: 2 }}>
            <RentalStepper />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "85vh",
                    alignItems: "flex-start",
                    width: "100%"
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
                        overflowY: "auto",
                        alignItems: "center", // Centrar las cards
                    }}
                >
                    {filteredCars.map((car, index) => (
                        <CarCard
                            key={index}
                            car={car}
                            sx={{
                                width: "95%", // Cards más anchas
                                maxWidth: "1100px", // Límite en pantallas grandes
                                margin: "auto", // Centradas en el contenedor
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
