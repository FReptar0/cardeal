"use client";

import { useRef, useState, useEffect } from "react";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSearch } from "@/contexts/SearchContext";
import { locations } from "@/utils/locations";
import { useBooking } from "@/contexts/BookingContext";


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

// Función para convertir formato 12h a minutos (para comparaciones)
function convert12to24(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

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

// Función para obtener la fecha actual en la zona "America/Mexico_City"
const getTodayDate = () => {
  // Se obtiene la fecha en formato de CDMX y se formatea a YYYY-MM-DD
  const mexicoDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );
  return format(mexicoDate, "yyyy-MM-dd");
};

function DateTimeSelector({ label, date, setDate, time, setTime }) {
  const dateInputRef = useRef(null);
  const router = useRouter();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";

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
            {availableTimes.map((t, index) => (
              <MenuItem key={index} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}

export default function SearchBar({ sx = {} }) {
  const router = useRouter();
  const { searchData, setSearchData } = useSearch(); // Usamos el contexto global
  const { selectedCar } = useBooking();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  // Funciones para actualizar el contexto al cambiar valores:
  const handlePickupLocationChange = (event, newValue) =>
    setSearchData({ ...searchData, pickupLocation: newValue });

  const handleReturnLocationChange = (event, newValue) =>
    setSearchData({ ...searchData, returnLocation: newValue });

  const handleSameOfficeChange = () =>
    setSearchData({ ...searchData, sameOffice: !searchData.sameOffice });

  const handlePickupDateChange = (newDate) => {
    const newPickupDate = new Date(newDate);
    newPickupDate.setHours(0, 0, 0, 0);
    let newReturnDate = new Date(searchData.returnDate);
    newReturnDate.setHours(0, 0, 0, 0);
    if (newReturnDate < newPickupDate) {
      newReturnDate = new Date(newPickupDate);
      newReturnDate.setDate(newReturnDate.getDate() + 1);
    }
    setSearchData({
      ...searchData,
      pickupDate: newPickupDate,
      returnDate: newReturnDate,
      pickupTime: "08:00 AM",
      returnTime: "08:00 AM",
    });
  };

  const handleReturnDateChange = (newDate) => {
    const newReturnDate = new Date(newDate);
    newReturnDate.setHours(0, 0, 0, 0);
    let currentPickupDate = new Date(searchData.pickupDate);
    currentPickupDate.setHours(0, 0, 0, 0);
    if (newReturnDate < currentPickupDate) {
      currentPickupDate = new Date(newReturnDate);
      currentPickupDate.setDate(currentPickupDate.getDate() - 1);
    }
    setSearchData({
      ...searchData,
      returnDate: newReturnDate,
      pickupDate: currentPickupDate,
    });
  };

  const handlePickupTimeChange = (newTime) =>
    setSearchData({ ...searchData, pickupTime: newTime });

  const handleReturnTimeChange = (newTime) =>
    setSearchData({ ...searchData, returnTime: newTime });

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  if (!isMounted) return null;


  const searchForm = (
    <>
      {!isRentalPage && (
        <Typography
          variant="h6"
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
            label={
              isRentalPage ? "Ubicación de origen" : "Selecciona ubicación"
            }
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingTop: "8px",
                paddingBottom: "6px",
              },
              "& .MuiInputLabel-root": {
                fontSize: isRentalPage ? "1.1rem" : "0.9rem",
                backgroundColor: "#f5f5f5",
                paddingRight: "4px",
                color: "black",
                top: isRentalPage ? -4 : -2,
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -6px) scale(0.9)",
              },
            }}
          />
        )}
        value={searchData.pickupLocation}
        onChange={handlePickupLocationChange}
        sx={{ width: "100%" }}
      />
      <FormControlLabel
        id="checkboxSB"
        control={
          <Checkbox
            checked={searchData.sameOffice}
            onChange={handleSameOfficeChange}
            sx={{ color: "#d32f2f", "&.Mui-checked": { color: "#d32f2f" } }}
          />
        }
        label="Devolver en la misma oficina"
        sx={{ color: "black", fontWeight: "bold", width: "100%", justifyContent: "start" }}
      />
      {!searchData.sameOffice && (
        <>
          {!isRentalPage && (
            <Typography
              className="second-select"
              variant="h6"
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
                label={
                  isRentalPage ? "Ubicación de destino" : "Selecciona ubicación"
                }
                variant="outlined"
                sx={{
                  marginTop: "10px",
                  "& .MuiOutlinedInput-root": {
                    paddingTop: "8px",
                    paddingBottom: "6px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: isRentalPage ? "1.1rem" : "0.9rem",
                    backgroundColor: "#f5f5f5",
                    paddingRight: "4px",
                    color: "black",
                    top: isRentalPage ? -4 : -2,
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.9)",
                  },
                }}
              />
            )}
            value={searchData.returnLocation}
            onChange={handleReturnLocationChange}
            sx={{ width: "100%" }}
          />
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 1,
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <DateTimeSelector
            label="Fecha y hora de recepción"
            date={searchData.pickupDate}
            setDate={handlePickupDateChange}
            time={searchData.pickupTime}
            setTime={handlePickupTimeChange}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DateTimeSelector
            label="Fecha y hora de devolución"
            date={searchData.returnDate}
            setDate={handleReturnDateChange}
            time={searchData.returnTime}
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
    </>
  );

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
      {router.pathname === "/proteccion" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Columna de auto */}
          {selectedCar && (
            <Box sx={{ flex: 1, minWidth: "250px" }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {selectedCar?.image && (
                  <Box
                    component="img"
                    src={selectedCar.image}
                    alt={selectedCar.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "218px",
                      objectFit: "contain",
                      marginBottom: 2,
                      borderRadius: "8px",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
          <Box sx={{ flex: 2 }}>{searchForm}</Box>
        </Box>
      ) : (
        searchForm
      )}
    </Box>
  );
}
