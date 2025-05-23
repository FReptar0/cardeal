import React, { use, useEffect } from "react";
import { Box } from "@mui/material";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";
import { useSearch } from "@/contexts/SearchContext";
import { useBooking } from "@/contexts/BookingContext";

export default function Index() {
  const {clearSearch} = useSearch();
  const { clearBooking } = useBooking();
  useEffect(() => {
    clearSearch();
    clearBooking();
  }, []);
  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      {/* Sección Hero */}
      <div id="sectionOne" style={{ width: "100%" }}>
        <Hero />
      </div>

      {/* Sección de video */}
      <div
        style={{
          width: "100%",
          backgroundColor: "black",
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16 / 9",
          maxHeight: "600px",
          marginTop: "10%",
        }}
      >
        <video
          src="/videos/LOGO.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Sección Nuestra Flota */}
      <div
        id="sectionTwo"
        style={{
          paddingTop: "80px",
          paddingBottom: "40px",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "44px", marginBottom: "10px" }}>
            Nuestra flota
          </h2>
          <p style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Tenemos los mejores autos de acuerdo a tus necesidades
          </p>
        </div>
        <div style={{ width: "100%", marginTop: "-5%" }}>
          <Carousel />
        </div>
      </div>
    </Box>
  );
}
