import React, { useState } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Button, useTheme } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import carData from "../data/cars.json";
import { useRouter } from "next/router";


export default function CarruselFlota({ onOpenModal }) {
    const theme = useTheme();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth <= 768 : false
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Hook para manejar la acción de "Rentar ahora"
    const handleRentNow = () => {
        if (router.pathname === "/") {
            const hero = document.getElementById("home");
            if (hero) {
                hero.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            router.push("/");
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1200px",
                overflow: "visible",
                mt: 2,
            }}
        >
            <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={isMobile ? 1 : 3}
                centeredSlides
                loop
                spaceBetween={isMobile ? 20 : 60}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                onSwiper={(sw) => setActiveIndex(sw.realIndex)}
                onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
                style={{
                    overflow: "hidden",
                    paddingTop: "50px",
                    paddingBottom: "50px",
                }}
            >
                {carData.map((car, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <SwiperSlide key={i} style={{ overflow: "visible" }}>
                            <Card
                                sx={{
                                    width: isMobile ? "75vw" : 350,
                                    maxWidth: 350,
                                    height: 530,
                                    mx: "auto",
                                    bgcolor: theme.palette.common.white,
                                    borderRadius: 3,
                                    border: "2px solid",
                                    borderColor: isActive
                                        ? theme.palette.primary.main
                                        : theme.palette.divider,
                                    transition:
                                        "transform 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                                    transform: isActive ? "scale(1.18)" : "scale(1)",
                                    boxShadow: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "visible",
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 260,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "hidden",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        onClick={() => onOpenModal(car)}
                                        image={car.image}
                                        alt={car.name}
                                        sx={{
                                            width: "95%",
                                            height: "100%",
                                            objectFit: "contain",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, px: 2 }}>
                                    <Typography variant="h6" fontWeight="bold" textAlign="center">
                                        {car.category}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        textAlign="center"
                                        sx={{ mb: 2 }}
                                    >
                                        {car.name} {car.abbreviation && `(${car.abbreviation})`}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1.5,
                                            justifyContent: "center",
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
                                            <Typography variant="body2">
                                                {car.passengers} pasajeros
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <img
                                                src="/icons/ic-door.svg"
                                                alt="Puertas"
                                                width="20"
                                                height="20"
                                                style={{ filter: "brightness(0)" }}
                                            />
                                            <Typography variant="body2">
                                                {car.doors} puertas
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <LuggageIcon fontSize="small" />
                                            <Typography variant="body2">
                                                {car.luggage} maletas
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <img
                                                src="/icons/ic-trans.svg"
                                                alt="Transmisión"
                                                width="20"
                                                height="20"
                                                style={{ filter: "brightness(0)" }}
                                            />
                                            <Typography variant="body2">
                                                {car.transmission}
                                            </Typography>
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
                                            <Typography variant="body2">
                                                Aire acondicionado
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Button
                                    data-no-select
                                    startIcon={<PhotoLibraryIcon />}
                                    sx={{
                                        m: 2,
                                        mb: 0,
                                        fontSize: "12px",
                                        textTransform: "none",
                                        color: "#3e9279",
                                        "&:hover": { color: "black" },
                                        backgroundColor: "white",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 1,
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
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onOpenModal(car);
                                    }}
                                >
                                    Ver galería
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleRentNow}
                                    sx={{
                                        m: 2,
                                        backgroundColor: theme.palette.primary.buttons,
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.buttons,
                                        },
                                    }}
                                >
                                    Rentar ahora
                                </Button>
                            </Card>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Box>
    );
}
