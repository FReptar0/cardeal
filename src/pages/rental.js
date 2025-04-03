"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RentalStepper from "../components/Stepper";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";
import format from "date-fns/format";

export default function RentalPage() {
  const [filteredCars, setFilteredCars] = useState(carsData);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);

  // Details rectangle under header
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);

  // Search bar props
  const [searchData, setSearchData] = useState(null);

  // NUEVO: guarda la selección previa para revertir si se cierra el modal
  const [previousCarIndex, setPreviousCarIndex] = useState(null);

  // Popups
  const [openRecommendation, setOpenRecommendation] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [tempRecommendedCar, setTempRecommendedCar] = useState(null);

  const router = useRouter();
  const scrollRefs = useRef([]);

  useEffect(() => {
    if (selectedCarIndex !== null && scrollRefs.current[selectedCarIndex]) {
      scrollRefs.current[selectedCarIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedCarIndex]);

  // Header top handler
  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100); // Verifica cada 100ms
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (filters) => {
    // Aquí podrías filtrar según tu lógica
    setFilteredCars(carsData);
  };

  // Se llama al hacer clic en una Card
  const handleCarSelect = (car, index) => {
    // Guarda la selección anterior
    setPreviousCarIndex(selectedCarIndex);
    // Actualiza la selección inmediatamente
    setSelectedCarIndex(index);
    console.log("Seleccionaste el índice:", index);
    // Si hay un siguiente auto, abrimos el popup de recomendación
    if (index < filteredCars.length - 1) {
      const nextCar = filteredCars[index + 1];
      setTempRecommendedCar(nextCar);
      setOpenRecommendation(true);
    } else {
      setTempRecommendedCar(null);
    }
  };

  // Si se cierra el modal sin elegir, revertimos la selección
  const handleCloseRecommendation = () => {
    console.log("Modal cerrado sin elegir un botón. Revirtiendo a:", previousCarIndex);
    setSelectedCarIndex(previousCarIndex);
    setOpenRecommendation(false);
  };

  // Mantener la selección actual
  const handleKeepCurrent = () => {
    console.log(`Mantener selección: ${selectedCarIndex}`);
    setOpenRecommendation(false);
  };

  // Seleccionar la siguiente categoría
  const handleSelectNextCar = () => {
    if (selectedCarIndex !== null && selectedCarIndex < filteredCars.length - 1) {
      console.log("Seleccionar siguiente. Actual:", selectedCarIndex, "Siguiente:", selectedCarIndex + 1);
      setSelectedCarIndex(selectedCarIndex + 1);
    }
    setOpenRecommendation(false);
  };

  // Al presionar CONTINUAR, si no hay selección abrimos popup de advertencia
  const handleContinue = () => {
    if (selectedCarIndex === null) {
      setOpenWarning(true);
    } else {
      router.push("/seguro");
    }
  };

  return (
    <Container sx={{ marginTop: "148px", paddingX: 2 }}>
      {/* Barra de búsqueda y Stepper */}
      <Box
        sx={{
          overflow: "hidden",
          maxHeight: hideSearchSection ? 0 : "1000px",
          opacity: hideSearchSection ? 0 : 1,
          transform: hideSearchSection ? "translateY(-20px)" : "translateY(0)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            gap: 1,
          }}
        >
          <SearchBar onValuesChange={setSearchData} />
        </Box>
      </Box>

      {/* Header compacto fijo con "Return to Top" */}
      <Box
        sx={{
          position: "fixed",
          top: headerIsTop ? "100px" : "60px",
          left: 0,
          width: "100%",
          height: "64px",
          background: "#10906a",
          zIndex: 1200,
          opacity: showCompactHeader ? 1 : 0,
          transition: "opacity .4s ease, transform .7s ease",
          pointerEvents: showCompactHeader ? "auto" : "none",
          visibility: showCompactHeader ? "visible" : "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
            Origen: {searchData?.pickupLocation?.name || "No seleccionado"}
          </Typography>
          <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
            Destino:{" "}
            {searchData?.sameOffice
              ? "Misma oficina"
              : searchData?.returnLocation?.name || "No seleccionado"}
          </Typography>
          <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
            {searchData?.pickupDate &&
              `${format(searchData.pickupDate, "dd/MM/yyyy")} ${searchData.pickupTime} → ${format(
                searchData.returnDate,
                "dd/MM/yyyy"
              )} ${searchData.returnTime}`}
          </Typography>
          {/* Botón "Return to Top" en esquina inferior derecha del header */}
          <Tooltip title="Volver arriba" arrow>
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                bottom: "-75%",
                transform: "translate(-50%, 50%)",
                background: "white",
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                transition: "background 0.3s",
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUpwardIcon sx={{ color: "#10906a", fontSize: 20 }} />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {showCompactHeader && <Box sx={{ height: "50px", transition: "height 0.3s ease" }} />}

      <Box sx={{ width: "100%", marginTop: -12 }}>
        <RentalStepper />
      </Box>

      {isSticky && <Box sx={{ height: "120px" }} />}

      {/* Listado de Cards */}
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
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minHeight: "80vh",
            alignItems: "center",
          }}
        >
          {filteredCars.map((car, index) => (
            <Box
              key={index}
              ref={(el) => (scrollRefs.current[index] = el)}
              onClick={() => handleCarSelect(car, index)}
              sx={{
                width: "100%",
                maxWidth: "1200px",
                cursor: "pointer",
              }}
            >
              <CarCard car={car} isSelected={selectedCarIndex === index} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Botón CONTINUAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d60812",
            color: "white",
            fontWeight: "bold",
            padding: "12px 30px",
            fontSize: "16px",
          }}
          onClick={handleContinue}
        >
          CONTINUAR
        </Button>
      </Box>

      {/* Popup de Recomendación */}
      <Dialog open={openRecommendation} onClose={handleCloseRecommendation}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          RECOMENDACIÓN
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ textAlign: "justify", fontSize: "16px", lineHeight: "1.5", mt: 2 }}
          >
            {tempRecommendedCar ? (
              <>
                Te recomendamos considerar la categoría <strong>{tempRecommendedCar.category}</strong> ({tempRecommendedCar.name}) que ofrece mayores prestaciones por un precio competitivo.
              </>
            ) : (
              "No hay una categoría siguiente."
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleKeepCurrent}
            variant="outlined"
            sx={{
              color: "grey",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              borderColor: "grey",
            }}
          >
            Mantener selección actual
          </Button>
          {tempRecommendedCar && (
            <Button
              onClick={handleSelectNextCar}
              variant="contained"
              sx={{
                backgroundColor: "#d60812",
                color: "white",
                fontWeight: "bold",
                padding: "12px 20px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Seleccionar {tempRecommendedCar.category}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Popup de Advertencia (sin selección) */}
      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Atención
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Debes seleccionar una categoría antes de continuar.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenWarning(false)}
            variant="contained"
            sx={{
              backgroundColor: "#d60812",
              color: "white",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

