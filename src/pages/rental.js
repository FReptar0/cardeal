"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, CircularProgress, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RecommendationModal from "../components/RecommendationModal";
import RentalStepper from "../components/Stepper";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";
import dynamic from "next/dynamic";
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});
const CompactHeader = dynamic(() => import("../components/CompactHeader"), {
  ssr: false,
});

// Loader con puntos animados
const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const iv = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 200);
    return () => clearInterval(iv);
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
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(null);
  const [headerState, setHeaderState] = useState({
    isTop: true,
    showCompact: false,
    hideSearch: false,
  });
  const [searchData, setSearchData] = useState(null);
  const [modals, setModals] = useState({ recommendation: false });
  const [tempRecommendedCar, setTempRecommendedCar] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();
  const scrollRefs = useRef([]);
  const { selectedCar, setSelectedCar } = useBooking();
  const { searchData: searchContextData } = useSearch();

  // Formatea fecha según TSD
  const formatTSDDate = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    let h = date.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${pad(date.getMonth() + 1)}${pad(
      date.getDate()
    )}${date.getFullYear()} ${pad(h)}:${pad(date.getMinutes())} ${ampm}`;
  };

  // Trae tarifas
  const fetchRates = async (params) => {
    try {
      setLoadingPrices(true);
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const rates = await res.json();

      // Únicos por categoría
      const unique = rates.reduce((acc, r) => {
        if (!acc.find((x) => x.category === r.category)) acc.push(r);
        return acc;
      }, []);

      const mapped = unique
        .map((rate) => {
          const carInfo = carsData.find(
            (c) => c.abbreviation === rate.category
          );
          if (!carInfo || !rate.baseRate || rate.baseRate === "N/A")
            return null;
          const base = parseFloat(rate.baseRate);
          const discount = parseFloat((base * 0.9).toFixed(2));
          return {
            ...carInfo,
            ...rate,
            price2: base,
            price: discount,
          };
        })
        .filter(Boolean);

      setFilteredCars(mapped);
    } catch (e) {
      console.error("Error al obtener tarifas:", e);
      setFilteredCars([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Maneja búsqueda
  const handleSearch = (filters) => {
    if (!filters) return setFilteredCars([]);

    const makeDateTime = (date, time) => {
      const dt = new Date(date);
      const [timeStr, ampm] = time.split(" ");
      let [h, m] = timeStr.split(":").map(Number);
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      dt.setHours(h, m, 0, 0);
      return formatTSDDate(dt);
    };

    const params = {
      pickupLocationId: filters.pickupLocation?.id,
      returnLocationId: filters.sameOffice
        ? filters.pickupLocation?.id
        : filters.returnLocation?.id,
      pickupDateTime: makeDateTime(filters.pickupDate, filters.pickupTime),
      returnDateTime: makeDateTime(filters.returnDate, filters.returnTime),
    };
    fetchRates(params);
  };

  // Selecciona auto
  const handleCarSelect = (car, ix) => {
    setSelectedCarIndex(ix);
    setSelectedCar(car);
    if (ix < filteredCars.length - 1) {
      setTempRecommendedCar(filteredCars[ix + 1]);
      setModals((prev) => ({ ...prev, recommendation: true }));
    } else {
      router.push("/proteccion");
    }
  };
  const handleRecommendationAction = (selectNext) => {
    if (selectNext && selectedCarIndex < filteredCars.length - 1) {
      const ni = selectedCarIndex + 1;
      setSelectedCarIndex(ni);
      setSelectedCar(filteredCars[ni]);
    }
    setModals((prev) => ({ ...prev, recommendation: false }));
    router.push("/proteccion");
  };

  // Efectos
  useEffect(() => {
    if (searchContextData?.pickupDate) handleSearch(searchContextData);
  }, []);

  useEffect(() => {
    if (!searchData && searchContextData) setSearchData(searchContextData);
  }, [searchData, searchContextData]);

  useEffect(() => {
    const iv = setInterval(() => {
      const isTop = JSON.parse(localStorage.getItem("isHeaderTop") || "true");
      setHeaderState({ isTop, showCompact: !isTop, hideSearch: !isTop });
    }, 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (selectedCar) {
      const ix = filteredCars.findIndex((c) => c.name === selectedCar.name);
      if (ix !== -1) setSelectedCarIndex(ix);
    }
  }, [selectedCar, filteredCars]);

  useEffect(() => {
    const el = scrollRefs.current[selectedCarIndex];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedCarIndex]);

  const safeSearchData = searchData || {
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
  };

  return (
    <Container sx={{ mt: "148px", px: 2, pb: 5 }}>
      {/* Search */}
      <Box
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

      {headerState.showCompact && <Box sx={{ height: 50 }} />}

      <Box sx={{ width: "100%", mt: -12 }}>
        <RentalStepper />
      </Box>

      {/* Carrusel */}
      <Box
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
          m: "0 auto",
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
          <Box sx={{ height: "20vh", display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              sx={{ color: "secondary.text", fontWeight: "bold" }}
            >
              No hay autos disponibles para tu búsqueda.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              mt: 2,
              overflowX: "hidden", // recorta sólo en horizontal
              overflowY: "visible", // permite ver lo que sobresale arriba/abajo
              px: "32px",
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {/* Flechas laterales centradas verticalmente */}
              <IconButton
                aria-label="Anterior"
                onClick={() => window._rentalSwiper && window._rentalSwiper.slidePrev()}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '-32px',
                  transform: 'translateY(-50%)',
                  bgcolor: 'white',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.100' },
                  display: { xs: 'none', sm: 'flex' },
                  zIndex: 10,
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                aria-label="Siguiente"
                onClick={() => window._rentalSwiper && window._rentalSwiper.slideNext()}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '-32px',
                  transform: 'translateY(-50%)',
                  bgcolor: 'white',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.100' },
                  display: { xs: 'none', sm: 'flex' },
                  zIndex: 10,
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
              <Swiper
                modules={[]}
                slidesPerView={3}
                centeredSlides
                loop
                spaceBetween={40}
                autoplay={false}
                onSlideChange={(s) => setActiveIndex(s.realIndex)}
                style={{
                  overflow: "visible",
                  paddingTop: "80px",
                  paddingBottom: "80px",
                }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 10 },
                  600: { slidesPerView: 2, spaceBetween: 20 },
                  900: { slidesPerView: 3, spaceBetween: 40 },
                }}
                onSwiper={(swiper) => { window._rentalSwiper = swiper; }}
              >
              {filteredCars.map((car, ix) => {
                const isActive = ix === activeIndex;
                return (
                  <SwiperSlide key={ix}>
                    <Box
                      ref={(el) => (scrollRefs.current[ix] = el)}
                      onClick={() => handleCarSelect(car, ix)}
                      sx={{
                        cursor: "pointer",
                        width: "100%",
                        maxWidth: { xs: "98vw", sm: "98vw", md: 500, lg: 540 },
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        transition: "transform 0.5s ease",
                        transform: isActive ? "scale(1.18)" : "scale(1)",
                        zIndex: isActive ? 2 : 1,
                      }}
                    >
                      <CarCard
                        car={car}
                        price={car.price}
                        isSelected={selectedCarIndex === ix}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })}
              </Swiper>
              {/* Dots */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                {filteredCars.map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        i === activeIndex ? "primary.main" : "grey.400",
                      mx: 0.5,
                      transition: "background-color 0.3s",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

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
