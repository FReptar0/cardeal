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
  CircularProgress,
} from "@mui/material";
import { es } from "date-fns/locale";
import format from "date-fns/format";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSearch } from "@/contexts/SearchContext";
import { useBooking } from "@/contexts/BookingContext";
import { useDebounce } from "use-debounce";
import { usePathname } from "next/navigation";

function generateTimeSlots(startTime, endTime, forToday = false) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const now = new Date();
  const limit = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  const slots = [];
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current <= end) {
    if (!forToday || current > limit) {
      const h = current.getHours();
      const m = current.getMinutes();
      const suffix = h < 12 ? "AM" : "PM";
      const formatted = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")} ${suffix}`;

      slots.push(formatted);
    }
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
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
  loading,
  dateInputRef,
  timeSelectRef,
  open,
  setOpen,
  onDateChange,
  onTimeChange,
}) {
  const datePickerRef = useRef(null);
  const router = useRouter();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";

  const horario = parseBusinessHours(businessHours);
  const isToday = format(date, "yyyy-MM-dd") === getTodayDate();
  const timeSlots = horario
    ? generateTimeSlots(horario.start, horario.end, isToday)
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
            onClick={() => dateInputRef?.current?.showPicker()}
          />
          <TextField
            type="date"
            inputRef={dateInputRef}
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-");
              const selectedDate = new Date(year, month - 1, day);
              setDate(selectedDate);
              // Ejecutar callback después del cambio
              if (onDateChange) {
                setTimeout(() => onDateChange(), 100);
              }
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
            inputProps={{
              min: getTodayDate(),
              max: format(
                new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                "yyyy-MM-dd"
              ),
            }}
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
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#9e9e9e" }} />
          ) : timeSlots.length === 0 ? (
            <Typography variant="body2" color="black">
              Favor de revisar nuestros horarios de oficina.
            </Typography>
          ) : (
            <Select
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              inputRef={timeSelectRef}
              value={timeSlots.includes(time) ? time : ""}
              onChange={(e) => {
                setTime(e.target.value);
                // Ejecutar callback después del cambio
                if (onTimeChange) {
                  setTimeout(() => onTimeChange(), 100);
                }
              }}
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

export default function SearchBar({ sx = {}, onSearch }) {
  // Definir los refs necesarios para el flujo secuencial automático ANTES de usarlos en el JSX
  const pickupDateRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const returnDateRef = useRef(null);
  const returnTimeRef = useRef(null);

  // --- NUEVO: estados para controlar la apertura de los Select de hora ---
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [returnTimeOpen, setReturnTimeOpen] = useState(false);

  const router = useRouter();
  const { searchData, setSearchData } = useSearch(); // Contexto global
  const [debouncedSearchData] = useDebounce(searchData, 200);
  const { selectedCar } = useBooking();
  const isRentalPage =
    router.pathname === "/rental" ||
    router.pathname === "/proteccion" ||
    router.pathname === "/extras-renta";
  const showCarImage =
    router.pathname === "/extras-renta" || router.pathname === "/proteccion";
  const [pickupHours, setPickupHours] = useState(null);
  const [returnHours, setReturnHours] = useState(null);

  const [loadingPickupHours, setLoadingPickupHours] = useState(false);
  const [loadingReturnHours, setLoadingReturnHours] = useState(false);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const pathname = usePathname();
  const applyNegativeMargin =
    pathname === "/" || pathname.startsWith("/vehiculos");

  const fetchBusinessHours = async (locationId, setHoursFn, setLoadingFn) => {
    try {
      setLoadingFn?.(true);
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
    } finally {
      setLoadingFn?.(false);
    }
  };

  useEffect(() => {
    const {
      pickupLocation,
      returnLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    } = debouncedSearchData;

    const valid =
      pickupLocation?.id &&
      returnLocation?.id &&
      pickupDate &&
      pickupTime &&
      returnDate &&
      returnTime;

    const filters = {
      pickupLocation,
      returnLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      sameOffice: debouncedSearchData.sameOffice,
    };

    // 🧼 Nuevo: si los filtros se volvieron inválidos, limpia autos
    if (!valid) {
      onSearch?.(null); // Esto hará que RentalPage borre los autos
      return;
    }

    if (router.pathname === "/rental") {
      onSearch?.(filters);
    } else if (
      shouldRedirect &&
      !["/", "/vehiculos"].includes(router.pathname)
    ) {
      router.push("/rental");
      setShouldRedirect(false);
    }
  }, [
    debouncedSearchData.pickupLocation,
    debouncedSearchData.returnLocation,
    debouncedSearchData.pickupDate,
    debouncedSearchData.pickupTime,
    debouncedSearchData.returnDate,
    debouncedSearchData.returnTime,
    debouncedSearchData.sameOffice,
    shouldRedirect,
  ]);

  // ——— NUEVO: estado y fetch de sucursales desde API ———
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/api/locations")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setLocations(data);
        // Seleccionar la tercera opción automáticamente y deshabilitar el Autocomplete
        if (data && data.length >= 3) {
          setSearchData((prev) => ({
            ...prev,
            pickupLocation: data[2],
          }));
        }
      })
      .catch((err) => console.error("Error al cargar sucursales:", err));
  }, []);

  // useEffect para cargar horarios cuando pickupLocation cambie
  useEffect(() => {
    if (searchData.pickupLocation?.id) {
      fetchBusinessHours(
        searchData.pickupLocation.id,
        setPickupHours,
        setLoadingPickupHours
      );

      // y también carga return (ya sea misma oficina o distinta)
      const returnId = searchData.sameOffice
        ? searchData.pickupLocation.id
        : searchData.returnLocation?.id;
      if (returnId) {
        fetchBusinessHours(returnId, setReturnHours, setLoadingReturnHours);
      }
    }
  }, [
    searchData.pickupLocation,
    searchData.sameOffice,
    searchData.returnLocation,
  ]);

  // Handlers sin tocar
  const handlePickupLocationChange = (e, newValue) => {
    setSearchData({ ...searchData, pickupLocation: newValue });
    setShouldRedirect(true);
    if (newValue?.id) {
      fetchBusinessHours(
        newValue.id,
        (data) => {
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
        },
        setLoadingPickupHours
      );

      if (searchData.sameOffice) {
        fetchBusinessHours(
          newValue.id,
          (data) => {
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
          },
          setLoadingReturnHours
        );
      }
    }
  };
  const handleReturnLocationChange = (e, newValue) => {
    setShouldRedirect(true);
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
      fetchBusinessHours(
        newValue.id,
        (data) => {
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
        },
        setLoadingReturnHours
      );
    }
  };

  const handleSameOfficeChange = () => {
    setShouldRedirect(true);
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
        fetchBusinessHours(
          searchData.pickupLocation.id,
          setReturnHours,
          setLoadingReturnHours
        );
      }
    } else {
      newSearchData.returnLocation = null;
      newSearchData.returnTime = "";
      setReturnHours(null);
    }

    setSearchData(newSearchData);
  };

  useEffect(() => {
    const pickupId = searchData.pickupLocation?.id;
    const returnId = searchData.returnLocation?.id;

    if (
      pickupId &&
      returnId &&
      pickupId === returnId &&
      !searchData.sameOffice
    ) {
      setSearchData((prev) => ({
        ...prev,
        sameOffice: true,
      }));
    }
  }, [
    searchData.pickupLocation?.id,
    searchData.returnLocation?.id,
    searchData.sameOffice,
  ]);

  // --- Cambios para abrir automáticamente el selector de hora tras seleccionar fecha ---
  // Usar estado controlado para abrir los Select de hora
  // 1. Abre el selector de hora de recepción justo después de cambiar la fecha de recepción
  const handlePickupDateChange = (newDate) => {
    const newPickup = new Date(newDate);
    newPickup.setHours(0, 0, 0, 0);

    let newReturn = new Date(searchData.returnDate);
    newReturn.setHours(0, 0, 0, 0);

    if (newReturn <= newPickup) {
      newReturn = new Date(newPickup);
      newReturn.setDate(newReturn.getDate() + 1);
    }

    setSearchData({
      ...searchData,
      pickupDate: newPickup,
      returnDate: newReturn,
    });

    // Abre el selector de hora de recepción
    setTimeout(() => setPickupTimeOpen(true), 100);
  };

  // 2. Abre el selector de hora de devolución justo después de cambiar la fecha de devolución
  const handleReturnDateChange = (newDate) => {
    const newReturnDate = new Date(newDate);
    newReturnDate.setHours(0, 0, 0, 0);

    const currentPickupDate = new Date(searchData.pickupDate);
    currentPickupDate.setHours(0, 0, 0, 0);

    const today = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Mexico_City",
      })
    );
    today.setHours(0, 0, 0, 0);

    if (newReturnDate.getTime() === currentPickupDate.getTime()) {
      const adjustedReturn = new Date(newReturnDate);
      adjustedReturn.setDate(adjustedReturn.getDate() + 1);
      setSearchData({
        ...searchData,
        returnDate: adjustedReturn,
      });
      setTimeout(() => setReturnTimeOpen(true), 100);
      return;
    }
    if (newReturnDate.getTime() < currentPickupDate.getTime()) {
      const adjustedPickup = new Date(newReturnDate);
      adjustedPickup.setDate(adjustedPickup.getDate() - 1);
      if (adjustedPickup < today) {
        const adjustedReturn = new Date(currentPickupDate);
        adjustedReturn.setDate(adjustedReturn.getDate() + 1);
        setSearchData({
          ...searchData,
          returnDate: adjustedReturn,
        });
        setTimeout(() => setReturnTimeOpen(true), 100);
      } else {
        setSearchData({
          ...searchData,
          pickupDate: adjustedPickup,
          returnDate: newReturnDate,
        });
        setTimeout(() => setReturnTimeOpen(true), 100);
      }
      return;
    }
    setSearchData({ ...searchData, returnDate: newReturnDate });
    setTimeout(() => setReturnTimeOpen(true), 100);
  };

  const handlePickupTimeChange = (newTime) => {
    setSearchData({ ...searchData, pickupTime: newTime });
    setPickupTimeOpen(false); // Cierra el menú después de seleccionar
  };

  const handleReturnTimeChange = (newTime) => {
    setSearchData({ ...searchData, returnTime: newTime });
    setReturnTimeOpen(false); // Cierra el menú después de seleccionar
  };

  // Funciones para el flujo secuencial automático
  const openPickupTime = () => {
    if (pickupTimeRef.current) {
      pickupTimeRef.current.focus();
      // Abrir el dropdown del Select automáticamente
      setTimeout(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        pickupTimeRef.current.dispatchEvent(event);
      }, 150);
    }
  };

  const openReturnDate = () => {
    if (returnDateRef.current) {
      returnDateRef.current.showPicker();
    }
  };

  const openReturnTime = () => {
    if (returnTimeRef.current) {
      returnTimeRef.current.focus();
      // Abrir el dropdown del Select automáticamente
      setTimeout(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        returnTimeRef.current.dispatchEvent(event);
      }, 150);
    }
  };

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

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
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Box>
                <Typography>
                  {option.ciudad} – {option.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.direccion}
                </Typography>
              </Box>
            </li>
          );
        }}
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
        disabled // Deshabilita el Autocomplete para que no se pueda cambiar
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={true} // Siempre activo
            onChange={() => {}} // No hace nada
            disabled // No se puede desactivar
            sx={{
              color: (theme) => theme.palette.primary.buttons,
              "&.Mui-checked": {
                color: (theme) => theme.palette.primary.buttons,
              },
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
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <li key={key} {...rest}>
                  <Box>
                    <Typography>
                      {option.ciudad} – {option.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.direccion}
                    </Typography>
                  </Box>
                </li>
              );
            }}
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
            loading={loadingPickupHours}
            dateInputRef={pickupDateRef}
            timeSelectRef={pickupTimeRef}
            open={pickupTimeOpen}
            setOpen={setPickupTimeOpen}
            onDateChange={null}
            onTimeChange={openReturnDate}
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
            loading={loadingReturnHours}
            dateInputRef={returnDateRef}
            timeSelectRef={returnTimeRef}
            open={returnTimeOpen}
            setOpen={setReturnTimeOpen}
            onDateChange={null}
            onTimeChange={null}
          />
        </Box>
      </Box>
      <Typography
        sx={{
          color: "black",
          fontSize: "0.8rem",
          mt: applyNegativeMargin ? -2 : 0,
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        La reserva debe ser realizada con al menos 2 horas de anticipación.
      </Typography>

      {["/", "/vehiculos"].includes(router.pathname) && (
        <Button
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: (theme) => theme.palette.primary.buttons,
          }}
          onClick={() => {
            const filters = {
              pickupLocation: searchData.pickupLocation,
              returnLocation: searchData.returnLocation,
              pickupDate: searchData.pickupDate,
              pickupTime: searchData.pickupTime,
              returnDate: searchData.returnDate,
              returnTime: searchData.returnTime,
              sameOffice: searchData.sameOffice,
            };

            setSearchData(filters);
            onSearch?.(filters);
            router.push("/rental");
          }}
        >
          Buscar
        </Button>
      )}
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
