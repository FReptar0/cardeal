import { useRef, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  formatDay,
  formatNumber,
  formatMonthYear,
  getTodayDate,
} from "../utils/dateFormatters";
import { generateTimeSlots } from "../utils/timeSlots";
import { parseBusinessHours } from "../utils/locations";
import hoursData from "../data/hours.json";

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
  // No se importa useRouter aquí, el componente es agnóstico

  // Memoized business hours parsing
  const horario = useMemo(() => {
    return parseBusinessHours(businessHours, date);
  }, [businessHours, date]);

  // Memoized date checks
  const isToday = useMemo(() => {
    return format(date, "yyyy-MM-dd") === getTodayDate();
  }, [date]);

  // Memoized weekday calculation
  const weekDay = useMemo(() => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }, [date]);

  // Memoized hours for day lookup
  const hoursForDay = useMemo(() => {
    return hoursData.find((h) => h.day === weekDay);
  }, [weekDay]);

  // Memoized time slots generation with filtering
  const timeSlots = useMemo(() => {
    let slots = hoursForDay
      ? generateTimeSlots(
          to24Hour(hoursForDay.open),
          to24Hour(hoursForDay.close),
          false
        )
      : [];

    // Filtrar horarios pasados y aplicar filtro de 2 horas si es hoy
    if (isToday && slots.length > 0) {
      const now = new Date();
      // Sumar 2 horas y redondear al siguiente múltiplo de 30 minutos
      let minHour = now.getHours() + 2;
      let minMinute = now.getMinutes();
      if (minMinute > 0 && minMinute <= 30) {
        minMinute = 30;
      } else if (minMinute > 30) {
        minHour += 1;
        minMinute = 0;
      }
      const minTime = `${String(minHour).padStart(2, "0")}:${
        minMinute === 0 ? "00" : "30"
      }`;
      // Filtrar los timeSlots que sean mayores o iguales al minTime
      slots = slots.filter((slot) => slot >= minTime);
    }
    
    return slots;
  }, [hoursForDay, isToday]);

  // Utilidad para convertir "08:00 AM" a "08:00" y "08:00 PM" a "20:00"
  function to24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM" && hours !== "12")
      hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  return (
    <Box 
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      role="group"
      aria-labelledby={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
    >
      <Typography 
        id={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}
        variant="h6" 
        sx={{ color: "black", fontWeight: "bold" }}
        component="h3"
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dateInputRef?.current?.showPicker();
              }
            }}
            aria-label={`Seleccionar fecha para ${label.toLowerCase()}`}
            tabIndex={0}
          />
          <TextField
            type="date"
            inputRef={dateInputRef}
            value={format(date, "yyyy-MM-dd")}
            onChange={useCallback((e) => {
              const [year, month, day] = e.target.value.split("-");
              const selectedDate = new Date(year, month - 1, day);
              setDate(selectedDate);
              if (onDateChange) {
                setTimeout(() => onDateChange(), 100);
              }
            }, [setDate, onDateChange])}
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
              'aria-label': `Fecha de ${label.toLowerCase()}`,
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
              onChange={useCallback((e) => {
                setTime(e.target.value);
                if (onTimeChange) {
                  setTimeout(() => onTimeChange(), 100);
                }
              }, [setTime, onTimeChange])}
              fullWidth
              variant="standard"
              disableUnderline
              displayEmpty
              sx={{ textAlign: "center", fontSize: "1.2rem", width: "auto" }}
              inputProps={{
                'aria-label': `Seleccionar hora para ${label.toLowerCase()}`,
              }}
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
                <MenuItem 
                  key={slot} 
                  value={slot}
                  role="option"
                  aria-selected={time === slot}
                >
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

// PropTypes validation
DateTimeSelector.propTypes = {
  label: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  setDate: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  setTime: PropTypes.func.isRequired,
  businessHours: PropTypes.object,
  loading: PropTypes.bool,
  dateInputRef: PropTypes.object,
  timeSelectRef: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onDateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
};

export default DateTimeSelector;
