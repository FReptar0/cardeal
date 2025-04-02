import React, { useState } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid, Modal, Tooltip, IconButton, Link, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import carData from "../data/cars.json";
import InfoIcon from "@mui/icons-material/Info";
import LuggageIcon from "@mui/icons-material/Luggage";

import Hero from "../components/Hero";

// Galería
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Flota() {
  const [open, setOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Función para abrir el modal con el auto seleccionado
  const handleOpenModal = (car) => {
    setSelectedCar(car);
    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, marginTop: "120px" }}>
      <div id="sectionOne" style={{ height: "auto", width: "100%", marginTop: "-155px" }}>
        <Hero />
      </div>

      <Box sx={{ marginTop: 30 }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="black">
          FLOTA DE AUTOS
        </Typography>
      </Box>

      <Typography variant="body1" gutterBottom textAlign="center" maxWidth="600px" color="black">
        Queremos que tu viaje sea cómodo y seguro, ofreciendo una amplia categoría de vehículos.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2, maxWidth: "1200px" }}>
        {carData.map((car, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "white", color: "black" }}>
              <Box sx={{ width: "100%", height: 150, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                <CardMedia component="img" image={car.image} alt={car.name} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="h6" fontWeight="bold" fontSize="1rem" textAlign="center">
                    {car.category}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Typography variant="subtitle2" color="gray" textAlign="center">
                    {car.name}
                  </Typography>
                  {car.abbreviation && (
                    <>
                      <Typography variant="subtitle2" color="gray" textAlign="center">
                        ({car.abbreviation})
                      </Typography>
                      {car.abbreviationMeaning && car.abbreviationDescription && (
                        <Tooltip title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`} arrow>
                          <IconButton size="small" sx={{ padding: 0 }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="/icons/ic-pax.svg" alt="Pasajeros" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.passengers}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="/icons/ic-door.svg" alt="Puertas" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.doors}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                    <Typography variant="body2">{car.luggage}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img src="/icons/ic-trans.svg" alt="Transmisión" width="16" height="16" style={{ filter: "brightness(0)" }} />
                    <Typography variant="body2">{car.transmission}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                  <Link onClick={() => handleOpenModal(car)} variant="body2" fontWeight="medium" color="#10906a" sx={{ cursor: "pointer" }}>
                    Ver más detalles
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          width: "80vw",
          maxWidth: "1200px",
          height: "80vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>

          {selectedCar && (
            <>
              <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
                {selectedCar.name}
              </Typography>

              <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} centered>
                <Tab label="IMÁGENES" />
                <Tab label="VISTA 360°" />
              </Tabs>

              <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {tabIndex === 0 ? (
                  <Swiper navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }} modules={[Navigation]} style={{ width: "100%", height: "60vh" }}>
                    {(selectedCar.images || []).map((img, index) => (
                      <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                        <img src={img} alt={`Imagen ${index + 1}`} style={{ maxWidth: "80%", maxHeight: "50vh", borderRadius: 5, objectFit: "contain", margin: "0 20px" }} />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-button-next" style={{ color: 'black' }}></div>
                    <div className="swiper-button-prev" style={{ color: 'black' }}></div>
                  </Swiper>
                ) : (
                  <iframe
                    src="https://360.pymesdigital.com.mx/Grupo%20Andrade%20360/"
                    style={{
                      width: "100%",
                      height: "60vh",
                      border: "none",
                      borderRadius: 5
                    }}
                  ></iframe>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
