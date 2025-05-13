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

// Importa el contexto global
import { useBooking } from "../contexts/BookingContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

export default function RentalPage() {
  const [ratesLoaded, setRatesLoaded] = useState(false);

  // Estados locales
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

  // Extrae del contexto el auto seleccionado y su setter
  const { selectedCar, setSelectedCar } = useBooking();

  useEffect(() => {
    if (selectedCarIndex !== null && scrollRefs.current[selectedCarIndex]) {
      scrollRefs.current[selectedCarIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedCarIndex]);

  // NUEVO: al cargar o cambiar filtros / fechas, traemos precios de TSD
  useEffect(() => {
    async function fetchRates() {
      // Aquí podrías sacar location, fechas, etc. desde tu searchData o contexto
      const payload = {
        location: "MXCSAT",
        pickupDateTime: "05122025 10:00 AM",
        returnDateTime: "05152025 10:00 AM",
      };

      const res = await fetch("/api/tsdRates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const rates = await res.json();
      console.log("🛞 Precios TSD por categoría:", rates);

      // Mapeamos a la estructura que CarCard espera
      const cars = rates.map((r) => ({
        name: r.category,
        price: r.totalCharges, // o r.baseRate, según prefieras
      }));
      setFilteredCars(cars);
      setRatesLoaded(true);
    }

    if (!ratesLoaded) {
      fetchRates();
    }
  }, [ratesLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // NUEVO: Sincroniza el índice local con el vehículo seleccionado en el contexto
  useEffect(() => {
    if (selectedCar) {
      const index = filteredCars.findIndex(
        (car) => car.name === selectedCar.name
      );
      if (index !== -1) {
        setSelectedCarIndex(index);
      }
    }
  }, [selectedCar, filteredCars]);

  const handleSearch = (filters) => {
    setFilteredCars(carsData); // Aplica filtros si es necesario
  };

  const handleCarSelect = (car, index) => {
    setPreviousCarIndex(selectedCarIndex);
    setSelectedCarIndex(index);
    setSelectedCar(car); // Guarda el auto seleccionado en el contexto
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
      const newIndex = selectedCarIndex + 1;
      setSelectedCarIndex(newIndex);
      setSelectedCar(filteredCars[newIndex]); // Actualizamos la selección global con el auto siguiente
    }
    setOpenRecommendation(false);
  };

  const handleContinue = () => {
    if (selectedCarIndex === null) {
      setOpenWarning(true);
    } else {
      router.push("/proteccion");
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
              <CarCard
                car={car}
                price={car.price}
                isSelected={selectedCarIndex === index}
              />
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

      {/* Modal de recomendación */}
      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
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
          🚨 ATENCIÓN 🚨
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Para tu seguridad y tranquilidad, es <strong>OBLIGATORIO</strong>{" "}
            seleccionar un vehículo antes de continuar.
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
            SELECCIONAR UN VEHÍCULO
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRecommendation}
        onClose={() => setOpenRecommendation(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: 8,
            maxWidth: "500px",
            width: "90%",
          },
        }}
      >
        {/* Título */}
        <Box sx={{ py: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            RECOMENDACIÓN
          </Typography>
        </Box>

        {/* Contenido del diálogo */}
        <DialogContent
          sx={{
            pt: 0,
            pb: 2,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "16px",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Te recomendamos considerar el{" "}
            <strong>
              {tempRecommendedCar ? tempRecommendedCar.category : ""}
            </strong>{" "}
            ({tempRecommendedCar ? tempRecommendedCar.name : ""}) que ofrece
            mayores prestaciones por un precio competitivo.
          </Typography>

          {tempRecommendedCar && (
            <Button
              onClick={handleSelectNextCar}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#d60812",
                color: "white",
                fontWeight: "bold",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              SELECCIONAR{" "}
              {tempRecommendedCar
                ? tempRecommendedCar.category.toUpperCase()
                : ""}
            </Button>
          )}

          {/* Texto debajo del botón rojo */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#333",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={handleKeepCurrent}
            >
              Mantener la selección actual
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
