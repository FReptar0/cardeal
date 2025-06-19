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
              alignItems: "flex-start",
              // --- estilos móviles ---
              ...(typeof window !== "undefined" && window.innerWidth <= 600
                ? {
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}),
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                // --- estilos móviles ---
                ...(typeof window !== "undefined" && window.innerWidth <= 600
                  ? {
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "160px",
                      padding: "0 8px",
                      position: "static",
                      marginTop: "120px", // Espacio para la navbar
                    }
                  : { top: "100px" }),
              }}
            >
              <h2
                id="sectionDerechaTitle"
                style={{
                  fontWeight: 300,
                  fontSize: "2rem",
                  textAlign: "start",
                  marginBottom: "24px",
                  marginTop: 0,
                  position: "relative",
                  // --- estilos móviles ---
                  ...(typeof window !== "undefined" && window.innerWidth <= 600
                    ? {
                        textAlign: "center",
                        fontSize: "1.7rem",
                        lineHeight: 1.2,
                        display: "block",
                        fontWeight: 700,
                        margin: 0,
                        width: "100%",
                        position: "static",
                      }
                    : { top: "40px" }),
                }}
              >
                <span
                  style={{
                    color: "#10906a",
                    fontWeight: 900,
                    marginBottom: 0,
                    display: "block",
                    // --- estilos móviles ---
                    ...(typeof window !== "undefined" &&
                    window.innerWidth <= 600
                      ? {
                          width: "100%",
                          textAlign: "center",
                          fontSize: "1.7rem",
                          lineHeight: 1.2,
                        }
                      : {}),
                  }}
                >
                  Renta el auto que necesitas,
                  <br />
                  sin letras chiquitas
                </span>
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
                ...(typeof window !== "undefined" && window.innerWidth <= 600
                  ? {
                      marginTop: "32px", // Espacio reducido en mobile
                      marginLeft: 0,
                      padding: "0 16px",
                      boxSizing: "border-box",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {}),
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
