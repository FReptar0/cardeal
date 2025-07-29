// components/UserForm.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Card,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import useUserProfile from "@/hooks/useUserProfile";
import { validateJWT } from "@/utils/security";
import { createGuestSchema, createRegisteredSchema } from "@/utils/formValidationSchemas";
import { useBookingCalculations } from "@/hooks/useBookingCalculations";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import BookingFormFields from "@/components/forms/BookingFormFields";
import AuthenticationFlow from "@/components/forms/AuthenticationFlow";
import PaymentButtons from "@/components/forms/PaymentButtons";

export default function UserForm() {
  const { jwt } = useAuth();
  const { userData, loading: loadingProfile } = useUserProfile();
  const {
    selectedCar,
    selectedInsurance,
    selectedExtras,
    discount,
  } = useBooking();
  const { searchData } = useSearch();


  // Safe JWT validation with proper error handling
  const getTokenValidation = (token) => {
    if (!token) {
      return { isValid: false, isExpired: true };
    }

    const validation = validateJWT(token);
    return {
      isValid: validation.isValid,
      isExpired: validation.isExpired || false,
      payload: validation.payload
    };
  };

  const tokenValidation = getTokenValidation(jwt);
  const tokenIsInvalid = !tokenValidation.isValid;
  
  const [registeredMode, setRegisteredMode] = useState(!tokenIsInvalid);

  // Use centralized calculation hook
  const { getTotalsByPaymentMethod } = useBookingCalculations({
    selectedCar,
    selectedInsurance,
    selectedExtras,
    searchData,
    discount
  });

  // Use centralized payment flow hook
  const { submitting, submittingOnline, executePaymentFlow } = usePaymentFlow({
    selectedCar,
    selectedInsurance,
    selectedExtras,
    searchData,
    discount,
    calculateTotal: (isOnline) => getTotalsByPaymentMethod(isOnline).finalTotal.toFixed(2)
  });

  // Esquema de validación dinámico según modo invitado
  const schema = React.useMemo(() => {
    return !registeredMode 
      ? createGuestSchema() 
      : createRegisteredSchema(tokenIsInvalid);
  }, [registeredMode, tokenIsInvalid]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      confirmEmail: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
      terms: false,
      privacy: false,
    },
  });

  // Precarga perfil si ya hay token
  useEffect(() => {
    if (!tokenIsInvalid && !loadingProfile && userData) {
      reset({
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        birthDate: userData.birthDate?.slice(0, 10) ?? "",
        location: userData.location,
        terms: false,
        privacy: false,
      });
    }
  }, [tokenIsInvalid, loadingProfile, userData, reset]);

  // Helper function for calculating totals
  const calculateTotal = (isOnline) => {
    // Ensure we have valid car data with different prices
    if (!selectedCar || !selectedCar.price || !selectedCar.price2) {
      return '0.00';
    }
    
    const totals = getTotalsByPaymentMethod(isOnline);
    return totals.finalTotal.toFixed(2);
  };

  const onSubmit = (isOnline) => async (data) => {
    await executePaymentFlow(data, isOnline, registeredMode, tokenIsInvalid, userData);
  };

  if (!tokenIsInvalid && loadingProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Card sx={{ p: 3, width: "100%" }}>
      <ToastContainer position="top-center" autoClose={5000} />

      <Typography variant="h5" gutterBottom>
        {!tokenIsInvalid
          ? "Finaliza tu reserva"
          : "Completa tus datos para registrarte"}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box component="form">
        <BookingFormFields
          register={register}
          control={control}
          errors={errors}
          registeredMode={registeredMode}
          tokenIsInvalid={tokenIsInvalid}
        />
        
        <AuthenticationFlow
          register={register}
          errors={errors}
          registeredMode={registeredMode}
          tokenIsInvalid={tokenIsInvalid}
        />
        <FormControlLabel
          control={
            <Checkbox
              {...register("terms")}
              sx={{
                color: (theme) => theme.palette.primary.buttons || "#b0b0b0",
                "&.Mui-checked": {
                  color: (theme) => theme.palette.primary.buttons || "#b0b0b0",
                },
              }}
            />
          }
          label={
            <Link href="/terminos-y-condiciones" underline="hover">
              Acepto los términos y condiciones
            </Link>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              {...register("privacy")}
              sx={{
                color: (theme) => theme.palette.primary.buttons || "#b0b0b0",
                "&.Mui-checked": {
                  color: (theme) => theme.palette.primary.buttons || "#b0b0b0",
                },
              }}
            />
          }
          label={
            <Link href="/aviso-de-privacidad" underline="hover">
              Acepto la política de privacidad
            </Link>
          }
        />

        {/* Checkbox para "Crear cuenta y reservar como usuario registrado" - Solo mostrar si no hay sesión */}
        {tokenIsInvalid && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={registeredMode}
                  onChange={(_, checked) => setRegisteredMode(checked)}
                  sx={{
                    color: (theme) => theme.palette.primary.buttons || "#10906a",
                    "&.Mui-checked": {
                      color: (theme) =>
                        theme.palette.primary.buttons || "#10906a",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    ml: 1,
                    color: (theme) => theme.palette.primary.buttons || "#10906a",
                    fontWeight: 600,
                  }}
                >
                  Crear cuenta y paga en línea
                </Typography>
              }
            />
          </Box>
        )}

        <PaymentButtons
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          submitting={submitting}
          submittingOnline={submittingOnline}
          registeredMode={registeredMode}
          tokenIsInvalid={tokenIsInvalid}
          isValid={isValid}
          watch={watch}
          calculateTotal={calculateTotal}
        />
      </Box>
    </Card>
  );
}
