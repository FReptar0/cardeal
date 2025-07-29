import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Modal,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { validateIframeUrl } from "@/utils/security";

export default function CarDetailModal({ open, onClose, car }) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [iframeValidation, setIframeValidation] = useState({ isValid: false, sanitizedUrl: '', error: '' });

    // Validate iframe URL when car changes
    useEffect(() => {
        if (car?.image360) {
            const validation = validateIframeUrl(car.image360);
            setIframeValidation(validation);
        } else {
            setIframeValidation({ isValid: false, sanitizedUrl: '', error: '' });
        }
    }, [car?.image360]);

    if (!car) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "80vw",
                    maxWidth: "1200px",
                    height: "90vh",
                    bgcolor: "white",
                    borderRadius: 3,
                    boxShadow: 24,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ mt: 4 }}
                >
                    {car.name}
                </Typography>
                <Tabs
                    value={tabIndex}
                    onChange={(_, ix) => setTabIndex(ix)}
                    centered
                    sx={{ mt: 2 }}
                >
                    <Tab label="IMÁGENES" />
                    <Tab label="VISTA 360°" />
                </Tabs>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                    }}
                >
                    {tabIndex === 0 ? (
                        <Swiper
                            navigation
                            modules={[Navigation]}
                            style={{ width: "100%", height: "100%" }}
                        >
                            {(car.images || []).map((img, idx) => (
                                <SwiperSlide
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Imagen ${idx + 1}`}
                                        width={800}
                                        height={500}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "80vh",
                                            objectFit: "contain",
                                            borderRadius: 8,
                                            height: "auto",
                                        }}
                                        priority={idx === 0}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <>
                            {iframeValidation.isValid ? (
                                <iframe
                                    src={iframeValidation.sanitizedUrl}
                                    title="Vista 360° del vehículo"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                        borderRadius: 8,
                                    }}
                                    sandbox="allow-scripts allow-same-origin"
                                    loading="lazy"
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        Vista 360° no disponible
                                    </Alert>
                                    {iframeValidation.error && (
                                        <Typography variant="caption" color="text.secondary">
                                            {iframeValidation.error}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        justifyContent: "center",
                        py: 2,
                    }}
                >
                    {[
                        {
                            icon: "/icons/ic-pax.svg",
                            text: `${car.passengers} pasajeros`,
                        },
                        {
                            icon: "/icons/ic-door.svg",
                            text: `${car.doors} puertas`,
                        },
                        {
                            icon: "/icons/ic-luggage.svg",
                            text: `${car.luggage} maletas`,
                        },
                        { icon: "/icons/ic-trans.svg", text: car.transmission },
                        { icon: "/icons/ic-pet.svg", text: "Pet friendly" },
                        { icon: "/icons/ice.svg", text: "Aire acondicionado" },
                    ].map(({ icon, text }, j) => (
                        <Box
                            key={j}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <Image
                                src={icon}
                                alt={text}
                                width={20}
                                height={20}
                                style={{ filter: "brightness(0)", width: 20, height: 20, objectFit: "contain" }}
                                priority={j === 0}
                            />
                            <Typography variant="body2">{text}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Modal>
    );
}
