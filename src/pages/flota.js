import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import carData from "../data/cars.json";
import SearchBar from "../components/SearchBar";
import Hero from "../components/Hero";

export default function Flota() {
   const handleSearch = (filters) => {
      setFilteredCars(carsData);
    };
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, marginTop: "120px" }}>
      <div
        id="sectionOne"
        style={{
          height: "auto",
          width: "100%",
          marginTop: "-155px"
        }}
      >
        <Hero></Hero>
      </div>

      <Box sx={{
        marginTop: 30,
      }}><Typography variant="h4" gutterBottom textAlign="center" color="black" >
        FLOTA DE AUTOS
      </Typography></Box>

      <Typography variant="body1" gutterBottom textAlign="center" maxWidth="600px" color="black">
        Queremos que tu viaje sea cómodo y seguro, ofreciendo una amplia categoría de vehículos.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2, maxWidth: "1200px" }}>
        {carData.map((car, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "white", color: "black" }}>
              <Box sx={{ width: "100%", height: 150, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={car.image}
                  alt={car.name}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" fontSize="1rem" textAlign="center">
                  {car.name}
                </Typography>
                <Typography variant="subtitle2" color="gray" textAlign="center">
                  {car.category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="https://dealrentacar.com/images/icons/ic-pax.svg" alt="Pasajeros" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.passengers}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="https://dealrentacar.com/images/icons/ic-door.svg" alt="Puertas" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.doors}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                    <Typography variant="body2">{car.luggage}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="https://dealrentacar.com/images/icons/ic-trans.svg" alt="Transmisión" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.transmission}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}