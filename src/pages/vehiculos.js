import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import CarDetailModal from "@/components/CarDetailModal";

export default function Flota() {
  const theme = useTheme();
  const router = useRouter();
  const { setmodalCar } = useBooking();
  const [open, setOpen] = useState(false);
  const [modalCar, setModalCar] = useState(null);

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

      {/* Modal de detalle aislado */}
      <CarDetailModal open={open} onClose={() => setOpen(false)} car={modalCar} />
    </Box>
  );
}
