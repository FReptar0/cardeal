import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import GalleryModal from "./GalleryModal";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LuggageIcon from "@mui/icons-material/Luggage";

const CarCard = React.memo(function CarCard({ car, isSelected }) {
  const [open, setOpen] = useState(false);

  // Memoized function to stop event propagation
  const stopAllPropagation = useCallback((event) => {
    event.nativeEvent?.stopImmediatePropagation?.();
    event.stopPropagation();
  }, []);

  // Memoized handlers
  const handleOpenGallery = useCallback((event) => {
    stopAllPropagation(event);
    setOpen(true);
  }, [stopAllPropagation]);

  const handleCloseGallery = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          width: "100%",
          minHeight: 160,
          borderRadius: 3,
          border: isSelected ? "3px solid black" : "3px solid transparent",
          boxSizing: "border-box",
          boxShadow: isSelected ? 5 : 2,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: 5,
            transform: "scale(1.02)",
          },
        }}
      >
        {/* Imagen y botón para abrir la galería */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: 320, md: 380, lg: 420 },
              height: { xs: 200, sm: 220, md: 240, lg: 260 },
              maxWidth: "100%",
              position: "relative",
              borderRadius: 0,
              overflow: "hidden",
              boxShadow: "none",
              background: "transparent",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={handleOpenGallery}
          >
            <Image
              src={car.image}
              alt={car.name}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 500px) 100vw, 420px"
              unoptimized
            />
          </Box>
          <Button
            data-no-select
            startIcon={<PhotoLibraryIcon />}
            sx={{
              marginTop: 1,
              fontSize: "13px",
              textTransform: "none",
              color: "#3e9279",
              backgroundColor: "white",
              border: "1px solid #d9d9d9",
              borderRadius: 1,
              padding: "4px 12px",
              minWidth: 0,
              "&:hover": {
                backgroundColor: "#d9d9d9",
                color: (theme) => theme.palette.primary.buttons,
              },
              "&:active": {
                backgroundColor: "#d9d9d9",
                color: (theme) => theme.palette.primary.buttons,
              },
              "&:focus": {
                backgroundColor: "#d9d9d9",
                color: (theme) => theme.palette.primary.buttons,
              },
            }}
            onClick={handleOpenGallery}
          >
            Ver galería
          </Button>
        </Box>

        {/* Información del vehículo */}
        <CardContent
          sx={{
            flex: 1,
            textAlign: "center",
            p: { xs: 1, sm: 1 },
            minWidth: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
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
                <Tooltip
                  title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`}
                  arrow
                >
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
              gap: 1.2,
              alignItems: "center",
              justifyContent: "center",
              mt: 0.5,
              mb: 0.5,
              fontSize: "0.95rem",
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "100px",
              }}
            >
              <Image
                src="/icons/ic-pax.svg"
                alt="Pasajeros"
                width={20}
                height={20}
                style={{ filter: "brightness(0)" }}
                unoptimized
              />
              <Typography variant="body2">
                {car.passengers} pasajeros
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "100px",
              }}
            >
              <Image
                src="/icons/ic-door.svg"
                alt="Puertas"
                width={20}
                height={20}
                style={{ filter: "brightness(0)" }}
                unoptimized
              />
              <Typography variant="body2">{car.doors} puertas</Typography>
            </Box>
            <Tooltip
              title={`${car.luggage} maletas ${car.luggageSize} (${car.luggageDimensions.width} x ${car.luggageDimensions.height} x ${car.luggageDimensions.depth})`}
              arrow
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: "100px",
                }}
              >
                <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                <Typography variant="body2">{car.luggage} maletas</Typography>
              </Box>
            </Tooltip>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "100px",
              }}
            >
              <Image
                src="/icons/ic-trans.svg"
                alt="Transmisión"
                width={20}
                height={20}
                style={{ filter: "brightness(0)" }}
                unoptimized
              />
              <Typography variant="body2">{car.transmission}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "100px",
              }}
            >
              <Image
                src="/icons/ic-pet.svg"
                alt="Pet friendly"
                width={20}
                height={20}
                style={{ filter: "brightness(0)" }}
                unoptimized
              />
              <Typography variant="body2">Pet friendly</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: "100px",
              }}
            >
              <Image
                src="/icons/ice.svg"
                alt="Aire acondicionado"
                width={20}
                height={20}
                style={{ filter: "brightness(0)" }}
                unoptimized
              />
              <Typography variant="body2">Aire acondicionado</Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Precio y datos adicionales */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100%",
            marginTop: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {/* Pago en línea */}
            <Box
              sx={{
                textAlign: "center",
                flex: 1,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ color: "#508a69", fontSize: "1.2rem" }}
              >
                Pago en línea
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "black" }}
              >
                $ {car.price}{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: "black", ml: 0.5 }}
                >
                  MXN/día
                </Typography>
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Pago en Mostrador */}
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ color: (theme) => theme.palette.secondary.text }}
              >
                Pago en Mostrador
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "black" }}
              >
                $ {car.price2}{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: "black", ml: 0.5 }}
                >
                  MXN/día
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%", textAlign: "center", mt: 1 }}>
            <Typography variant="caption" sx={{ color: "#666" }}>
              Tarifa: tiempo y kilometraje
            </Typography>
          </Box>
        </Box>
      </Card>

      <GalleryModal open={open} onClose={handleCloseGallery} car={car} />
    </>
  );
});

export default CarCard;
