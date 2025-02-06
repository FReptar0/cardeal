"use client";

import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";

export default function RentalPage() {
    const [filteredCars, setFilteredCars] = useState(carsData);

    const handleSearch = (filters) => {
        setFilteredCars(carsData);
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Grid2 container spacing={2}>
                {/* 🟥 LADO IZQUIERDO - BUSCADOR */}
                <Grid2 xs={12} md={4}>
                    <SearchBar onSearch={handleSearch} />
                </Grid2>

                {/* 🟦 LADO DERECHO - TARJETAS DE AUTOS */}
                <Grid2 xs={12} md={8}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {filteredCars.map((car, index) => (
                            <CarCard key={index} car={car} />
                        ))}
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    );
}
