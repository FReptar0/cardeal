import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";

import { useRouter } from "next/router"; // Importa useRouter

export default function CarCard({ car }) {

    const router = useRouter(); // Inicializa el router

    const handleReserve = () => {
        router.push("/seguro"); // Redirige a /seguro
    };

    return (
        <Card sx={{
            display: "flex",
            alignItems: "center",
            padding: 3,
            width: "100%", // Asegura que las cards ocupen el ancho completo
            minHeight: 160, // Aumenta la altura mínima
            borderRadius: 3, // Suaviza las esquinas
            boxShadow: 2 // Añade un poco de sombra
        }}
        >
            {/* Imagen */}
            <CardMedia
                component="img"
                sx={{ width: 120, height: "auto", marginRight: 2 }}
                image={car.image}
                alt={car.name}
            />

            {/* Información */}
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {car.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {car.category}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap", // Permite que los íconos no se desordenen en pantallas pequeñas
                        gap: 2,
                        marginTop: 1,
                        alignItems: "center"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img
                            src="https://dealrentacar.com/images/icons/ic-pax.svg"
                            alt="Pasajeros"
                            width="20"
                            height="20"
                            style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">{car.passengers} pasajeros</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img
                            src="https://dealrentacar.com/images/icons/ic-door.svg"
                            alt="Puertas"
                            width="20"
                            height="20"
                            style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">{car.doors} puertas</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                        <Typography variant="body2">{car.luggage} maletas</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "100px" }}>
                        <img
                            src="https://dealrentacar.com/images/icons/ic-trans.svg"
                            alt="Transmisión"
                            width="20"
                            height="20"
                            style={{ filter: "brightness(0)" }}
                        />
                        <Typography variant="body2">{car.transmission}</Typography>
                    </Box>
                </Box>
            </CardContent>

            {/* Precio y botón */}
            <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", minWidth: "120px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "black" }}>
                        $ {car.price}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "gray" }}>
                        /día
                    </Typography>
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
                        width: "100px" // Mantiene el botón alineado
                    }}
                    onClick={handleReserve}
                >
                    RESERVAR
                </Button>
            </Box>

        </Card>
    );
}
