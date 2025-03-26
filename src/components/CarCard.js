import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LuggageIcon from "@mui/icons-material/Luggage";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function CarCard({ car, isSelected }) {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // Función auxiliar para detener la propagación del evento
  const stopAllPropagation = (event) => {
    // Detiene otros listeners que pudieran haber sido registrados
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 3,
          width: "100%",
          minHeight: 160,
          borderRadius: 3,
          border: isSelected ? "3px solid black" : "3px solid transparent",
          boxSizing: "border-box",
          boxShadow: isSelected ? 5 : 2,
          flexDirection: { xs: "column", sm: "row" },
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 5,
            transform: "scale(1.02)",
          },
        }}
      >
        {/* Imagen y botón para abrir la galería (detienen la propagación) */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: "100%", sm: 120 }, height: "auto", cursor: "pointer" }}
            image={car.image}
            alt={car.name}
            onClick={(event) => {
              stopAllPropagation(event);
              setOpen(true);
            }}
          />

          <Button
            data-no-select
            startIcon={<PhotoLibraryIcon />}
            sx={{
              marginTop: 1,
              fontSize: "12px",
              textTransform: "none",
              color: "gray",
              "&:hover": { color: "black" },
            }}
            onClick={(event) => {
              stopAllPropagation(event);
              setOpen(true);
            }}
          >
            Ver galería
          </Button>
        </Box>

        {/* Información del vehículo */}
        <CardContent sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {car.category}
            </Typography>
            {car.abbreviation && (
              <Typography variant="body2" sx={{ color: "gray" }}>
                ({car.abbreviation})
              </Typography>
            )}
            {car.abbreviation &&
              car.abbreviationMeaning &&
              car.abbreviationDescription && (
                <Tooltip title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`} arrow>
                  <IconButton size="small" sx={{ padding: 0, color: "gray" }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
          </Box>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontStyle: "italic", marginBottom: 1 }}
          >
            {car.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <img src="/icons/ic-pax.svg" alt="Pasajeros" width="20" height="20" style={{ filter: "brightness(0)" }} />
              <Typography variant="body2">{car.passengers} pasajeros</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <img src="/icons/ic-door.svg" alt="Puertas" width="20" height="20" style={{ filter: "brightness(0)" }} />
              <Typography variant="body2">{car.doors} puertas</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <LuggageIcon fontSize="small" sx={{ color: "black" }} />
              <Typography variant="body2">{car.luggage} maletas</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <img src="/icons/ic-trans.svg" alt="Transmisión" width="20" height="20" style={{ filter: "brightness(0)" }} />
              <Typography variant="body2">{car.transmission}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <img src="/icons/ic-pet.svg" alt="Pet friendly" width="20" height="20" style={{ filter: "brightness(0)" }} />
              <Typography variant="body2">Pet friendly</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
              <img src="/icons/ice.svg" alt="Aire acondicionado" width="20" height="20" style={{ filter: "brightness(0)" }} />
              <Typography variant="body2">Aire acondicionado</Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Precio y datos adicionales */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-end" },
            justifyContent: "center",
            minWidth: { xs: "100%", sm: "250px" },
            marginTop: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, width: "100%" }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: "#508a69" }}>
                Precio en línea
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
                $ {car.price}{" "}
                <Typography variant="body2" component="span" sx={{ color: "gray" }}>
                  MXN/día
                </Typography>
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: "#d60812" }}>
                Precio en Sucursal
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
                $ {car.price2}{" "}
                <Typography variant="body2" component="span" sx={{ color: "gray" }}>
                  MXN/día
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Modal de la galería */}
      <Modal
        open={open}
        onClose={(e) => {
          stopAllPropagation(e);
          setOpen(false);
        }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          onClick={stopAllPropagation}
          sx={{
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
          }}
        >
          {/* Botón de cierre */}
          <IconButton
            onClick={(e) => {
              stopAllPropagation(e);
              setOpen(false);
            }}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            {car.name}
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            centered
            onClick={stopAllPropagation}
          >
            <Tab label="IMÁGENES" />
            <Tab label="VISTA 360°" />
          </Tabs>

          {tabIndex === 0 ? (
            <Box
              onClick={stopAllPropagation}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "auto",
                mt: 2,
              }}
            >
              <Swiper
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                modules={[Navigation]}
                style={{ width: "100%", height: "60vh" }}
              >
                {(car.images || []).map((img, index) => (
                  <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        maxWidth: "80%",
                        maxHeight: "50vh",
                        borderRadius: 5,
                        objectFit: "contain",
                        margin: "0 20px",
                      }}
                      onClick={stopAllPropagation}
                    />
                  </SwiperSlide>
                ))}
                <div
                  className="swiper-button-next"
                  style={{ color: "black" }}
                  onClick={stopAllPropagation}
                ></div>
                <div
                  className="swiper-button-prev"
                  style={{ color: "black" }}
                  onClick={stopAllPropagation}
                ></div>
              </Swiper>

              {/* Características del carro debajo de las imágenes */}
              <Box
                onClick={stopAllPropagation}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                  p: 1,
                  borderTop: "1px solid #e0e0e0",
                  width: "100%",
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
                  <Typography variant="body2">{car.passengers} pasajeros</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-door.svg"
                    alt="Puertas"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">{car.doors} puertas</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                  <Typography variant="body2">{car.luggage} maletas</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src="/icons/ic-trans.svg"
                    alt="Transmisión"
                    width="20"
                    height="20"
                    style={{ filter: "brightness(0)" }}
                  />
                  <Typography variant="body2">{car.transmission}</Typography>
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
            </Box>
          ) : (
            <iframe
              src="https://360.pymesdigital.com.mx/Grupo%20Andrade%20360/"
              style={{
                width: "100%",
                height: "60vh",
                border: "none",
                borderRadius: 5,
                marginTop: 16,
              }}
              onClick={stopAllPropagation}
            ></iframe>
          )}
        </Box>
      </Modal>

      <style jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: white;
        }
      `}</style>
    </>
  );
}
