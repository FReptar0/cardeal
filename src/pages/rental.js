import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Solo agrega Paper para el nuevo diseño si deseas
  Paper,
} from "@mui/material";
import RentalStepper from "../components/Stepper";
import CarCard from "../components/CarCard";
import CompactHeader from "../components/CompactHeader";
import carsData from "../data/cars.json";
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

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
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (filters) => {
    // Lógica de filtrado (si aplica)
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
    console.log(
      "Modal cerrado sin elegir un botón. Revirtiendo a:",
      previousCarIndex
    );
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
    if (
      selectedCarIndex !== null &&
      selectedCarIndex < filteredCars.length - 1
    ) {
      console.log(
        "Seleccionar siguiente. Actual:",
        selectedCarIndex,
        "Siguiente:",
        selectedCarIndex + 1
      );
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

      {/* Nuestro componente CompactHeader */}
      <CompactHeader
        searchData={searchData}
        headerIsTop={headerIsTop}
        showCompactHeader={showCompactHeader}
      />

      {showCompactHeader && (
        <Box sx={{ height: "50px", transition: "height 0.3s ease" }} />
      )}

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

      {/* Popup de Recomendación (DISEÑO MEJORADO) */}
      <Dialog
        open={openRecommendation}
        onClose={handleCloseRecommendation}
        // Opcional: Mejora la apariencia del "papel" del dialog
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: 8,
            maxWidth: "500px", // Ajusta el ancho máximo si deseas
          },
        }}
      >
        {/* Encabezado con fondo de color y tipografía clara */}
        <Box sx={{ backgroundColor: "#d60812", p: 2 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
            }}
          >
            RECOMENDACIÓN
          </Typography>
        </Box>

        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Typography
            variant="body1"
            sx={{ textAlign: "justify", fontSize: "16px", lineHeight: "1.5" }}
          >
            {tempRecommendedCar ? (
              <>
                Te recomendamos considerar la categoría{" "}
                <strong>{tempRecommendedCar.category}</strong> (
                {tempRecommendedCar.name}) que ofrece mayores prestaciones por
                un precio competitivo.
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
              mr: 1,
            }}
          >
            MANTENER SELECCIÓN ACTUAL
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
              SELECCIONAR {tempRecommendedCar.category.toUpperCase()}
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
