"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import RecommendationModal from "../components/RecommendationModal";
import RentalStepper from "../components/Stepper";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";
import dynamic from "next/dynamic";
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});
const CompactHeader = dynamic(() => import("../components/CompactHeader"), {
  ssr: false,
});

// Componente Loader optimizado
const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 200);
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
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: "primary.text" }} size={48} />
      <Typography
        variant="h6"
        sx={{ color: "primary.text", fontWeight: "bold" }}
      >
        Cargando autos disponibles{dots}
      </Typography>
    </Box>
  );
};

export default function RentalPage() {
  // Estados consolidados
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [headerState, setHeaderState] = useState({
    isTop: true,
    showCompact: false,
    hideSearch: false,
  });
  const [searchData, setSearchData] = useState(null);
  const [modals, setModals] = useState({
    recommendation: false,
  });
  const [tempRecommendedCar, setTempRecommendedCar] = useState(null);
  const [ratesLoaded, setRatesLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();
  const scrollRefs = useRef([]);
  const { selectedCar, setSelectedCar } = useBooking();
  const { searchData: searchContextData } = useSearch();

  // Utilidad para formatear fecha TSD
  const formatTSDDate = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    let h = date.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${pad(date.getMonth() + 1)}${pad(
      date.getDate()
    )}${date.getFullYear()} ${pad(h)}:${pad(date.getMinutes())} ${ampm}`;
  };

  // Función para obtener tarifas optimizada
  const fetchRates = async (params) => {
    try {
      setLoadingPrices(true);
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const rates = await res.json();

      // Filtrar rates únicos por categoría
      const uniqueRates = rates.reduce((acc, rate) => {
        if (!acc.find((r) => r.category === rate.category)) {
          acc.push(rate);
        }
        return acc;
      }, []);

      const filtered = uniqueRates
        .map((rate) => {
          const carInfo = carsData.find(
            (car) => car.abbreviation === rate.category
          );
          if (!carInfo || !rate.baseRate || rate.baseRate === "N/A")
            return null;

          const base = parseFloat(rate.baseRate);
          const discount = parseFloat((base * 0.9).toFixed(2));

          return {
            ...carInfo,
            ...rate,
            category: carInfo.category,
            abbreviation: carInfo.abbreviation,
            price2: base,
            price: discount,
            rateId: rate.rateId,
          };
        })
        .filter(Boolean);

      setFilteredCars(filtered);
      setRatesLoaded(true);
    } catch (err) {
      console.error("❌ Error al obtener tarifas:", err);
      setFilteredCars([]);
      setRatesLoaded(false);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Manejador de búsqueda optimizado
  const handleSearch = (filters) => {
    if (!filters) {
      setFilteredCars([]);
      return;
    }

    const createDateTime = (date, time) => {
      const dt = new Date(date);
      const [timeStr, ampm] = time.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      dt.setHours(hours, minutes, 0, 0);
      return formatTSDDate(dt);
    };

    const params = {
      pickupLocationId: filters.pickupLocation?.id,
      returnLocationId: filters.sameOffice
        ? filters.pickupLocation?.id
        : filters.returnLocation?.id,
      pickupDateTime: createDateTime(filters.pickupDate, filters.pickupTime),
      returnDateTime: createDateTime(filters.returnDate, filters.returnTime),
    };

    fetchRates(params);
  };

  const handleCarSelect = (car, index) => {
    setSelectedCarIndex(index);
    setSelectedCar(car);
    if (index < filteredCars.length - 1) {
      setTempRecommendedCar(filteredCars[index + 1]);
      setModals((prev) => ({ ...prev, recommendation: true }));
    } else {
      router.push("/proteccion");
    }
  };

  const handleRecommendationAction = (selectNext = false) => {
    if (selectNext && selectedCarIndex < filteredCars.length - 1) {
      const newIndex = selectedCarIndex + 1;
      setSelectedCarIndex(newIndex);
      setSelectedCar(filteredCars[newIndex]);
    }
    setModals((prev) => ({ ...prev, recommendation: false }));
    router.push("/proteccion");
  };

  // Effects consolidados
  useEffect(() => {
    if (searchContextData?.pickupDate) {
      handleSearch(searchContextData);
    }
  }, []);

  useEffect(() => {
    if (!searchData && searchContextData) {
      setSearchData(searchContextData);
    }
  }, [searchData, searchContextData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderState({
        isTop: headerTop,
        showCompact: !headerTop,
        hideSearch: !headerTop,
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCar) {
      const index = filteredCars.findIndex(
        (car) => car.name === selectedCar.name
      );
      if (index !== -1) setSelectedCarIndex(index);
    }
  }, [selectedCar, filteredCars]);

  useEffect(() => {
    if (selectedCarIndex !== null && scrollRefs.current[selectedCarIndex]) {
      scrollRefs.current[selectedCarIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedCarIndex]);

  const safeSearchData = searchData || {
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
  };

  return (
    <Container sx={{ marginTop: "148px", paddingX: 2, paddingBottom: 5 }}>
      {/* Sección de búsqueda */}
      <Box
        id="search-section-box"
        sx={{
          overflow: "hidden",
          maxHeight: headerState.hideSearch ? 0 : "1000px",
          opacity: headerState.hideSearch ? 0 : 1,
          transform: headerState.hideSearch
            ? "translateY(-20px)"
            : "translateY(0)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Box
          id="search-bar-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SearchBar onSearch={handleSearch} />
        </Box>
      </Box>

      <CompactHeader
        searchData={safeSearchData}
        headerIsTop={headerState.isTop}
        showCompactHeader={headerState.showCompact}
      />

      {headerState.showCompact && <Box sx={{ height: "50px" }} />}

      <Box id="stepper-box" sx={{ width: "100%", marginTop: -12 }}>
        <RentalStepper />
      </Box>

      {/* Sección principal de autos */}
      <Box
        id="main-cars-section"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1100px",
            lg: "1300px",
            xl: "1500px",
          },
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "primary.text",
            fontWeight: "bold",
            mb: 2,
            mt: 2,
            textAlign: "center",
          }}
        >
          Selecciona tu auto ideal.
        </Typography>

        {loadingPrices ? (
          <Loader />
        ) : filteredCars.length === 0 ? (
          <Box
            id="no-cars-message"
            sx={{ height: "20vh", display: "flex", alignItems: "center" }}
          >
            <Typography
              variant="h5"
              sx={{ color: "secondary.text", fontWeight: "bold" }}
            >
              No hay autos disponibles para tu búsqueda.
            </Typography>
          </Box>
        ) : (
          <Box
            id="cars-carousel-container"
            sx={{ width: "100%", maxWidth: "1200px", mt: 2 }}
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={3}
              centeredSlides
              loop
              spaceBetween={40}
              navigation
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              onSwiper={(sw) => setActiveIndex(sw.realIndex)}
              onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
              style={{
                overflow: "visible",
                paddingTop: "50px",
                paddingBottom: "50px",
              }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 10 },
                600: { slidesPerView: 2, spaceBetween: 20 },
                900: { slidesPerView: 3, spaceBetween: 40 },
              }}
            >
              {filteredCars.map((car, index) => {
                const isActive = index === activeIndex;
                return (
                  <SwiperSlide key={index} style={{ overflow: "visible" }}>
                    <Box
                      ref={(el) => (scrollRefs.current[index] = el)}
                      onClick={() => handleCarSelect(car, index)}
                      sx={{
                        cursor: "pointer",
                        width: "100%",
                        maxWidth: {
                          xs: "98vw",
                          sm: "98vw",
                          md: "500px",
                          lg: "540px",
                        },
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        transition: "transform 0.5s ease, box-shadow 0.5s ease",
                        transform: isActive ? "scale(1.18)" : "scale(1)",
                        zIndex: isActive ? 2 : 1,
                      }}
                      id={`car-card-box-${index}`}
                    >
                      <CarCard
                        car={car}
                        price={car.price}
                        isSelected={selectedCarIndex === index}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        )}
      </Box>

      {/* Modal de recomendación */}
      <RecommendationModal
        open={modals.recommendation}
        onClose={() => {}}
        recommendedCar={tempRecommendedCar}
        onSelect={() => handleRecommendationAction(true)}
        onKeep={() => handleRecommendationAction(false)}
      />
    </Container>
  );
}
