// components/Hero.js
import React, { useState } from "react";
import { Grid } from "@mui/material";
import dynamic from "next/dynamic";
import carsData from "../data/cars.json";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

export default function Hero() {
  const [filteredCars, setFilteredCars] = useState(carsData);

  const handleSearch = (filters) => {
    setFilteredCars(carsData);
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{
        width: "100%",
        margin: 0,
        overflow: "hidden",
        // Desplaza todo el Hero bajo la navbar (64px) sólo en móviles
        mt: { xs: "64px", lg: 0 },
        // Ocupa todo el alto restante y permite centrar verticalmente
        minHeight: { xs: "calc(100vh - 64px)", lg: "auto" },
      }}
    >
      {/* --- Sección Izquierda (imagen) --- */}
      <Grid
        item
        xs={12}
        lg={6}
        sx={{
          display: { xs: "none", lg: "block" },
          position: "relative",
          overflow: "visible",
          width: "100%",
          minHeight: "400px",
        }}
      >
        <img
          src="/extras/background-mexico-light.png"
          alt="Fondo"
          style={{
            maxWidth: "90%",
            height: "auto",
            position: "absolute",
            top: "45%",
            left: "52%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />
        <img
          src="/photos/suv-5-lx/Xtrail-lateral-frente.webp"
          alt="Auto de ejemplo"
          style={{
            maxWidth: "80%",
            height: "auto",
            position: "absolute",
            top: "73%",
            left: "15%",
            transform: "translateY(-50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      </Grid>

      {/* --- Sección Derecha (texto + buscador) --- */}
      <Grid
        item
        xs={12}
        lg={6}
        sx={{
          display: "flex",
          marginTop: { xs: "64px", lg: "200px" }, // Baja el texto en móvil
          // Centra vertical y horizontalmente en móvil
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <div style={{ width: "100%" }}>
          <h2
            id="sectionDerechaTitle"
            style={{
              fontWeight: 700,
              fontSize: "1.8rem",

              marginBottom: { xs: "8px", lg: "32px" }, // espacio reducido

              marginTop: { xs: "64px", lg: "200px" }, // Baja el texto en escritorio
              color: "#10906a",
              textAlign: "center", // Asegura que el texto esté centrado
              padding: "0 16px", // Añade espacio hacia los lados
              boxSizing: "border-box", // Asegura que el padding no afecte el ancho
              width: "100%", // Asegura que ocupe todo el ancho disponible
            }}
          >
            Renta el auto que necesitas, sin letras chiquitas
          </h2>

          <div
            style={{
              marginTop: "4px", // espacio mínimo
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
