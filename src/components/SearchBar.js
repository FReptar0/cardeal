"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  TextField,
  Autocomplete,
  FormControlLabel,
  Button,
  Checkbox,
} from "@mui/material";
import { es } from "date-fns/locale";
import format from "date-fns/format";

// Lista de horarios disponibles
const availableTimes = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

function convert12to24(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

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
const formatDay = (date) =>
  date instanceof Date && !isNaN(date)
    ? format(date, "EEEE", { locale: es })
    : "Día inválido";
const formatNumber = (date) =>
  date instanceof Date && !isNaN(date) ? format(date, "dd") : "--";
const formatMonthYear = (date) =>
  date instanceof Date && !isNaN(date)
    ? format(date, "MMMM yyyy", { locale: es })
    : "Fecha inválida";

// Obtener fecha actual en formato YYYY-MM-DD
const getTodayDate = () => format(new Date(), "yyyy-MM-dd");

function DateTimeSelector({ label, date, setDate, time, setTime }) {
  const dateInputRef = useRef(null);
  const router = useRouter(); // Inicializa el router
  const isRentalPage = router.pathname === "/rental" || router.pathname === "/seguro"
  || router.pathname === "/extras-renta"; // Detecta si está en rental

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        variant={isRentalPage ? "body1" : "h6"}
        sx={{ color: "black", fontWeight: "bold" }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#e0e0e0",
          borderRadius: 1,
          padding: 0.2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            width: "50%",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <Typography variant="body1">{formatDay(date)}</Typography>

          {/* Número del día con efecto de hover */}
          <Typography
            variant="h5"
            sx={{
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                color: "#d32f2f",
                textShadow: "0px 0px 8px rgba(211, 47, 47, 0.6)",
              },
            }}
          >
            {formatNumber(date)}
          </Typography>

          <Typography variant="body2">{formatMonthYear(date)}</Typography>

          {/* Botón invisible que activa el DatePicker */}
          <Button
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
            disableRipple
            disableFocusRipple
            onClick={() => dateInputRef.current?.showPicker()}
          ></Button>

          <TextField
            type="date"
            inputRef={dateInputRef}
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-");
              const selectedDate = new Date(year, month - 1, day);
              setDate(selectedDate);
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
            inputProps={{ min: getTodayDate() }}
          />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            textAlign: "center",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            marginLeft: 3,
          }}
        >
          <Select
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
            fullWidth
            variant="standard"
            disableUnderline
            sx={{ textAlign: "center", fontSize: "1.2rem", width: "auto" }}
          >
            {availableTimes.map((time, index) => (
              <MenuItem key={index} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function SearchBar({ sx = {} }) {
  const router = useRouter();
  const isRentalPage = router.pathname === "/rental" || router.pathname === "/seguro"
  || router.pathname === "/extras-renta";
  const [pickupLocation, setPickupLocation] = useState(locations[0]);
  const [returnLocation, setReturnLocation] = useState(locations[0]);
  const [sameOffice, setSameOffice] = useState(true);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [pickupTime, setPickupTime] = useState(availableTimes[0]);
  const [returnTime, setReturnTime] = useState(availableTimes[0]);

  const handlePickupDateChange = (newDate) => {
    const newPickupDate = new Date(newDate);
    newPickupDate.setHours(0, 0, 0, 0);

    const currentReturnDate = new Date(returnDate);
    currentReturnDate.setHours(0, 0, 0, 0);

    // 1. Ajustar la fecha de recepción
    setPickupDate(newPickupDate);

    // 2. Si la fecha de devolución es anterior, la pasamos al siguiente día
    if (currentReturnDate < newPickupDate) {
      const adjustedReturnDate = new Date(newPickupDate);
      adjustedReturnDate.setDate(adjustedReturnDate.getDate() + 1);
      setReturnDate(adjustedReturnDate);
      setReturnTime("08:00 AM"); // Primera hora disponible, o la que prefieras
      return;
    }

    // 3. Si ahora ambas fechas son iguales, verificar horas
    if (newPickupDate.toDateString() === currentReturnDate.toDateString()) {
      const pickupMin = convert12to24(pickupTime);
      const returnMin = convert12to24(returnTime);

      // Si la hora de recepción >= hora de devolución
      if (pickupMin >= returnMin) {
        // Ajustamos la hora de recepción a la primera del día
        setPickupTime("08:00 AM");

        // Buscamos un horario de devolución posterior a 08:00 AM
        const nextAvailable = availableTimes.find(
          (t) => convert12to24(t) > convert12to24("08:00 AM")
        );

        if (nextAvailable) {
          // Si existe un horario posterior, lo asignamos
          setReturnTime(nextAvailable);
        } else {
          // Si no hay horario posterior, pasamos la devolución al siguiente día
          const newReturnDate = new Date(returnDate);
          newReturnDate.setDate(newReturnDate.getDate() + 1);
          setReturnDate(newReturnDate);
          setReturnTime("08:00 AM"); // O la hora que prefieras al siguiente día
        }
      }
    }
  };
  const handleReturnDateChange = (newDate) => {
    const newReturnDate = new Date(newDate);
    newReturnDate.setHours(0, 0, 0, 0);

    const currentPickupDate = new Date(pickupDate);
    currentPickupDate.setHours(0, 0, 0, 0);

    setReturnDate(newReturnDate);

    // Si la fecha de recepción es mayor a la de devolución, ajustarla
    if (newReturnDate < currentPickupDate) {
      const adjustedPickupDate = new Date(newReturnDate);
      adjustedPickupDate.setDate(adjustedPickupDate.getDate() - 1);
      setPickupDate(adjustedPickupDate);
      setPickupTime("02:00 PM"); // Establecer una hora estándar
    }
  };

  const handlePickupTimeChange = (newTime) => {
    setPickupTime(newTime);

    // Solo si ambas fechas son iguales comparamos las horas
    if (returnDate.toDateString() === pickupDate.toDateString()) {
      const pickupMin = convert12to24(newTime);
      const returnMin = convert12to24(returnTime);

      // Si la hora de devolución es menor o igual a la de recepción
      if (returnMin <= pickupMin) {
        // Buscar el siguiente horario disponible ese mismo día
        const nextAvailable = availableTimes.find(
          (t) => convert12to24(t) > pickupMin
        );

        if (nextAvailable) {
          // Existe un horario posterior el mismo día
          setReturnTime(nextAvailable);
        } else {
          // No hay horario posterior: mover la fecha de devolución al día siguiente
          const newReturnDate = new Date(returnDate);
          newReturnDate.setDate(newReturnDate.getDate() + 1);

          setReturnDate(newReturnDate);
          setReturnTime(availableTimes[0]); // El primer horario (08:00 AM)
        }
      }
    }
  };

  const handleReturnTimeChange = (newTime) => {
    // Si recepción y devolución son el mismo día
    if (returnDate.toDateString() === pickupDate.toDateString()) {
      const pickupMin = convert12to24(pickupTime);
      const returnMin = convert12to24(newTime);

      // No permitimos devolución antes o igual a la recepción
      if (returnMin <= pickupMin) {
        // Intentar encontrar un horario posterior el mismo día
        const nextAvailable = availableTimes.find(
          (t) => convert12to24(t) > pickupMin
        );

        if (nextAvailable) {
          setReturnTime(nextAvailable);
        } else {
          // No existe horario posterior; pasar al siguiente día
          const newReturnDate = new Date(returnDate);
          newReturnDate.setDate(newReturnDate.getDate() + 1);

          setReturnDate(newReturnDate);
          setReturnTime(availableTimes[0]); // 08:00 AM
        }
        return;
      }
    }

    // Si la fecha es distinta o la hora es válida, simplemente se asigna
    setReturnTime(newTime);
  };

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: isRentalPage ? 0.5 : 3,
        width: "100%",
        padding: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxSizing: "border-box",
        ...sx,
      }}
      id="containerBox"
    >
      {!isRentalPage && (
        <Typography
          variant={"h6"}
          sx={{ color: "black", fontWeight: "bold", marginBottom: "6px" }}
          id="ubicacionOrigenSB"
        >
          Ubicación de origen
        </Typography>
      )}
      <Autocomplete
        options={locations}
        getOptionLabel={(option) => `${option.city} - ${option.name}`}
        groupBy={(option) => option.city}
        renderInput={(params) => (
          <TextField
            {...params}
            label={isRentalPage ? "Ubicación de origen" : "Selecciona ubicación"} 
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingTop: "8px", // Ajusta el padding superior del input
                paddingBottom: "6px", // Ajusta el padding inferior del input
              },
              "& .MuiInputLabel-root": {
                fontSize: isRentalPage ? "1.1rem" : "0.9rem", // Aumenta el tamaño del label
                backgroundColor: "#f5f5f5", // Fondo blanco para evitar que el borde lo cubra
                paddingRight: "4px", // Agrega un pequeño padding horizontal al label
                color: "black", //
                top: isRentalPage ? -4 : -2,
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -6px) scale(0.9)", // Ajusta la posición del label cuando está en foco
              },
            }}
          />
        )}
        value={pickupLocation}
        onChange={(event, newValue) => setPickupLocation(newValue)}
        sx={{ width: "100%" }}
      />
      <FormControlLabel
        id="checkboxSB"
        control={
          <Checkbox
            checked={sameOffice}
            onChange={() => setSameOffice(!sameOffice)}
            sx={{ color: "#d32f2f", "&.Mui-checked": { color: "#d32f2f" } }}
          />
        }
        label="Devolver en la misma oficina"
        sx={{ color: "black", fontWeight: "bold" }}
      />
      {!sameOffice && (
        <>
          {!isRentalPage && (
            <Typography
              className="second-select"
              variant={"h6"}
              sx={{ color: "black", fontWeight: "bold", marginBottom: "6px" }}
              id="ubicacionDestinoSB"
            >
              Ubicación de destino
            </Typography>
          )}
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => `${option.city} - ${option.name}`}
            groupBy={(option) => option.city}
            renderInput={(params) => (
              <TextField
                {...params}
                label={isRentalPage ? "Ubicación de destino" : "Selecciona ubicación"} 
                variant="outlined"
                sx={{
                  marginTop: "10px",
                  "& .MuiOutlinedInput-root": {
                    paddingTop: "8px", // Ajusta el padding superior del input
                    paddingBottom: "6px", // Ajusta el padding inferior del input
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: isRentalPage ? "1.1rem" : "0.9rem", // Aumenta el tamaño del label
                    backgroundColor: "#f5f5f5", // Fondo blanco para evitar que el borde lo cubra
                    paddingRight: "4px", // Agrega un pequeño padding horizontal al label
                    color: "black", //
                    top: isRentalPage ? -4 : -2,
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.9)", // Ajusta la posición del label cuando está en foco
                  },
                }}
              />
            )}
            value={returnLocation}
            onChange={(event, newValue) => setReturnLocation(newValue)}
            sx={{ width: "100%" }}
          />
        </>
      )}

      {/* Fechas y horas alineadas en fila en pantallas grandes y en columna en pantallas pequeñas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column en móviles, fila en desktop
          gap: 2,
          mt: 1,
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <DateTimeSelector
            label="Fecha y hora de recepción"
            date={pickupDate}
            setDate={handlePickupDateChange}
            time={pickupTime}
            setTime={handlePickupTimeChange}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DateTimeSelector
            label="Fecha y hora de devolución"
            date={returnDate}
            setDate={handleReturnDateChange}
            time={returnTime}
            setTime={handleReturnTimeChange}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        className="btn-buscar-sb"
        color="primary"
        sx={{ backgroundColor: "#d60812", width: "100%", margin: "0 auto" }}
        onClick={() => router.push("/rental")}
      >
        Buscar
      </Button>
    </Box>
  );
}
