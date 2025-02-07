import React, { useState } from "react";
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import carsData from "../data/cars.json";
import zIndex from "@mui/material/styles/zIndex";
import Carousel from "../components/Carousel";

export default function Index() {
  // const [sameLocation, setSameLocation] = useState(true);
  const [filteredCars, setFilteredCars] = useState(carsData);

  const handleSearch = (filters) => {
    setFilteredCars(carsData);
  };

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        height: "auto",
      }}
    >
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

      <div
        id="sectionTwo"
        style={{
          height: "82vh",
        }}
      >
        <div><h2 style={{ fontSize: "44px" }}>Nuestra flota</h2>
          <p style={{ fontSize: "1.3rem", fontWeight: "600", }}>Tenemos los mejores autos de acuerdo a tus necesidades</p></div>
        <Carousel />
      </div>
    </Box>
  );
}
