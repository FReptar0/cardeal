import React, { useState } from "react";
import { Box, Grid, Autocomplete, TextField, Checkbox, FormControlLabel } from "@mui/material";
import SearchBar from "../components/SearchBar";
import carsData from "../data/cars.json";


// const options = [
//   "Aeropuerto Internacional de la Ciudad de México (AICM) - CDMX",
//   "Aeropuerto Internacional de Guadalajara (GDL)",
//   "Aeropuerto Internacional de Monterrey (MTY)",
//   "Aeropuerto Internacional de Cancún (CUN)",
//   "Aeropuerto Internacional de Tijuana (TIJ)",
// ];

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
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <div
        id="sectionOne"
        style={{
          height: "90vh",
          width: "90%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {/* Sección Izquierda */}
          <Grid item xs={12} md={12} lg={6}>
            <img
              style={{ width: "95vh", marginTop: "-50px" }}
              src="/images-seguros/Miata3.png"
              alt="Auto"
            />
            <h2
              style={{
                fontWeight: 300,
                fontSize: "2.5rem",
                textAlign: "start",
                marginLeft: "50px",
              }}
            >
              Renta un <span style={{ color: "#ff3f60" }}>SUEÑO</span>, renta un{" "}
              <span style={{ color: "#10906a" }}>AUTO</span>. <br /> Rápido y sencillo.
            </h2>
          </Grid>

          {/* Sección Derecha */}
          <Grid item xs={12} md={12} lg={6}>
            <div className="custom-search-bar">
              <SearchBar onSearch={handleSearch} />
            </div>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}
