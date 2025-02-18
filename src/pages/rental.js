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
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "85vh", alignItems: "flex-start", width: "100%" }}>

                <Box sx={{ width: { xs: "100%", md: "30%" }, paddingRight: { md: 2 }, marginBottom: { xs: 2, md: 0 }, display: "flex", justifyContent: "center" }}>
                    <SearchBar onSearch={handleSearch} />
                </Box>

                <Box sx={{ pb: 3, width: { xs: "100%", md: "70%" }, paddingLeft: { md: 2 }, display: "flex", flexDirection: "column", gap: 2, minHeight: "80vh", overflowY: "auto" }}>
                    {filteredCars.map((car, index) => (
                        <CarCard key={index} car={car} />
                    ))}
                </Box>
            </Box>
        </Container>
    );
}