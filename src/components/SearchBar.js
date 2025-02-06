import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    TextField,
    Autocomplete,
} from "@mui/material";

// Datos de ubicaciones organizados por ciudad
const locations = [
    { city: "CDMX", name: "Aeropuerto Internacional Benito Juárez" },
    { city: "CDMX", name: "Polanco" },
    { city: "CDMX", name: "Santa Fe" },
    { city: "CDMX", name: "Centro Histórico" },
    { city: "Monterrey", name: "Aeropuerto Internacional Mariano Escobedo" },
    { city: "Monterrey", name: "San Pedro Garza García" },
    { city: "Monterrey", name: "Centro" },
    { city: "Cancún", name: "Aeropuerto Internacional de Cancún" },
    { city: "Cancún", name: "Zona Hotelera" },
    { city: "Cancún", name: "Centro" },
];

// Obtener fecha actual y día siguiente en formato YYYY-MM-DD
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const formatDate = (date) => date.toISOString().split("T")[0];

export default function SearchBar({ onSearch }) {
    const [pickupLocation, setPickupLocation] = useState(locations[0]);
    const [returnLocation, setReturnLocation] = useState(locations[0]);
    const [sameOffice, setSameOffice] = useState(true);
    const [pickupDate, setPickupDate] = useState(formatDate(today));
    const [returnDate, setReturnDate] = useState(formatDate(tomorrow));
    const [pickupTime, setPickupTime] = useState("10:00");
    const [returnTime, setReturnTime] = useState("10:00");

    const handleSearch = () => {
        onSearch({
            pickup: pickupLocation,
            return: sameOffice ? pickupLocation : returnLocation,
            pickupDate,
            returnDate,
            pickupTime,
            returnTime,
        });
    };

    return (
        <Box
            sx={{
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            {/* Ubicación de origen */}
            <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Ubicación de origen</Typography>
            <Autocomplete
                options={locations}
                getOptionLabel={(option) => (option && option.name ? `${option.city} - ${option.name}` : "")}
                groupBy={(option) => option.city}
                renderInput={(params) => (
                    <TextField {...params} label="Selecciona ubicación" variant="outlined" sx={{ fontSize: "1.2rem" }} />
                )}
                value={pickupLocation}
                onChange={(event, newValue) => setPickupLocation(newValue)}
                sx={{ width: "100%", height: "56px" }}
            />

            {/* Checkbox "Devolver en la misma oficina" */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={sameOffice}
                        onChange={() => setSameOffice(!sameOffice)}
                        sx={{
                            color: "#d32f2f",
                            "&.Mui-checked": {
                                color: "#d32f2f",
                            },
                        }}
                    />
                }
                label="Devolver en la misma oficina"
                sx={{ color: "black", fontWeight: "bold" }}
            />

            {/* Ubicación de destino (solo si no es la misma oficina) */}
            {!sameOffice && (
                <>
                    <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Ubicación de destino</Typography>
                    <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => (option && option.name ? `${option.city} - ${option.name}` : "")}
                        groupBy={(option) => option.city}
                        renderInput={(params) => (
                            <TextField {...params} label="Selecciona ubicación" variant="outlined" sx={{ fontSize: "1.2rem" }} />
                        )}
                        value={returnLocation}
                        onChange={(event, newValue) => setReturnLocation(newValue)}
                        sx={{ width: "100%", height: "56px" }}
                    />
                </>
            )}

            {/* Fechas y Horas */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Fecha de recogida */}
                <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Fecha y hora de recogida</Typography>
                <Box sx={{ display: "flex", gap: 2, backgroundColor: "#e0e0e0", padding: 2, borderRadius: 1 }}>
                    <TextField
                        label="Fecha de recogida"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                    <TextField
                        label="Hora de recogida"
                        type="time"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                </Box>

                {/* Fecha de devolución */}
                <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Fecha y hora de devolución</Typography>
                <Box sx={{ display: "flex", gap: 2, backgroundColor: "#e0e0e0", padding: 2, borderRadius: 1 }}>
                    <TextField
                        label="Fecha de devolución"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                    <TextField
                        label="Hora de devolución"
                        type="time"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                    />
                </Box>
            </Box>

            <Button fullWidth variant="contained" sx={{ backgroundColor: "#d32f2f", color: "white", fontSize: "1.1rem", height: "56px" }} onClick={handleSearch}>
                Buscar
            </Button>
        </Box>
    );
}
