import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useRouter } from "next/router";

export default function CarCard({ car }) {
    const router = useRouter();

    const handleReserve = () => {
        router.push("/seguro");
    };

    return (
        <Card sx={{
            display: "flex",
            alignItems: "center",
            padding: 3,
            width: "100%",
            minHeight: 160,
            borderRadius: 3,
            boxShadow: 2,
            flexDirection: { xs: "column", sm: "row" }
        }}>
            {/* Imagen */}
            <CardMedia
                component="img"
                sx={{ width: { xs: "100%", sm: 120 }, height: "auto", marginRight: { sm: 2 }, cursor: "pointer" }}
                image={car.image}
                alt={car.name}
            />

            {/* Información */}
            <CardContent sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{car.category} {car.abbreviation && `(${car.abbreviation})`}</Typography>
                    {car.abbreviation && car.abbreviationMeaning && car.abbreviationDescription && (
                        <Tooltip title={`${car.abbreviationMeaning}: ${car.abbreviationDescription}`} arrow sx={{ marginLeft: 1, fontSize: "1rem"}}>
                            <IconButton size="small" sx={{ padding: 0 }} color="primary">
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Typography variant="body1" color="textSecondary" sx={{ fontStyle: "italic", marginBottom: 1 }}>{car.name}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img src="/icons/ic-pax.svg" alt="Pasajeros" width="20" height="20" />
                        <Typography variant="body2">{car.passengers} pasajeros</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img src="/icons/ic-door.svg" alt="Puertas" width="20" height="20" />
                        <Typography variant="body2">{car.doors} puertas</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                        <Typography variant="body2">{car.luggage} maletas</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img src="/icons/ic-trans.svg" alt="Transmisión" width="20" height="20" />
                        <Typography variant="body2">{car.transmission}</Typography>
                    </Box>
                </Box>
            </CardContent>

            {/* Precio y botón */}
            <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: { xs: "center", sm: "flex-end" }, justifyContent: "center", minWidth: { xs: "100%", sm: "120px" }, marginTop: { xs: 2, sm: 0 } }}>
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
    );
}
