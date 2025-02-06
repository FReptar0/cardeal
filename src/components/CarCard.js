import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";

export default function CarCard({ car }) {
    return (
        <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
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
                <Box sx={{ display: "flex", gap: 2, marginTop: 1, alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <img 
                            src="https://dealrentacar.com/images/icons/ic-pax.svg" 
                            alt="Pasajeros" 
                            width="20"
                            height="20"
                            style={{ filter: "brightness(0)" }} 
                        />
                        <Typography variant="body2">{car.passengers} pasajeros</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <img 
                            src="https://dealrentacar.com/images/icons/ic-door.svg" 
                            alt="Puertas" 
                            width="20"
                            height="20"
                            style={{ filter: "brightness(0)" }} 
                        />
                        <Typography variant="body2">{car.doors} puertas</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <LuggageIcon fontSize="small" sx={{ color: "black" }} />
                        <Typography variant="body2">{car.luggage} maletas</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
            <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6" fontWeight="bold">
                    {car.price} MXN
                </Typography>
                <Typography variant="body2">{car.price} MXN/día</Typography>
                <Button variant="contained" sx={{ backgroundColor: "#d32f2f", color: "white", marginTop: 1 }}>
                    Reservar
                </Button>
            </Box>
        </Card>
    );
}
