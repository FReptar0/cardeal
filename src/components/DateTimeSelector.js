import { useRef } from "react";
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

export default function DateTimeSelector({
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

  // Usar la fecha seleccionada para obtener el horario correcto del día
  const horario = parseBusinessHours(businessHours, date);
  const isToday = format(date, "yyyy-MM-dd") === getTodayDate();
  // Obtener el día de la semana en inglés para buscar en hours.json
  const weekDay = date.toLocaleDateString("en-US", { weekday: "long" });
  const hoursForDay = hoursData.find((h) => h.day === weekDay);
  const timeSlots = hoursForDay
    ? generateTimeSlots(
        to24Hour(hoursForDay.open),
        to24Hour(hoursForDay.close),
        false
      )
    : [];

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
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
