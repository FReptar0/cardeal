"use client";

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
  CircularProgress,
} from "@mui/material";
import RentalStepper from "../components/Stepper";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";
import dynamic from "next/dynamic";

// Importa el contexto global
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

const CompactHeader = dynamic(() => import("../components/CompactHeader"), {
  ssr: false,
});

export default function RentalPage() {
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Estados locales
  const [filteredCars, setFilteredCars] = useState([]); // <-- inicia vacío
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
  const { searchData: searchContextData } = useSearch();

  const [ratesLoaded, setRatesLoaded] = useState(false);

  function formatTSDDate(date) {
    const pad = (n) => String(n).padStart(2, "0");
    let h = date.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return (
      `${pad(date.getMonth() + 1)}${pad(
        date.getDate()
      )}${date.getFullYear()} ` + `${pad(h)}:${pad(date.getMinutes())} ${ampm}`
    );
  }

  useEffect(() => {
    if (selectedCarIndex !== null && scrollRefs.current[selectedCarIndex]) {
      scrollRefs.current[selectedCarIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedCarIndex]);

  // Loader visual
  const Loader = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 200); // Cambia cada medio segundo
      return () => clearInterval(interval);
    }, []);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "20vh",
          width: "100%",
          gap: 2,
        }}
      >
        <CircularProgress
          sx={{ color: (theme) => theme.palette.primary.text }}
          size={48}
        />
        <Typography
          variant="h6"
          sx={{
            color: (theme) => theme.palette.primary.text,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Cargando autos disponibles{dots}
        </Typography>
      </Box>
    );
  };

  // NUEVO: al cargar o cambiar filtros / fechas, traemos precios de TSD
  const fetchRates = async (
    { pickupLocationId, returnLocationId, pickupDateTime, returnDateTime },
    setCarsFn,
    setLoadedFn
  ) => {
    try {
      setLoadingPrices(true); // Mostrar loader
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLocationId,
          returnLocationId,
          pickupDateTime,
          returnDateTime,
        }),
      });

      // console.log("🛞 Respuesta de TSD:", res);
      const rates = await res.json();
      //console.log("🛞 Precios TSD por categoría:", rates);

      // Filtrar rates para que solo quede el primer registro de cada categoría
      const uniqueRates = [];
      const seenCategories = new Set();
      for (const rate of rates) {
        if (!seenCategories.has(rate.category)) {
          uniqueRates.push(rate);
          seenCategories.add(rate.category);
        }
      }

      const filtered = uniqueRates
        .map((rate) => {
          // Buscar por abbreviation, no por category
          const carInfo = carsData.find(
            (car) => car.abbreviation === rate.category
          );

          if (!carInfo || !rate.baseRate || rate.baseRate === "N/A")
            return null;

          const base = parseFloat(rate.baseRate);
          const discount = parseFloat((base * 0.9).toFixed(2)); // 10% off

          return {
            ...carInfo,
            ...rate,
            category: carInfo.category, // nombre amigable
            abbreviation: carInfo.abbreviation, // código (ECAR, etc)
            price2: base,
            price: discount,
            rateId: rate.rateId,
          };
        })
        .filter(Boolean); // elimina los nulos

      setCarsFn(filtered);
      setLoadedFn(true);
      setLoadingPrices(false); // Oculta loader
    } catch (err) {
      console.error("❌ Error al obtener tarifas:", err);
      setCarsFn([]);
      setLoadedFn(false);
      setLoadingPrices(false);
    }
  };

  // 2) En tu useEffect, parsea la hora y monta bien los Date:
  useEffect(() => {
    if (searchContextData?.pickupDate) {
      handleSearch(searchContextData);
    }
  }, []);

  // Asegura que searchData tenga un valor inicial para evitar problemas de hidratación
  useEffect(() => {
    if (!searchData && searchContextData) {
      setSearchData(searchContextData);
    }
  }, [searchData, searchContextData]);

  // Evita que CompactHeader reciba valores nulos durante la hidratación
  const safeSearchData = searchData || {
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
  };

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

  const handleCarSelect = (car, index) => {
    setPreviousCarIndex(selectedCarIndex);
    setSelectedCarIndex(index);
    setSelectedCar(car); // Guarda el auto seleccionado en el contexto
    // console.log("Seleccionaste el índice:", index);

    if (index < filteredCars.length - 1) {
      const nextCar = filteredCars[index + 1];
      setTempRecommendedCar(nextCar);
      setOpenRecommendation(true);
    } else {
      setTempRecommendedCar(null);
    }
  };

  const handleKeepCurrent = () => {
    // console.log(`Mantener selección: ${selectedCarIndex}`);
    setOpenRecommendation(false);
  };

  const handleSelectNextCar = () => {
    if (
      selectedCarIndex !== null &&
      selectedCarIndex < filteredCars.length - 1
    ) {
      // console.log("Seleccionar siguiente:", selectedCarIndex + 1);
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

  const handleSearch = (filters) => {
    if (!filters) {
      setFilteredCars([]); // limpia autos si no hay filtros válidos
      return;
    }
    //console.log("Filtros de búsqueda:", filters);
    const pickDt = new Date(filters.pickupDate);
    const [pickTime, pickAmpm] = filters.pickupTime.split(" ");
    let [ph, pm] = pickTime.split(":").map(Number);
    if (pickAmpm === "PM" && ph < 12) ph += 12;
    if (pickAmpm === "AM" && ph === 12) ph = 0;
    pickDt.setHours(ph, pm, 0, 0);

    const retDt = new Date(filters.returnDate);
    const [retTime, retAmpm] = filters.returnTime.split(" ");
    let [rh, rm] = retTime.split(":").map(Number);
    if (retAmpm === "PM" && rh < 12) rh += 12;
    if (retAmpm === "AM" && rh === 12) rh = 0;
    retDt.setHours(rh, rm, 0, 0);

    const pickupDateTime = formatTSDDate(pickDt);
    const returnDateTime = formatTSDDate(retDt);

    //console.log("filters", filters);
    //console.log("pickupLocationId", filters.pickupLocation?.id);
    //console.log("returnLocationId", filters.returnLocation?.id);
    //console.log("sameOffice", filters.sameOffice);

    fetchRates(
      {
        pickupLocationId: filters.pickupLocation?.id,
        returnLocationId: filters.sameOffice
          ? filters.pickupLocation?.id
          : filters.returnLocation?.id,
        pickupDateTime,
        returnDateTime,
      },
      setFilteredCars,
      setRatesLoaded
    );
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
          <SearchBar onSearch={handleSearch} />
        </Box>
      </Box>

      <CompactHeader
        searchData={safeSearchData}
        headerIsTop={headerIsTop}
        showCompactHeader={showCompactHeader}
      />

      {showCompactHeader && <Box sx={{ height: "50px" }} />}
      <Box sx={{ width: "100%", marginTop: -12 }}>
        <RentalStepper />
      </Box>

      {isSticky && <Box sx={{ height: "120px" }} />}

      {/* Lista de autos o loader */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            height: "auto",
            alignItems: "center",
          }}
        >
          {loadingPrices ? (
            <Loader />
          ) : filteredCars.length === 0 ? (
            <Box sx={{ height: "20vh", display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  color: (theme) => theme.palette.secondary.text,
                  fontWeight: "bold",
                  mt: 4,
                }}
              >
                No hay autos disponibles para tu búsqueda.
              </Typography>
            </Box>
          ) : (
            filteredCars.map((car, index) => (
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
            ))
          )}
        </Box>
      </Box>

      {/* Botón CONTINUAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{
            color: "white",
            fontWeight: "bold",
            padding: "12px 30px",
            fontSize: "16px",
            backgroundColor: (theme) => theme.palette.primary.buttons,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.buttonsHover,
            },
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
              backgroundColor: (theme) => theme.palette.primary.buttons,
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
                backgroundColor: (theme) => theme.palette.primary.buttons,
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
