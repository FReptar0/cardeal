import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Modal, IconButton, Tabs, Tab } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function CarCard({ car }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState(0); // Controla las pestañas

    const handleReserve = () => {
        router.push("/seguro");
    };

    return (
        <>
            <Card sx={{
                display: "flex",
                alignItems: "center",
                padding: 3,
                width: "100%",
                minHeight: 160,
                borderRadius: 3,
                boxShadow: 2
            }}>
                {/* Imagen - Abre el Modal al hacer clic */}
                <CardMedia
                    component="img"
                    sx={{ width: 120, height: "auto", marginRight: 2, cursor: "pointer" }}
                    image={car.image}
                    alt={car.name}
                    onClick={() => setOpen(true)}
                />

                {/* Información */}
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{car.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{car.category}</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 1, alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="https://dealrentacar.com/images/icons/ic-pax.svg" alt="Pasajeros" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.passengers} pasajeros</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="https://dealrentacar.com/images/icons/ic-door.svg" alt="Puertas" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.doors} puertas</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                            <Typography variant="body2">{car.luggage} maletas</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="https://dealrentacar.com/images/icons/ic-trans.svg" alt="Transmisión" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.transmission}</Typography>
                        </Box>
                    </Box>
                </CardContent>

                {/* Precio y botón */}
                <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", minWidth: "120px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: "black" }}>$ {car.price}</Typography>
                        <Typography variant="h6" sx={{ color: "gray" }}>/día</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#d60812",
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 20px",
                            fontSize: "16px",
                            marginTop: 1,
                            width: "100px"
                        }}
                        onClick={handleReserve}
                    >
                        RESERVAR
                    </Button>
                </Box>
            </Card>

            {/* Modal con Pestañas */}
            <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    width: "80vw", // Ajustamos el tamaño del modal
                    maxWidth: "1200px", // Limitamos el tamaño máximo para mejor visualización
                    height: "80vh", // Establecemos una altura uniforme
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    {/* Botón de cierre */}
                    <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
                        {car.name}
                    </Typography>

                    {/* Pestañas para alternar entre Imágenes y Vista 360° */}
                    <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} centered>
                        <Tab label="IMÁGENES" />
                        <Tab label="VISTA 360°" />
                    </Tabs>

                    {/* Contenedor de ambas vistas con ancho uniforme */}
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {tabIndex === 0 ? (
                            <Swiper navigation={true} modules={[Navigation]} style={{ width: "100%", height: "60vh" }}>
                                {(car.images || []).map((img, index) => (
                                    <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${index + 1}`}
                                            style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 5, objectFit: "contain" }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <iframe
                                src="https://360.pymesdigital.com.mx/Grupo%20Andrade%20360/"
                                style={{
                                    width: "100%",
                                    height: "60vh",
                                    border: "none",
                                    borderRadius: 5
                                }}
                            ></iframe>
                        )}
                    </Box>
                </Box>
            </Modal>

        </>
    );
}
