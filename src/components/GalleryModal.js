import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, Tabs, Tab, Typography, LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import LuggageIcon from "@mui/icons-material/Luggage";
import "swiper/css";
import "swiper/css/navigation";

export default function GalleryModal({ open, onClose, car }) {
    const [tabIndex, setTabIndex] = useState(0);
    const [loading360, setLoading360] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (tabIndex === 1) {
            setLoading360(true);
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setLoading360(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
        } else {
            setLoading360(false);
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [tabIndex]);

    // Detener propagación para evitar cierre accidental
    const stopAllPropagation = (event) => {
        event.nativeEvent?.stopImmediatePropagation?.();
        event.stopPropagation();
    };

    if (!car) return null;

    return (
        <Modal
            open={open}
            onClose={(e) => {
                stopAllPropagation(e);
                onClose();
            }}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Box
                onClick={stopAllPropagation}
                sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    width: "80vw",
                    maxWidth: "1200px",
                    height: "80vh",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <IconButton
                    onClick={(e) => {
                        stopAllPropagation(e);
                        onClose();
                    }}
                    sx={{ position: "absolute", top: 10, right: 10 }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
                    {car.name}
                </Typography>
                <Tabs
                    value={tabIndex}
                    onChange={(_, newIndex) => setTabIndex(newIndex)}
                    centered
                    onClick={stopAllPropagation}
                >
                    <Tab label="IMÁGENES" />
                    <Tab label="VISTA 360°" />
                </Tabs>
                {tabIndex === 0 ? (
                    <Box
                        onClick={stopAllPropagation}
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            overflowY: "auto",
                            mt: 2,
                        }}
                    >
                        <Swiper
                            navigation={{
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }}
                            modules={[Navigation]}
                            style={{ width: "100%", height: "60vh" }}
                        >
                            {(car.images || []).map((img, index) => (
                                <SwiperSlide
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Imagen ${index + 1}`}
                                        width={800}
                                        height={500}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            borderRadius: 5,
                                        }}
                                        onClick={stopAllPropagation}
                                        unoptimized
                                    />
                                </SwiperSlide>
                            ))}
                            <div
                                className="swiper-button-next"
                                style={{ color: "black" }}
                                onClick={stopAllPropagation}
                            ></div>
                            <div
                                className="swiper-button-prev"
                                style={{ color: "black" }}
                                onClick={stopAllPropagation}
                            ></div>
                        </Swiper>
                        {/* Características del carro debajo de las imágenes */}
                        <Box
                            onClick={stopAllPropagation}
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: 2,
                                mt: 2,
                                p: 1,
                                borderTop: "1px solid #e0e0e0",
                                width: "100%",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                                <Typography variant="body2">{car.luggage} maletas</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    </Box>
                ) : (
                    <>
                        {loading360 ? (
                            <Box
                                sx={{
                                    width: "450px",
                                    height: "60vh",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mx: "auto",
                                }}
                            >
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        width: "100%",
                                        backgroundColor: "#d9d9d9",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: theme => theme.palette.secondary.main,
                                        },
                                    }}
                                />
                                <Typography align="center" sx={{ mt: 1 }}>
                                    Cargando vista 360...
                                </Typography>
                            </Box>
                        ) : (
                            <iframe
                                src={car.image360}
                                style={{
                                    width: "100%",
                                    height: "60vh",
                                    border: "none",
                                    borderRadius: 5,
                                    marginTop: 16,
                                }}
                                onClick={stopAllPropagation}
                            ></iframe>
                        )}
                    </>
                )}
                <style jsx>{`
          .swiper-button-next,
          .swiper-button-prev {
            color: black;
          }
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            color: white;
          }
        `}</style>
            </Box>
        </Modal>
    );
}
