"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Button,
  Checkbox,
} from "@mui/material";
import { generateTimeSlots } from "../utils/timeSlots";
import { parseBusinessHours } from "../utils/locations";
import { adjustReturnDate, validateAndAdjustDates } from "../utils/bookingLogic";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSearch } from "@/contexts/SearchContext";
import { useBooking } from "@/contexts/BookingContext";
import { useDebounce } from "use-debounce";
import { usePathname } from "next/navigation";
import { useAutoOpenSelectors } from "../hooks/useAutoOpenSelectors";
import { useBusinessHours } from "../hooks/useBusinessHours";
import { useLocations } from "../hooks/useLocations";
import { isRentalPage, showCarImageOnPage } from "../utils/routes";


// Importar el nuevo componente modularizado
import DateTimeSelector from "./DateTimeSelector";

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
  const isRental = isRentalPage(router.pathname);
  const showCarImage = showCarImageOnPage(router.pathname);

  // Hook para manejar horarios de sucursal
  const {
    pickupHours,
    setPickupHours,
    loadingPickupHours,
    setLoadingPickupHours,
    returnHours,
    setReturnHours,
    loadingReturnHours,
    setLoadingReturnHours,
    fetchBusinessHours,
  } = useBusinessHours();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const pathname = usePathname();
  const applyNegativeMargin =
    pathname === "/" || pathname.startsWith("/vehiculos");

  // (Eliminada función fetchBusinessHours, ahora se usa el hook)

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

  // Hook para manejar sucursales y selección automática
  const { locations, setLocations, loadingLocations, errorLocations } = useLocations(setSearchData);

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

  // Ajuste de fechas usando utilería
  const handlePickupDateChange = (newDate) => {
    const { pickupDate, returnDate } = adjustReturnDate(newDate, searchData.returnDate);
    setSearchData({
      ...searchData,
      pickupDate,
      returnDate,
    });
    setTimeout(() => setPickupTimeOpen(true), 100);
  };

  const handleReturnDateChange = (newDate) => {
    const { pickupDate, returnDate } = validateAndAdjustDates(searchData.pickupDate, newDate);
    setSearchData({
      ...searchData,
      pickupDate,
      returnDate,
    });
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

  // Hook para exponer funciones de apertura automática de selectores
  const { openPickupTime, openReturnDate, openReturnTime } = useAutoOpenSelectors({
    pickupTimeRef,
    returnDateRef,
    returnTimeRef,
  });

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const searchForm = (
    <>
      {!isRental && (
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
              isRental ? "Ubicación de origen" : "Selecciona ubicación"
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
          {!isRental && (
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
                  isRental ? "Ubicación de destino" : "Selecciona ubicación"
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
        gap: isRental ? 0.5 : 3,
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
