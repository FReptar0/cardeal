import React from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const BookingFormFields = ({ 
  register, 
  control, 
  errors, 
  registeredMode, 
  tokenIsInvalid 
}) => {
  if (!tokenIsInvalid) return null;

  return (
    <>
      <TextField
        label="Nombre completo"
        fullWidth
        margin="normal"
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />
      
      <Controller
        name="phone"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Box sx={{ width: "100%", mt: 1 }}>
            <PhoneInput
              {...field}
              country="mx"
              enableSearch
              inputStyle={{
                width: "100%",
                height: "56px",
                fontSize: "16px",
                paddingLeft: "48px",
                borderRadius: "4px",
                border: `1px solid ${
                  errors.phone ? "#d32f2f" : "#c4c4c4"
                }`,
              }}
              buttonStyle={{ border: "none", background: "transparent" }}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
            />
            {errors.phone && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5 }}
              >
                {errors.phone.message}
              </Typography>
            )}
          </Box>
        )}
      />
      
      <TextField
        label="Correo electrónico"
        type="email"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      {!registeredMode && (
        <TextField
          label="Confirmar correo electrónico"
          type="email"
          fullWidth
          margin="normal"
          {...register("confirmEmail")}
          error={!!errors.confirmEmail}
          helperText={errors.confirmEmail?.message}
        />
      )}
      
      <TextField
        label="Fecha de nacimiento"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        {...register("birthDate")}
        error={!!errors.birthDate}
        helperText={errors.birthDate?.message}
      />
    </>
  );
};

export default BookingFormFields;