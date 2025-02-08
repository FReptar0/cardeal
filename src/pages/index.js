import React, { useState } from "react";
import { Box } from "@mui/material";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";

export default function Index() {
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
          height: "auto",
          width: "100%",
        }}
      >
        <Hero></Hero>
      </div>

      <div
        id="sectionTwo"
        style={{
          height: "90vh",
          marginTop: "80px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginTop: "250px" }}>
          <h2 style={{ fontSize: "44px" }}>Nuestra flota</h2>
          <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Tenemos los mejores autos de acuerdo a tus necesidades
          </p>
        </div>
        <Carousel />
      </div>
    </Box>
  );
}
