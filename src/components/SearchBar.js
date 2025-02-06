"use client";

import { useState, useRef } from "react";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Divider,
    TextField,
    Autocomplete,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { es } from "date-fns/locale";
import format from "date-fns/format";

// Lista de horarios disponibles
const availableTimes = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

// Ubicaciones disponibles
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

// Funciones para formatear fechas
const formatDay = (date) => (date instanceof Date && !isNaN(date)) ? format(date, "EEEE", { locale: es }) : "Día inválido";
const formatNumber = (date) => (date instanceof Date && !isNaN(date)) ? format(date, "dd") : "--";
const formatMonthYear = (date) => (date instanceof Date && !isNaN(date)) ? format(date, "MMMM yyyy", { locale: es }) : "Fecha inválida";

// Obtener fecha actual en formato YYYY-MM-DD
const getTodayDate = () => format(new Date(), "yyyy-MM-dd");

function DateTimeSelector({ label, date, setDate, time, setTime }) {
    const dateInputRef = useRef(null);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>{label}</Typography>
            <Box
                sx={{
                    display: "flex",
                    backgroundColor: "#e0e0e0",
                    borderRadius: 1,
                    padding: 2,
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Box sx={{ textAlign: "center", width: "50%", position: "relative" }}>
                    <Typography variant="body1">{formatDay(date)}</Typography>
                    {/* Número del día con efecto de hover */}
                    <Typography
                        variant="h5"
                        sx={{
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": {
                                color: "#d32f2f",
                                textShadow: "0px 0px 8px rgba(211, 47, 47, 0.6)"
                            }
                        }}
                        onClick={() => dateInputRef.current?.click()}
                    >
                        {formatNumber(date)}
                    </Typography>
                    <Typography variant="body2">{formatMonthYear(date)}</Typography>
                    {/* Input de fecha oculto, activado al hacer clic en el número */}
                    <TextField
                        type="date"
                        inputRef={dateInputRef}
                        value={format(date, "yyyy-MM-dd")}
                        onChange={(e) => setDate(new Date(e.target.value))}
                        sx={{
                            opacity: 0,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "pointer"
                        }}
                        inputProps={{ min: getTodayDate() }}
                    />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: "center", width: "50%", display: "flex", justifyContent: "center", marginLeft: 3 }}>
                    <Select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                        variant="standard"
                        disableUnderline
                        sx={{ textAlign: "center", fontSize: "1.2rem", width: "auto" }}
                    >
                        {availableTimes.map((time, index) => (
                            <MenuItem key={index} value={time}>{time}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
        </Box>
    );
}

export default function SearchBar() {
    const [pickupLocation, setPickupLocation] = useState(locations[0]);
    const [returnLocation, setReturnLocation] = useState(locations[0]);
    const [sameOffice, setSameOffice] = useState(true);
    const [pickupDate, setPickupDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [pickupTime, setPickupTime] = useState(availableTimes[0]);
    const [returnTime, setReturnTime] = useState(availableTimes[0]);

    // Lógica para actualizar la fecha de devolución automáticamente si la fecha de recogida cambia
    const handlePickupDateChange = (newDate) => {
        setPickupDate(newDate);

        // Si la fecha de devolución es anterior a la fecha de recogida, la ajusta automáticamente
        if (returnDate < newDate) {
            setReturnDate(new Date(newDate.setDate(newDate.getDate() + 1)));
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Ubicación de origen</Typography>
            <Autocomplete
                options={locations}
                getOptionLabel={(option) => `${option.city} - ${option.name}`}
                groupBy={(option) => option.city}
                renderInput={(params) => <TextField {...params} label="Selecciona ubicación" variant="outlined" />}
                value={pickupLocation}
                onChange={(event, newValue) => setPickupLocation(newValue)}
                sx={{ width: "100%" }}
            />
            <FormControlLabel
                control={<Checkbox checked={sameOffice} onChange={() => setSameOffice(!sameOffice)} sx={{ color: "#d32f2f", "&.Mui-checked": { color: "#d32f2f" } }} />}
                label="Devolver en la misma oficina"
                sx={{ color: "black", fontWeight: "bold" }}
            />
            {!sameOffice && (
                <>
                    <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>Ubicación de destino</Typography>
                    <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => `${option.city} - ${option.name}`}
                        groupBy={(option) => option.city}
                        renderInput={(params) => <TextField {...params} label="Selecciona ubicación" variant="outlined" />}
                        value={returnLocation}
                        onChange={(event, newValue) => setReturnLocation(newValue)}
                        sx={{ width: "100%" }}
                    />
                </>
            )}
            <DateTimeSelector label="Fecha y Hora de Recogida" date={pickupDate} setDate={handlePickupDateChange} time={pickupTime} setTime={setPickupTime} />
            <DateTimeSelector label="Fecha y Hora de Devolución" date={returnDate} setDate={setReturnDate} time={returnTime} setTime={setReturnTime} />
        </Box>
    );
}
