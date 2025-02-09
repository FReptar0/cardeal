import React, { useState } from "react";
import { Grid } from "@mui/material";
import SearchBar from "../components/SearchBar";
import carsData from "../data/cars.json";

export default function Hero() {
  const [filteredCars, setFilteredCars] = useState(carsData);

  const handleSearch = (filters) => {
    setFilteredCars(carsData);
  };

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      {/* Sección Izquierda */}
      <Grid
        item
        xs={12}
        md={12}
        lg={6}
        sx={{
          display: { xs: "none", lg: "block" }, // Solo mostrar en pantallas grandes
        }}
        style={{ position: "relative" }}
      >
        {/* Fondo detrás de la imagen */}
        {/* Imagen de fondo */}
        <img
          src="/extras/background-mexico-light.png"
          alt="Fondo"
          style={{
            width: "600px", // Ajusta el tamaño del fondo
            height: "auto",
            position: "absolute",
            top: "40%",
            left: "52%",
            transform: "translate(-50%, -50%)",
            zIndex: -1, // Envía el fondo detrás de la imagen principal
          }}
        />

        {/* Imagen en primer plano */}
        <img
          style={{
            width: "80vh",
            position: "absolute",
            top: "13%",
            left: "15%",
            zIndex: 0,
          }}
          src="/cars/camioneta.png"
          alt="Auto de ejemplo"
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
          <div style={{ position: "relative", top: "100px", width: "100%" }}>
            <h2
              id="sectionDerechaTitle"
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
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "120px",
            }}
          >
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
