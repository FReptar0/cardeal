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
} from "@mui/material";
import RentalStepper from "../components/Stepper";
import CarCard from "../components/CarCard";
// import CompactHeader from "../components/CompactHeader";
import carsData from "../data/cars.json";
import dynamic from "next/dynamic";

// Importa el contexto global
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

const CompactHeader = dynamic(
  () => import("../components/CompactHeader"),
  { ssr: false }
);

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
  const Loader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#d60812', fontWeight: 'bold' }}>Cargando autos disponibles...</Typography>
    </Box>
  );

  // NUEVO: al cargar o cambiar filtros / fechas, traemos precios de TSD
  const fetchRates = async (
    { location, pickupDateTime, returnDateTime },
    setCarsFn,
    setLoadedFn
  ) => {
    try {
      setLoadingPrices(true); // Mostrar loader
      console.log(
        "🛞 Solicitando tarifas para:",
        location,
        pickupDateTime,
        returnDateTime
      );
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, pickupDateTime, returnDateTime }),
      });

      console.log("🛞 Respuesta de TSD:", res);
      const rates = await res.json();
      console.log("🛞 Precios TSD por categoría:", rates);

      // Filtra y mapea solo los autos cuya categoría coincide con los rates
      const filtered = rates
        .filter(rate => {
          const car = carsData.find(car => car.abbreviation === rate.category);
          const price = rate.totalCharges || rate.baseRate;
          return car && price && price !== "N/A";
        })
        .map(rate => {
          // Hardcodea los valores del coche mostrado y los precios
          return {
            ...rate,
            image: "/photos/economico/March-frente.webp",
            name: "NISSAN MARCH ADVANCE o Similar",
            luggage: 2,
            luggageSize: "chicas",
            luggageDimensions: {
              width: "40cm",
              height: "50cm",
              depth: "20cm"
            },
            passengers: 5,
            doors: 4,
            transmission: "Automática",
            airConditioning: true,
            price2: 520, // Pago en mostrador (debe ser price2 para CarCard)
            price: 468 // Pago en línea (10% off)
          };
        });
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

  // 1) Mejora tu formateador para que reciba directamente un Date:
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

  // 2) En tu useEffect, parsea la hora y monta bien los Date:
  useEffect(() => {
    const { pickupDate, pickupTime, returnDate, returnTime, pickupLocation } =
      searchContextData || {};

    // Solo dispara cuando tengas todo lo necesario:
    const ready =
      pickupDate instanceof Date &&
      pickupTime &&
      returnDate instanceof Date &&
      returnTime &&
      pickupLocation?.id;

    if (!ratesLoaded && ready) {
      // --- parsear pickup ---
      const pickDt = new Date(pickupDate); // clona la fecha
      {
        // "08:00 AM" → [ "08:00", "AM" ]
        const [time, ampm] = pickupTime.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        pickDt.setHours(h, m, 0, 0);
      }

      // --- parsear return ---
      const retDt = new Date(returnDate);
      {
        const [time, ampm] = returnTime.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        retDt.setHours(h, m, 0, 0);
      }

      // Formatea a lo que TSD espera (p.e. "05142025 08:00 AM")
      const pickupDateTime = formatTSDDate(pickDt);
      const returnDateTime = formatTSDDate(retDt);

      console.log(
        "✈️ Solicitando tarifas para:",
        pickupLocation.id,
        pickupDateTime,
        returnDateTime
      );

      fetchRates(
        { location: pickupLocation.id, pickupDateTime, returnDateTime },
        setFilteredCars,
        setRatesLoaded
      );
    }
  }, [ratesLoaded, searchContextData]);

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

  const fetchPrices = async (searchData) => {
    try {
      const response = await fetch(
        `/api/prices?pickupLocation=${searchData.pickupLocation}&returnLocation=${searchData.returnLocation}&pickupDate=${searchData.pickupDate}&pickupTime=${searchData.pickupTime}&returnDate=${searchData.returnDate}&returnTime=${searchData.returnTime}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los precios");
      }
      const prices = await response.json();
      return prices;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearch = async (filters) => {
    setSearchData(filters); // Guarda los datos de búsqueda
    setLoadingPrices(true); // Muestra un indicador de carga

    const prices = await fetchPrices(filters); // Obtén los precios desde el endpoint

    // Actualiza los datos de los vehículos con los precios obtenidos
    const updatedCars = carsData.map((car) => {
      const matchingPrice = prices.find(
        (price) => price.classCode === car.abbreviation
      );
      return {
        ...car,
        price: matchingPrice
          ? `$${matchingPrice.rateAmount.toFixed(2)}`
          : "N/A", // Asigna el precio formateado o "N/A" si no hay coincidencia
      };
    });

    setFilteredCars(updatedCars); // Actualiza los vehículos filtrados
    setLoadingPrices(false); // Oculta el indicador de carga
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
          ) : (
            filteredCars.length === 0 ? (
              <Typography variant="h6" sx={{ color: '#d60812', fontWeight: 'bold', mt: 4 }}>No hay autos disponibles para tu búsqueda.</Typography>
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
            )
          )}
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
