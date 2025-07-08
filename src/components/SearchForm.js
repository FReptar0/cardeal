import React from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Button,
  Checkbox,
} from "@mui/material";
import DateTimeSelector from "./DateTimeSelector";

export default function SearchForm({
  isRental,
  isRentalPage,
  locations,
  searchData,
  handlePickupLocationChange,
  handleReturnLocationChange,
  // pickupHours,
  // loadingPickupHours,
  // returnHours,
  // loadingReturnHours,
  pickupDateRef,
  pickupTimeRef,
  returnDateRef,
  returnTimeRef,
  pickupTimeOpen,
  setPickupTimeOpen,
  returnTimeOpen,
  setReturnTimeOpen,
  handlePickupDateChange,
  handleReturnDateChange,
  handlePickupTimeChange,
  handleReturnTimeChange,
  openReturnDate,
  applyNegativeMargin,
  router,
  setSearchData,
  onSearch,
}) {
  return (
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
            label={isRental ? "Ubicación de origen" : "Selecciona ubicación"}
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
        disabled
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={true}
            onChange={() => {}}
            disabled
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
            // businessHours={pickupHours}
            // loading={loadingPickupHours}
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
            // businessHours={returnHours}
            // loading={loadingReturnHours}
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

      {/* {["/", "/vehiculos"].includes(router.pathname) && (
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
      )} */}
    </>
  );
}
