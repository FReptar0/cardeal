import React, { useState } from "react";
import { useRouter } from "next/router";
import { useBooking } from "@/contexts/BookingContext";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  IconButton,
  Tabs,
  Tab,
  Button,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import CTA from "@/components/CTA";
import carData from "../data/cars.json";

export default function Flota() {
  const theme = useTheme();
  const router = useRouter();
  const { setmodalCar } = useBooking();
  const [open, setOpen] = useState(false);
  const [modalCar, setModalCar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpenModal = (car) => {
    setModalCar(car);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        pt: 6,
        pb: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      {/* Título y descripción */}
      <Typography
        variant="h3"
        gutterBottom
        textAlign="center"
        sx={{ mb: 6, mt: 9 }} // Incrementar margen inferior
      >
        FLOTA DE AUTOS
      </Typography>
      <Typography
        variant="body1"
        maxWidth="640px"
        textAlign="center"
        sx={{ mb: 6 }} // Incrementar margen inferior
      >
        Queremos que tu viaje sea cómodo y seguro, ofreciendo una amplia
        categoría de vehículos.
      </Typography>

      {/* Carrusel centrado en full viewport */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          overflow: "visible", // Cambiar de 'hidden' a 'visible' para permitir que el escalado de la tarjeta central se muestre completamente
          mt: 8,
        }}
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={3} // Asegurar que solo se muestren 3 autos a la vez
          centeredSlides
          loop
          spaceBetween={60}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSwiper={(sw) => setActiveIndex(sw.realIndex)}
          onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
          style={{
            overflow: "hidden", // Limitar el desbordamiento sin scroll
            paddingTop: "50px", // Mantener espacio superior
            paddingBottom: "50px", // Mantener espacio inferior
          }}
        >
          {carData.map((car, i) => {
            const isActive = i === activeIndex;
            return (
              <SwiperSlide key={i} style={{ overflow: "visible" }}>
                <Card
                  sx={{
                    width: 300,
                    height: 480,
                    mx: "auto",
                    bgcolor: theme.palette.common.white,
                    borderRadius: 3,
                    border: "2px solid",
                    borderColor: isActive
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                    transition:
                      "transform 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                    transform: isActive ? "scale(1.2)" : "scale(1)", // Reducir el zoom del auto central a 1.2x
                    boxShadow: "none", // Eliminar el efecto de sombra
                    display: "flex",
                    flexDirection: "column",
                    overflow: "visible",
                  }}
                >
                  <Box
                    sx={{
                      height: 260,
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
                        width: "95%",
                        height: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, px: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      {car.category}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{ mb: 2 }}
                    >
                      {car.name} {car.abbreviation && `(${car.abbreviation})`}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      {/* Íconos y texto */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src="/icons/ic-pax.svg"
                          alt="Pasajeros"
                          width="20"
                          height="20"
                          style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">
                          {car.passengers} pasajeros
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src="/icons/ic-door.svg"
                          alt="Puertas"
                          width="20"
                          height="20"
                          style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">
                          {car.doors} puertas
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LuggageIcon fontSize="small" />
                        <Typography variant="body2">
                          {car.luggage} maletas
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src="/icons/ic-trans.svg"
                          alt="Transmisión"
                          width="20"
                          height="20"
                          style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">
                          {car.transmission}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src="/icons/ic-pet.svg"
                          alt="Pet friendly"
                          width="20"
                          height="20"
                          style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">Pet friendly</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src="/icons/ice.svg"
                          alt="Aire acondicionado"
                          width="20"
                          height="20"
                          style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">
                          Aire acondicionado
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Button
                    variant="contained"
                    onClick={() => router.push("/")}
                    sx={{
                      m: 2,

                      backgroundColor: theme.palette.primary.buttons,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.buttons,
                      },
                    }}
                  >
                    Rentar ahora
                  </Button>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      <Box
        sx={{
          mt: 12, // Incrementar margen superior
          width: "100%",
          mb: 0,
        }}
      >
        <CTA />
      </Box>

      {/* Modal de detalle */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "80vw",
            maxWidth: "1200px",
            height: "90vh",
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: theme.shadows[24],
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {modalCar && (
            <>
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                sx={{ mt: 4 }}
              >
                {modalCar.name}
              </Typography>

              <Tabs
                value={tabIndex}
                onChange={(_, ix) => setTabIndex(ix)}
                centered
                sx={{ mt: 2 }}
              >
                <Tab label="IMÁGENES" />
                <Tab label="VISTA 360°" />
              </Tabs>

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                }}
              >
                {tabIndex === 0 ? (
                  <Swiper
                    navigation
                    modules={[Navigation]}
                    style={{ width: "100%", height: "100%" }}
                  >
                    {(modalCar.images || []).map((img, idx) => (
                      <SwiperSlide
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                            borderRadius: 8,
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <iframe
                    src={modalCar.image360}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: 8,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "center",
                  py: 2,
                }}
              >
                {[
                  {
                    icon: "/icons/ic-pax.svg",
                    text: `${modalCar.passengers} pasajeros`,
                  },
                  {
                    icon: "/icons/ic-door.svg",
                    text: `${modalCar.doors} puertas`,
                  },
                  {
                    icon: "/icons/ic-luggage.svg",
                    text: `${modalCar.luggage} maletas`,
                  },
                  { icon: "/icons/ic-trans.svg", text: modalCar.transmission },
                  { icon: "/icons/ic-pet.svg", text: "Pet friendly" },
                  { icon: "/icons/ice.svg", text: "Aire acondicionado" },
                ].map(({ icon, text }, j) => (
                  <Box
                    key={j}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <img
                      src={icon}
                      alt={text}
                      width="20"
                      height="20"
                      style={{ filter: "brightness(0)" }}
                    />
                    <Typography variant="body2">{text}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
