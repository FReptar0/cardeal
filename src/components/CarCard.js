import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Modal, IconButton, Tabs, Tab, Tooltip, Divider } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
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
                boxShadow: 2,
                flexDirection: { xs: "column", sm: "row" }, // Ajuste para móviles
                cursor: "pointer",
                "&:hover": { boxShadow: 5, transform: "scale(1.02)" }


            }}
                onClick={handleReserve}
            >
                {/* Imagen - Abre el Modal al hacer clic */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CardMedia
                        component="img"
                        sx={{ width: { xs: "100%", sm: 120 }, height: "auto", cursor: "pointer" }}
                        image={car.image}
                        alt={car.name}
                        onClick={(event) => {
                            event.stopPropagation(); // Evita que el clic en la imagen afecte la Card
                            setOpen(true);
                        }}
                    />

                    {/* Botón con icono para indicar galería */}
                    <Button
                        startIcon={<PhotoLibraryIcon />}
                        sx={{
                            marginTop: 1,
                            fontSize: "12px",
                            textTransform: "none",
                            color: "gray",
                            "&:hover": { color: "black" }
                        }}
                        onClick={(event) => {
                            event.stopPropagation(); // Evita que el clic en el botón afecte la Card
                            setOpen(true);
                        }}
                    >
                        Ver galería
                    </Button>
                </Box>

                {/* Información */}
                <CardContent sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">{car.category}</Typography>
                        {car.abbreviation && (
                            <Typography variant="body2" sx={{ color: "gray" }}>
                                ({car.abbreviation})
                            </Typography>
                        )}
                        {car.abbreviation && car.abbreviationMeaning && car.abbreviationDescription && (
                            <Tooltip title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`} arrow>
                                <IconButton size="small" sx={{ padding: 0, color: "gray" }}>
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Typography variant="body1" color="textSecondary" sx={{ fontStyle: "italic", marginBottom: 1 }}>{car.name}</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="/icons/ic-pax.svg" alt="Pasajeros" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.passengers} pasajeros</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="/icons/ic-door.svg" alt="Puertas" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.doors} puertas</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                            <Typography variant="body2">{car.luggage} maletas</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="/icons/ic-trans.svg" alt="Transmisión" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">{car.transmission}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                            <img src="/icons/ic-pet.svg" alt="Pet friendly" width="20" height="20" style={{ filter: "brightness(0)" }} />
                            <Typography variant="body2">Pet friendly</Typography>
                        </Box>
                    </Box>
                </CardContent>

                {/* Precio y botón */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", sm: "flex-end" },
                    justifyContent: "center",
                    minWidth: { xs: "100%", sm: "250px" },
                    marginTop: { xs: 2, sm: 0 }
                }}>
                    {/* Precios */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        width: "100%"
                    }}>
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: "#508a69" }}>Precio en línea</Typography>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>$ {car.price} <Typography variant="body2" component="span" sx={{ color: "gray" }}>MXN/día</Typography></Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: "#d60812" }}>Precio en Sucursal</Typography>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>$ {car.price2} <Typography variant="body2" component="span" sx={{ color: "gray" }}>MXN/día</Typography></Typography>
                        </Box>
                    </Box>


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

                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
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
                            <Swiper
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                modules={[Navigation]}
                                style={{ width: "100%", height: "60vh" }}
                            >
                                {(car.images || []).map((img, index) => (
                                    <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${index + 1}`}
                                            style={{ maxWidth: "80%", maxHeight: "50vh", borderRadius: 5, objectFit: "contain", margin: "0 20px" }}
                                        />
                                    </SwiperSlide>
                                ))}
                                <div className="swiper-button-next" style={{ color: 'black' }}></div>
                                <div className="swiper-button-prev" style={{ color: 'black' }}></div>
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

            <style jsx>{`
                .swiper-button-next, .swiper-button-prev {
                    color: black;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    color: white;
                }
            `}</style>
        </>
    );
}
