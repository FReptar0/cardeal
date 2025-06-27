import React, { useState, useEffect } from "react";
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
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import CTA from "@/components/CTA";

import CarruselFlota from "@/components/CarouselFlota";

export default function Flota() {
  const theme = useTheme();
  const router = useRouter();
  const { setmodalCar } = useBooking();
  const [open, setOpen] = useState(false);
  const [modalCar, setModalCar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Handler para abrir el modal desde el carrusel
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

      {/* CarruselFlota modularizado */}
      <CarruselFlota onOpenModal={handleOpenModal} />

      <Box
        sx={{
          mt: 6,
          mb: -6,
          width: "100%",
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
