import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import carData from "../data/cars.json";
import SearchBar from "../components/SearchBar";

export default function Flota() {
   const handleSearch = (filters) => {
      setFilteredCars(carsData);
    };
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, marginTop: "120px" }}>
      <div
        id="sectionOne"
        style={{
          height: "110vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {/* Sección Izquierda */}
          <Grid item xs={12} md={12} lg={6} sx={{
            display: { xs: "none", lg: "block" } // Solo mostrar en pantallas grandes
          }} style={{ position: "relative" }}>
            {/* Fondo detrás de la imagen */}
            {/* Imagen de fondo */}
            <img
              src="/extras/background-mexico-light.png"
              alt="Fondo"
              style={{
                width: "600px", // Ajusta el tamaño del fondo
                height: "auto",
                position: "absolute",
                top: "10%",
                left: "52%",
                transform: "translate(-50%, -50%)",
                zIndex: -1, // Envía el fondo detrás de la imagen principal
              }}
            />

            {/* Imagen en primer plano */}
            <img
              style={{
                width: "80vh",
                position: "relative",
                top: "30px",
                zIndex: 0,
              }}
              src="/cars/CRV.png"
              alt="Auto"
            />
          </Grid>
          {/* Sección Derecha */}
          <Grid item xs={12} md={12} lg={6} sx={{ zIndex: 2 }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "absolute", top: "100px", width: "500px" }}>
                <h2
                  id='sectionDerechaTitle'
                  style={{
                    position: "relative",
                    top: "40px",
                    fontWeight: 300,
                    fontSize: "2rem",
                    textAlign: "start",
                    marginBottom: "24px",
                  }}
                >
                  <span style={{ color: "#ff3f60", fontWeight: 900 }}>
                    Renta un sueño, renta un auto
                  </span>{" "}
                  <br />{" "}
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      position: "relative",
                      top: "-10px",
                    }}
                  >
                    {" "}
                    Rápido y sencillo{" "}
                  </span>
                </h2>
              </div>
              <div
                className="custom-search-bar"
                style={{ width: "40%", position: "absolute", top: "250px" }}
              >
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <Box sx={{
        marginTop: -35,
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