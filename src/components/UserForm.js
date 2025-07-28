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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import useUserProfile from "@/hooks/useUserProfile";
import { encryptId } from "@/utils/encryption";
import { validateJWT } from "@/utils/security";
import { createGuestSchema, createRegisteredSchema } from "@/utils/formValidationSchemas";
import { registrarReservaEnTSD } from "@/utils/tsdIntegration";
import BookingFormFields from "@/components/forms/BookingFormFields";
import AuthenticationFlow from "@/components/forms/AuthenticationFlow";
import PaymentButtons from "@/components/forms/PaymentButtons";

export default function UserForm() {
  const router = useRouter();
  const { jwt, login } = useAuth();
  const { userData, loading: loadingProfile } = useUserProfile();
  const {
    selectedCar,
    selectedInsurance,
    selectedExtras,
    discount,
    clearBooking,
  } = useBooking();
  const { searchData, setSearchData, clearSearch } = useSearch();

  const [submitting, setSubmitting] = useState(false);
  const [submittingOnline, setSubmittingOnline] = useState(false);
  const [registeredMode, setRegisteredMode] = useState(false);

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

  // Calcula el total exacto que se enviará a Flap, igual que en checkout.js
  const calculateTotal = (online) => {
    const start = new Date(searchData.pickupDate);
    const end = new Date(searchData.returnDate);
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

    // Precios diarios
    // OJO: price2 es en línea, price es mostrador
    const dailyCarCost = online
      ? Number(selectedCar?.price || 0) // en línea usa price
      : Number(selectedCar?.price2 || 0); // mostrador usa price2
    const totalCarCost = dailyCarCost * rentalDays;

    // Seguro
    const parseInsuranceCost = (s) => {
      const n = s ? s.replace(/[^\d.]/g, "") : "0";
      return parseFloat(n) || 0;
    };
    const dailyInsuranceCost = selectedInsurance
      ? parseInsuranceCost(selectedInsurance.total)
      : 0;
    const totalInsuranceCost = dailyInsuranceCost * rentalDays;

    // Extras
    let totalExtrasCost = 0;
    for (const key in selectedExtras) {
      const extra = selectedExtras[key];
      if (extra.cantidad > 0) {
        const lineCost = extra.precio * extra.cantidad * rentalDays;
        totalExtrasCost += lineCost;
      }
    }

    // Otros cargos
    const otherCharges =
      (totalCarCost + totalExtrasCost + totalInsuranceCost) * 0.23;

    // Subtotal
    const subTotal =
      totalCarCost + totalInsuranceCost + totalExtrasCost + otherCharges;

    // IVA
    const ivaCost = subTotal * 0.16;

    // Total
    let totalWithIva = subTotal + ivaCost;

    // Descuento
    totalWithIva -= Number(discount) || 0;

    return totalWithIva.toFixed(2);
  };

  const onSubmit = (isOnline) => async (data) => {
    isOnline ? setSubmittingOnline(true) : setSubmitting(true);

    try {
      // Lógica para invitado (modo por defecto)
      if (!registeredMode) {
        // 1) Datos de contacto directo del formulario
        const contactName = data.fullName;
        const contactEmail = data.email;
        const contactPhone = data.phone;

        // Primero registrar en TSD para obtener confirmNum
        const tsdResponse = await registrarReservaEnTSD({
          bookingId: null, // No hay bookingId local aún
          contactName,
          selectedCar,
          selectedInsurance,
          selectedExtras,
          searchData,
        });

        if (!tsdResponse.success || !tsdResponse.confirmNum) {
          toast.error(
            tsdResponse.error || "No se pudo registrar la reserva en TSD. Intenta de nuevo."
          );
          setSubmitting(false);
          setSubmittingOnline(false);
          return;
        }

        // 2) Crear reserva como invitado, incluyendo confirmNum
        const resB = await fetch("/api/bookings/createGuest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedCar,
            selectedInsurance,
            selectedExtras,
            searchData,
            contactName,
            contactEmail,
            contactPhone,
            paid: false,
            paidOnline: isOnline,
            discount,
            tsdConfirmNum: tsdResponse.confirmNum,
          }),
        });
        const jB = await resB.json();
        if (!resB.ok) {
          toast.error(jB.message || "Error al crear la pre-reserva");
          return;
        }

        const encryptedId = encryptId(jB.bookingId);
        router.push(`/confirm/${encryptedId}`);
        return;
      }

      // Lógica normal (usuario registrado o registro nuevo)
      // 1) Registro / login si falta
      let token = jwt;
      let justRegistered = false;
      if (tokenIsInvalid) {
        const r1 = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j1 = await r1.json();
        if (!r1.ok) {
          toast.error(j1.message);
          return;
        }
        toast.success("Usuario registrado");

        const r2 = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const j2 = await r2.json();
        if (!r2.ok) {
          toast.error("Error al iniciar sesión");
          return;
        }
        token = j2.token;
        await login(token);
        justRegistered = true;
      }

      // 2) Datos de contacto
      const contactName = justRegistered ? data.fullName : userData.fullName;
      const contactEmail = justRegistered ? data.email : userData.email;
      const contactPhone = justRegistered ? data.phone : userData.phone;

      // 3) Pre-reserva PENDING
      const resB = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedCar,
          selectedInsurance,
          selectedExtras,
          searchData,
          contactName,
          contactEmail,
          contactPhone,
          paid: false,
          paidOnline: isOnline,
          discount,
        }),
      });
      const jB = await resB.json();
      if (!resB.ok) {
        toast.error(jB.message || "Error al crear la pre-reserva");
        return;
      }

      // 4) Pago en línea → Flap
      if (isOnline) {
        const order = String(jB.bookingId);
        const reference = `${order}-${Date.now()}`;
        const amount = calculateTotal(true);
        const resP = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order,
            reference,
            amount,
            node: process.env.NEXT_PUBLIC_MP_NODE,
            concept: process.env.NEXT_PUBLIC_MP_CONCEPT,
          }),
        });

        if (!resP.ok) {
          const err = await resP.json();
          // borrar pre-reserva si falla
          await fetch(`/api/bookings/${jB.bookingId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          toast.error(`Error iniciando pago: ${err.message}`);
          setSubmittingOnline(false);
          return;
        }

        const { action, fields } = await resP.json();
        // Generar form y auto-submit en nueva pestaña
        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
        form.target = "_top";
        Object.entries(fields).forEach(([k, v]) => {
          const inp = document.createElement("input");
          inp.type = "hidden";
          inp.name = k;
          inp.value = v;
          form.appendChild(inp);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Registro en TSD si es pago en mostrador
      if (!isOnline) {
        const tsdResponse = await registrarReservaEnTSD({
          bookingId: jB.bookingId,
          contactName,
          selectedCar,
          selectedInsurance,
          selectedExtras,
          searchData,
        });

        if (!tsdResponse.success) {
          toast.error(
            tsdResponse.error || "La reserva fue registrada localmente, pero falló en TSD."
          );
          return;
        }

        if (tsdResponse.confirmNum) {
          await fetch(`/api/bookings/${jB.bookingId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ confirmNum: tsdResponse.confirmNum }),
          });
        }
      }
      const encryptedId = encryptId(jB.bookingId);
      router.push(`/confirm/${encryptedId}`);
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
      setSubmittingOnline(false);
    }
  };

  if (!tokenIsInvalid && loadingProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const pickupDisplay = searchData.pickupLocation
    ? `${searchData.pickupLocation.ciudad} - ${searchData.pickupLocation.estado}`
    : "";

  const returnDisplay = searchData.sameOffice
    ? pickupDisplay
    : searchData.returnLocation
    ? `${searchData.returnLocation.ciudad} - ${searchData.returnLocation.estado}`
    : "";

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

        {/* Checkbox para "Crear cuenta y reservar como usuario registrado" */}
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
