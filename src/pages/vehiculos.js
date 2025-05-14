import React, { useState } from "react";
import { useRouter } from "next/router"; // AGREGAR: IMPORTAR useRouter PARA REDIRECCIÓN
import { useBooking } from "@/contexts/BookingContext"; // AGREGAR: IMPORTAR useBooking PARA GUARDAR SELECCIÓN EN CONTEXTO
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import carData from "../data/cars.json";
import InfoIcon from "@mui/icons-material/Info";
import LuggageIcon from "@mui/icons-material/Luggage";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

import Hero from "../components/Hero";
import CTA from "@/components/CTA";

// Galería
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Flota() {
  const router = useRouter(); // AGREGAR: CREAR INSTANCIA router PARA NAVEGACIÓN
  const { setmodalCar } = useBooking(); // AGREGAR: DESCTRUCTURAR setmodalCar PARA ACTUALIZAR CONTEXTO
  const [open, setOpen] = useState(false);
  const [modalCar, setModalCar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Función para abrir el modal con el auto seleccionado
  const handleOpenModal = (car) => {
    setModalCar(car); // GUARDAMOS EN modalCar
    setOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 4,
        marginTop: "120px",
        overflowX: "hidden",
      }}
    >
      <div
        id="sectionOne"
        style={{ height: "auto", width: "100%", marginTop: "-155px" }}
      >
        <Hero />
      </div>

      <Box sx={{ marginTop: 16 }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="black">
          FLOTA DE AUTOS
        </Typography>
      </Box>

      <Typography
        variant="body1"
        gutterBottom
        textAlign="center"
        maxWidth="600px"
        color="black"
      >
        Queremos que tu viaje sea cómodo y seguro, ofreciendo una amplia
        categoría de vehículos.
      </Typography>

      {/* LISTADO DE AUTOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // una columna en pantallas pequeñas
            sm: "1fr 1fr", // dos columnas en pantallas medianas
            md: "1fr 1fr 1fr 1fr", // cuatro columnas en pantallas grandes
          },
          gap: 2,
          maxWidth: "1200px",
          mt: 2,
        }}
      >
        {carData.map((car, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ddd",
              borderRadius: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 180,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                onClick={() => handleOpenModal(car)}
                image={car.image}
                alt={car.name}
                sx={{
                  width: "90%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  fontSize="1rem"
                  textAlign="center"
                >
                  {car.category}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" color="gray" textAlign="center">
                  {car.name}
                </Typography>
                {car.abbreviation && (
                  <>
                    <Typography
                      variant="subtitle2"
                      color="gray"
                      textAlign="center"
                    >
                      ({car.abbreviation})
                    </Typography>
                    {car.abbreviationMeaning && car.abbreviationDescription && (
                      <Tooltip
                        title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`}
                        arrow
                      >
                        <IconButton size="small" sx={{ padding: 0 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-pax.svg"
                    alt="Pasajeros"
                    width="16"
                    height="16"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">{car.passengers}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-door.svg"
                    alt="Puertas"
                    width="16"
                    height="16"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">{car.doors}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                  <Typography variant="body2">{car.luggage}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-trans.svg"
                    alt="Transmisión"
                    width="16"
                    height="16"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">{car.transmission}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1,
                  gap: 2, // Espaciado entre los botones
                }}
              >
                <Button
                  onClick={() => handleOpenModal(car)}
                  variant="body2"
                  fontWeight="medium"
                  color="#10906a"
                  startIcon={<PhotoLibraryIcon />}
                  sx={{
                    marginTop: 1,
                    fontSize: "12px",
                    textTransform: "none",
                    color: "gray",
                    "&:hover": {
                      backgroundColor: "gray",
                      color: "white",
                      transition:
                        "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                    },
                  }}
                >
                  Ver más detalles
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="contained"
                  sx={{
                    backgroundColor: "#10906a",
                    color: "white",
                    fontSize: "12px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#0e7a5a",
                    },
                  }}
                >
                  Rentar
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          mt: 4,
          // forzar full‐viewport width:
          width: "100vw",

          mb: 0,
        }}
      >
        <CTA />
      </Box>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            width: "80vw",
            maxWidth: "1200px",
            height: "90vh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {modalCar && (
            <>
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                mb={2}
              >
                {modalCar.name}
              </Typography>

              <Tabs
                value={tabIndex}
                onChange={(_, newIndex) => setTabIndex(newIndex)}
                centered
              >
                <Tab label="IMÁGENES" />
                <Tab label="VISTA 360°" />
              </Tabs>

              {/* CONTENEDOR PRINCIPAL DE LA IMAGEN/IFRAME */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {tabIndex === 0 ? (
                  <Swiper
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    modules={[Navigation]}
                    style={{ width: "100%", height: "60vh" }}
                  >
                    {(modalCar.images || []).map((img, index) => (
                      <SwiperSlide
                        key={index}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "100%",
                            maxHeight: "80vh",
                            borderRadius: 5,
                            objectFit: "contain",
                            margin: "0 ",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                    <div
                      className="swiper-button-next"
                      style={{ color: "black" }}
                    ></div>
                    <div
                      className="swiper-button-prev"
                      style={{ color: "black" }}
                    ></div>
                  </Swiper>
                ) : (
                  <iframe
                    src={modalCar.image360}
                    style={{
                      width: "100%",
                      height: "60vh",
                      border: "none",
                      borderRadius: 5,
                    }}
                  ></iframe>
                )}
              </Box>

              {/* CONTENEDOR DE ÍCONOS ABAJO */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-pax.svg"
                    alt="Pasajeros"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">
                    {modalCar.passengers} pasajeros
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-door.svg"
                    alt="Puertas"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">
                    {modalCar.doors} puertas
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                  <Typography variant="body2">
                    {modalCar.luggage} maletas
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-trans.svg"
                    alt="Transmisión"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">
                    {modalCar.transmission}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-pet.svg"
                    alt="Pet friendly"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">Pet friendly</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ice.svg"
                    alt="Aire acondicionado"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">Aire acondicionado</Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
