import React, { use, useEffect } from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";
import { useSearch } from "@/contexts/SearchContext";
import { useBooking } from "@/contexts/BookingContext";

export default function Index() {
  const { clearSearch } = useSearch();
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
      <Box
        component="section"
        id="sectionTwo"
        sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Nuestra flota
          </Typography>
          <Divider
            variant="middle"
            sx={{
              width: 60,
              height: 4,
              backgroundColor: "primary.main",
              mx: "auto",
              mb: 2,
            }}
          />
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Tenemos los mejores autos de acuerdo a tus necesidades
          </Typography>
          <Box sx={{ mx: -2, px: 2 }}>
            <Carousel />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
