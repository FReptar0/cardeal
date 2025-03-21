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
    <Container sx={{ marginTop: "148px", paddingX: 2 }}>
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            gap: 1,  // Reducimos el espacio entre elementos
        }}
    >
        {/* SearchBar con altura automática */}
        <SearchBar 
            sx={{ 
                width: "100%", 
                transition: "all 0.3s ease-in-out", // Suaviza el crecimiento
                marginBottom: 0, // Evita espacio extra
            }} 
        />

        {/* RentalStepper sin margen extra */}
        <Box sx={{ width: "100%", marginTop: -12 }}> 
            <RentalStepper />
        </Box>
    </Box>

    {/* Sección de cards */}
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
        }}
    >
        <Box
            sx={{
                pb: 3,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minHeight: "80vh",
                alignItems: "center",
            }}
        >
            {filteredCars.map((car, index) => (
                <CarCard
                    key={index}
                    car={car}
                    sx={{
                        width: "100%", 
                        maxWidth: "1200px",
                    }}
                />
            ))}
        </Box>
    </Box>
</Container>

  );
}
