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
    <>
      <Grid
        container
        spacing={0}
        sx={{ flexGrow: 1, overflowX: "hidden", width: "100%", margin: 0 }}
      >
        {/* Sección Izquierda */}
        <Grid
          item
          xs={12}
          md={12}
          lg={6}
          sx={{
            display: { xs: "none", lg: "block" },
            position: "relative",
            overflow: "visible", // <-- seguimos con visible
            width: "100%",
            minHeight: "400px",
          }}
        >
          {/* Fondo detrás de la imagen */}
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
          {/* Imagen en primer plano */}
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

        {/* Sección Derecha */}
        <Grid item xs={12} md={12} lg={6} sx={{ zIndex: 2 }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                top: "100px",
                width: "100%",
              }}
            >
              <h2
                id="sectionDerechaTitle"
                style={{
                  position: "relative",
                  top: "40px",
                  fontWeight: 300,
                  fontSize: "2rem",
                  textAlign: "start",
                  marginBottom: "24px",
                  // --- estilos móviles ---
                  "@media (max-width: 600px)": {
                    textAlign: "justify",
                    fontSize: "1.6rem",
                    lineHeight: 1.3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                    marginTop: 0,
                    marginBottom: 0,
                  },
                }}
              >
                <span
                  style={{
                    color: "#10906a",
                    fontWeight: 900,
                    marginBottom: "20px",
                    // --- estilos móviles ---
                    "@media (max-width: 600px)": {
                      width: "100%",
                      display: "block",
                      textAlign: "justify",
                    },
                  }}
                >
                  Renta el auto que necesitas, sin letras chiquitas
                </span>{" "}
                <br />{" "}
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    position: "relative",
                    top: "-10px",
                  }}
                ></span>
              </h2>
            </div>
            <div
              className="custom-search-bar"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "140px",
                marginLeft: "20px",
                // --- estilos móviles ---
                "@media (max-width: 600px)": {
                  marginLeft: 0,
                  padding: "0 16px",
                  boxSizing: "border-box",
                },
              }}
            >
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
