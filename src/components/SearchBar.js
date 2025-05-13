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
import { useBooking } from "@/contexts/BookingContext";

function generateTimeSlots(startTime, endTime) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const slots = [];
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current <= end) {
    const h = current.getHours();
    const m = current.getMinutes();
    const formatted = `${(h % 12 || 12).toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    slots.push(formatted);
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
}

// Función para convertir formato 12h a minutos (para comparaciones)
function convert12to24(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const parseBusinessHours = (raw) => {
  const daysMap = {
    0: "OpenCloseSun",
    1: "OpenCloseMon",
    2: "OpenCloseTue",
    3: "OpenCloseWed",
    4: "OpenCloseThu",
    5: "OpenCloseFri",
    6: "OpenCloseSat",
  };

  const dayKey = daysMap[new Date().getDay()];
  const horario = raw?.[dayKey];

  const rango = Array.isArray(horario) ? horario[0] : horario;

  if (rango && /^[0-9]{4}-[0-9]{4}$/.test(rango)) {
    const [start, end] = rango.split("-");
    const formatHour = (h) => `${h.slice(0, 2)}:${h.slice(2)}`;
    return {
      start: formatHour(start),
      end: formatHour(end),
    };
  }

  return null; // Cerrado o inválido
};

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
  const mexicoDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );
  return format(mexicoDate, "yyyy-MM-dd");
};

function DateTimeSelector({
  label,
  date,
  setDate,
  time,
  setTime,
  businessHours,
}) {
  const dateInputRef = useRef(null);
  const router = useRouter();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";

  const horario = parseBusinessHours(businessHours);
  const timeSlots = horario
    ? generateTimeSlots(horario.start, horario.end)
    : [];

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
          />
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
            alignItems: "center",
            marginLeft: 3,
            px: 2,
          }}
        >
          {timeSlots.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay horarios para mostrar
            </Typography>
          ) : (
            <Select
              value={time || ""}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              variant="standard"
              disableUnderline
              displayEmpty
              sx={{ textAlign: "center", fontSize: "1.2rem", width: "auto" }}
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 300 },
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecciona
              </MenuItem>
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function SearchBar({ sx = {} }) {
  const router = useRouter();
  const { searchData, setSearchData } = useSearch(); // Contexto global
  const { selectedCar } = useBooking();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";
  const showCarImage =
    router.pathname === "/extras-renta" || router.pathname === "/proteccion";
  const [isMounted, setIsMounted] = useState(false);

  const [pickupHours, setPickupHours] = useState(null);
  const [returnHours, setReturnHours] = useState(null);

  const fetchBusinessHours = async (locationId, setHoursFn) => {
    try {
      const res = await fetch("/api/locations/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      });
      const data = await res.json();
      setHoursFn(data);
    } catch (err) {
      console.error("Error al obtener horarios:", err);
      setHoursFn(null);
    }
  };

  // ——— NUEVO: estado y fetch de sucursales desde API ———
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/api/locations")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error al cargar sucursales:", err));
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchData.pickupLocation?.id) {
      fetchBusinessHours(searchData.pickupLocation.id, setPickupHours);

      if (searchData.sameOffice) {
        setReturnHours(null);
      }
    }

    if (!searchData.sameOffice && searchData.returnLocation?.id) {
      fetchBusinessHours(searchData.returnLocation.id, setReturnHours);
    }
  }, [isMounted]);

  // Handlers sin tocar
  const handlePickupLocationChange = (e, newValue) => {
    setSearchData({ ...searchData, pickupLocation: newValue });

    if (newValue?.id) {
      fetchBusinessHours(newValue.id, (data) => {
        setPickupHours(data);

        const horario = parseBusinessHours(data);
        if (horario) {
          const validHours = generateTimeSlots(horario.start, horario.end);
          if (!validHours.includes(searchData.pickupTime)) {
            setSearchData((prev) => ({
              ...prev,
              pickupTime: validHours[0], // Primer horario válido
            }));
          }
        }
      });

      if (searchData.sameOffice) {
        fetchBusinessHours(newValue.id, (data) => {
          setReturnHours(data);

          const horario = parseBusinessHours(data);
          if (horario) {
            const validHours = generateTimeSlots(horario.start, horario.end);
            if (!validHours.includes(searchData.returnTime)) {
              setSearchData((prev) => ({
                ...prev,
                returnTime: validHours[0],
              }));
            }
          }
        });
      }
    }
  };
  const handleReturnLocationChange = (e, newValue) => {
    // Si el usuario seleccionó la misma ubicación de origen, volvemos a activar el check
    if (
      newValue?.id &&
      searchData.pickupLocation?.id &&
      newValue.id === searchData.pickupLocation.id
    ) {
      setSearchData({
        ...searchData,
        sameOffice: true,
        returnLocation: searchData.pickupLocation,
        returnTime: searchData.pickupTime,
      });

      fetchBusinessHours(searchData.pickupLocation.id, (data) => {
        setReturnHours(data);

        const horario = parseBusinessHours(data);
        if (horario) {
          const validHours = generateTimeSlots(horario.start, horario.end);
          if (!validHours.includes(searchData.returnTime)) {
            setSearchData((prev) => ({
              ...prev,
              returnTime: validHours[0],
            }));
          }
        }
      });

      return; // salimos porque ya hicimos todo
    }

    // Si es diferente, actualizamos normalmente
    setSearchData({ ...searchData, returnLocation: newValue });

    if (newValue?.id && !searchData.sameOffice) {
      fetchBusinessHours(newValue.id, (data) => {
        setReturnHours(data);

        const horario = parseBusinessHours(data);
        if (horario) {
          const validHours = generateTimeSlots(horario.start, horario.end);
          if (!validHours.includes(searchData.returnTime)) {
            setSearchData((prev) => ({
              ...prev,
              returnTime: validHours[0],
            }));
          }
        }
      });
    }
  };

  const handleSameOfficeChange = () => {
    const same = !searchData.sameOffice;

    const newSearchData = {
      ...searchData,
      sameOffice: same,
    };

    if (same) {
      // Al activar el check: copiar ubicación y horario
      newSearchData.returnLocation = searchData.pickupLocation;
      newSearchData.returnTime = searchData.pickupTime;

      if (searchData.pickupLocation?.id) {
        fetchBusinessHours(searchData.pickupLocation.id, setReturnHours);
      }
    } else {
      // Al desactivar: limpiar returnLocation (dejar que usuario la seleccione)
      newSearchData.returnLocation = null;
      newSearchData.returnTime = "";
      setReturnHours(null);
    }

    setSearchData(newSearchData);
  };

  const handlePickupDateChange = (newDate) => {
    const np = new Date(newDate);
    np.setHours(0, 0, 0, 0);
    let nr = new Date(searchData.returnDate);
    nr.setHours(0, 0, 0, 0);
    if (nr < np) {
      nr = new Date(np);
      nr.setDate(nr.getDate() + 1);
    }
    setSearchData({
      ...searchData,
      pickupDate: np,
      returnDate: nr,
      pickupTime: "08:00 AM",
      returnTime: "08:00 AM",
    });
  };
  const handleReturnDateChange = (newDate) => {
    const nr = new Date(newDate);
    nr.setHours(0, 0, 0, 0);
    let np = new Date(searchData.pickupDate);
    np.setHours(0, 0, 0, 0);
    if (nr < np) {
      np = new Date(nr);
      np.setDate(np.getDate() - 1);
    }
    setSearchData({ ...searchData, returnDate: nr, pickupDate: np });
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
          sx={{ color: "black", fontWeight: "bold", mb: 1 }}
        >
          Ubicación de origen
        </Typography>
      )}
      <Autocomplete
        options={locations}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        getOptionLabel={(option) => {
          if (!option || typeof option !== "object") return "";
          const ciudad = option.ciudad?.trim() || "";
          const nombre = option.nombre?.trim() || "";
          return `${ciudad}${ciudad && nombre ? " – " : ""}${nombre}`;
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <Box>
              <Typography>
                {option.ciudad} – {option.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.direccion}
              </Typography>
            </Box>
          </li>
        )}
        groupBy={(option) => option.ciudad}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              isRentalPage ? "Ubicación de origen" : "Selecciona ubicación"
            }
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": { pt: "8px", pb: "6px" },
              "& .MuiInputLabel-root": {
                fontSize: isRentalPage ? "1.1rem" : "0.9rem",
                backgroundColor: "#f5f5f5",
                pr: "4px",
                color: "black",
                top: isRentalPage ? -4 : -2,
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -6px) scale(0.9)",
              },
            }}
          />
        )}
        value={searchData.pickupLocation || null}
        onChange={handlePickupLocationChange}
        sx={{ width: "100%" }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={searchData.sameOffice}
            onChange={handleSameOfficeChange}
            sx={{
              color: "#d32f2f",
              "&.Mui-checked": { color: "#d32f2f" },
            }}
          />
        }
        label="Devolver en la misma oficina"
        sx={{
          color: "black",
          fontWeight: "bold",
          width: "100%",
          justifyContent: "start",
          mt: 1,
        }}
      />

      {!searchData.sameOffice && (
        <>
          {!isRentalPage && (
            <Typography
              variant="h6"
              sx={{ color: "black", fontWeight: "bold", mt: 2, mb: 1 }}
            >
              Ubicación de destino
            </Typography>
          )}
          <Autocomplete
            options={locations}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option) => {
              if (!option || typeof option !== "object") return "";
              const ciudad = option.ciudad?.trim() || "";
              const nombre = option.nombre?.trim() || "";
              return `${ciudad} – ${nombre}`;
            }}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography>
                    {option.ciudad} – {option.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.direccion}
                  </Typography>
                </Box>
              </li>
            )}
            groupBy={(option) => option.ciudad}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  isRentalPage ? "Ubicación de destino" : "Selecciona ubicación"
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": { pt: "8px", pb: "6px" },
                  "& .MuiInputLabel-root": {
                    fontSize: isRentalPage ? "1.1rem" : "0.9rem",
                    backgroundColor: "#f5f5f5",
                    pr: "4px",
                    color: "black",
                    top: isRentalPage ? -4 : -2,
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.9)",
                  },
                }}
              />
            )}
            value={searchData.returnLocation || null}
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
          mt: 2,
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
            businessHours={pickupHours}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DateTimeSelector
            label="Fecha y hora de devolución"
            date={searchData.returnDate}
            setDate={handleReturnDateChange}
            time={searchData.returnTime}
            setTime={handleReturnTimeChange}
            businessHours={returnHours}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ backgroundColor: "#d60812", width: "100%" }}
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
        p: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxSizing: "border-box",
        ...sx,
      }}
      id="containerBox"
    >
      {showCarImage ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {selectedCar && (
            <Box
              sx={{
                flex: 1,
                minWidth: "250px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={selectedCar.image}
                alt={selectedCar.name}
                sx={{
                  width: "100%",
                  maxHeight: "218px",
                  objectFit: "contain",
                  mb: 2,
                  borderRadius: 2,
                }}
              />
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
