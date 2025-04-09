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
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [previousCarIndex, setPreviousCarIndex] = useState(null);
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
    setFilteredCars(carsData); // Aplica filtros si es necesario
  };

  const handleCarSelect = (car, index) => {
    setPreviousCarIndex(selectedCarIndex);
    setSelectedCarIndex(index);
    console.log("Seleccionaste el índice:", index);

    if (index < filteredCars.length - 1) {
      const nextCar = filteredCars[index + 1];
      setTempRecommendedCar(nextCar);
      setOpenRecommendation(true);
    } else {
      setTempRecommendedCar(null);
    }
  };

  const handleCloseRecommendation = () => {
    console.log("Modal cerrado sin elegir. Revirtiendo a:", previousCarIndex);
    setSelectedCarIndex(previousCarIndex);
    setOpenRecommendation(false);
  };

  const handleKeepCurrent = () => {
    console.log(`Mantener selección: ${selectedCarIndex}`);
    setOpenRecommendation(false);
  };

  const handleSelectNextCar = () => {
    if (
      selectedCarIndex !== null &&
      selectedCarIndex < filteredCars.length - 1
    ) {
      console.log("Seleccionar siguiente:", selectedCarIndex + 1);
      setSelectedCarIndex(selectedCarIndex + 1);
    }
    setOpenRecommendation(false);
  };

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

      <CompactHeader
        searchData={searchData}
        headerIsTop={headerIsTop}
        showCompactHeader={showCompactHeader}
      />

      {showCompactHeader && <Box sx={{ height: "50px" }} />}
      <Box sx={{ width: "100%", marginTop: -12 }}>
        <RentalStepper />
      </Box>

      {isSticky && <Box sx={{ height: "120px" }} />}

      {/* Lista de autos */}
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

      {/* MODAL DE RECOMENDACIÓN */}
      <Dialog
        open={openRecommendation}
        onClose={handleCloseRecommendation}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: 8,
            maxWidth: "500px",
            width: "90%",
          },
        }}
      >
        {/* Título sin fondo, pero con negritas */}
        <Box sx={{ py: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
              fontSize: "20px",
            }}
          >
            RECOMENDACIÓN
          </Typography>
        </Box>

        {/* Contenido del modal */}
        <DialogContent
          sx={{
            pt: 0,
            pb: 2,
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {tempRecommendedCar ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontSize: "16px",
                  maxWidth: 400,
                  textAlign: "justify",
                  lineHeight: 1.6,
                }}
              >
                Te recomendamos considerar la categoría{" "}
                <strong>{tempRecommendedCar.category}</strong> (
                {tempRecommendedCar.name}) que ofrece mayores prestaciones por
                un precio competitivo.
              </Typography>

              {/* Imagen del auto */}
              <Box
                component="img"
                src={tempRecommendedCar.image || "/images/default-car.jpg"}
                alt={tempRecommendedCar.name}
                sx={{
                  width: "100%",
                  maxWidth: 280,
                  borderRadius: 2,
                  mb: 3,
                  objectFit: "contain",
                }}
              />
            </>
          ) : (
            <Typography variant="body1">
              No hay una categoría siguiente.
            </Typography>
          )}
        </DialogContent>

        {/* Botones de acción con rediseño */}
        <DialogActions sx={{ justifyContent: "center", pb: 3, px: 2, gap: 1 }}>
          <Button
            onClick={handleKeepCurrent}
            variant="outlined"
            sx={{
              color: "#333",
              fontWeight: "bold",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              borderColor: "#ccc",
              backgroundColor: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
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
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              SELECCIONAR {tempRecommendedCar.category.toUpperCase()}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
