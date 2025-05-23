// components/UserForm.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import differenceInYears from "date-fns/differenceInYears";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Switch,
} from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import useUserProfile from "@/hooks/useUserProfile";
import { locations } from "@/utils/locations";
import { RateReview } from "@mui/icons-material";

const registrarReservaEnTSD = async ({
  bookingId,
  contactName,
  selectedCar,
  selectedInsurance,
  selectedExtras,
  searchData,
}) => {
  try {
    const res = await fetch("/api/bookings/registerReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLocationId: searchData.pickupLocation?.id,
        returnLocationId: searchData.sameOffice
          ? searchData.pickupLocation?.id
          : searchData.returnLocation?.id,
        pickupDateTime: `${searchData.pickupDate} ${searchData.pickupTime}`,
        returnDateTime: `${searchData.returnDate} ${searchData.returnTime}`,
        classCode: selectedCar?.abbreviation,
        unitNumber: selectedCar?.unitNumber,
        renterFirst: contactName.split(" ")[0],
        renterLast: contactName.split(" ").slice(1).join(" "),
        extrasCodes: Object.values(selectedExtras)
          .filter((extra) => extra.cantidad > 0)
          .map((extra) => ({
            id: extra.id,
            cantidad: extra.cantidad,
          })),
        insuranceCode: selectedInsurance?.code || "",
        rateId: selectedCar?.rateId,
      }),
    });

    const tsdJson = await res.json();
    console.log("✅ Respuesta de TSD:", tsdJson);

    if (!res.ok) {
      throw new Error(tsdJson.message || "Error en la reserva con TSD");
    }

    return {
      success: true,
      confirmNum: tsdJson.PRE?.TRNXML?.ConfirmNum || null,
    };
  } catch (err) {
    console.error("❌ Error registrando en TSD:", err.message);
    return false;
  }
};

export default function UserForm({ paidOnline, setPaidOnline }) {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isJwtExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false;
    } catch {
      return true;
    }
  };
  const tokenIsInvalid = !jwt || isJwtExpired(jwt);

  // Schema de validación
  const schema = yup.object().shape({
    terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
    privacy: yup
      .boolean()
      .oneOf([true], "Debes aceptar la política de privacidad"),
    ...(tokenIsInvalid && {
      fullName: yup.string().required("El nombre completo es obligatorio"),
      phone: yup.string().required("El teléfono es obligatorio"),
      email: yup
        .string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      birthDate: yup
        .date()
        .required("La fecha de nacimiento es obligatoria")
        .test(
          "is-adult",
          "Debes tener al menos 18 años",
          (val) => val && differenceInYears(new Date(), new Date(val)) >= 18
        ),
      location: yup.string().required("La ubicación es obligatoria"),
      password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "Debe contener al menos 8 caracteres")
        .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
        .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .matches(/\d/, "Debe contener al menos un número"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Confirma la contraseña"),
    }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      birthDate: "",
      location: "",
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

  // Calcula el total exacto que se enviará a Flap
  const calculateTotal = (online) => {
    const start = new Date(searchData.pickupDate);
    const end = new Date(searchData.returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

    // Precio coche según método
    const dailyCar = online
      ? Number(selectedCar.price2 ?? selectedCar.price) // price2 = online rebajado
      : Number(selectedCar.price);
    let total = dailyCar * days - dailyCar * 0.1;

    // Seguro
    if (selectedInsurance?.total) {
      const clean = selectedInsurance.total.replace(/[^0-9.]/g, "");
      total += Number(clean) * days;
    }

    let totalOtherCharges = total;

    // Extras
    Object.values(selectedExtras).forEach(({ precio, cantidad }) => {
      total += Number(precio) * Number(cantidad) * days;
      totalOtherCharges += Number(precio) * Number(cantidad) * days;
    });

    const totalOtherChargesSum = totalOtherCharges * 0.23;

    console.log("Total other charges:", totalOtherChargesSum);

    total += totalOtherChargesSum;

    // Descuento
    total -= Number(discount) || 0;

    // IVA 16%
    total = total * 1.16;

    console.log("Total con IVA:", total);

    return total.toFixed(2);
  };

  useEffect(() => {
    if (paidOnline) {
      const amount = calculateTotal(true);
      console.log("💵 Monto estimado para pago en línea:", amount);
    }
  }, [paidOnline]);

  const onSubmit = (isOnline) => async (data) => {
    isOnline ? setSubmittingOnline(true) : setSubmitting(true);

    try {
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

        console.log("amount", amount);

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
            "La reserva fue registrada localmente, pero falló en TSD."
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
      // 5) Pago en mostrador → Confirmación
      clearBooking();
      clearSearch();
      router.push(`/confirm/${jB.bookingId}`);
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
        {tokenIsInvalid && (
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
                  />
                  {errors.phone && (
                    <Typography variant="caption" color="error">
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
            <TextField
              label="Ubicación"
              fullWidth
              margin="normal"
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((p) => !p)}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}

        {/* Pickup & return */}
        <TextField
          label="Lugar de retiro"
          value={pickupDisplay}
          fullWidth
          margin="normal"
          disabled
          InputProps={{
            sx: {
              color: "#212121",
              "& input.Mui-disabled": {
                WebkitTextFillColor: "#212121",
                color: "#212121",
              },
            },
          }}
          InputLabelProps={{
            style: {
              color: "#212121", // color del label
            },
          }}
        />

        <TextField
          label="Lugar de entrega"
          fullWidth
          margin="normal"
          value={returnDisplay}
          disabled
          InputProps={{
            sx: {
              color: "#212121",
              "& input.Mui-disabled": {
                WebkitTextFillColor: "#212121",
                color: "#212121",
              },
            },
          }}
          InputLabelProps={{
            style: {
              color: "#212121", // color del label
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              {...register("terms")}
              sx={{ color: "#191919", "&.Mui-checked": { color: "#191919" } }}
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
              sx={{ color: "#191919", "&.Mui-checked": { color: "#191919" } }}
            />
          }
          label={
            <Link href="/aviso-de-privacidad" underline="hover">
              Acepto la política de privacidad
            </Link>
          }
        />

        {/* Switch de pago en línea debajo de los checkboxes */}
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={paidOnline}
                onChange={(e) => setPaidOnline(e.target.checked)}
                sx={{
                  "& .Mui-checked": { color: "#10906a" },
                  "& .Mui-checked+ .MuiSwitch-track": {
                    backgroundColor: "#10906a",
                  },
                }}
              />
            }
            label="Quiero pagar en línea"
          />
          <Typography
            variant="caption"
            sx={{ mt: 1, color: paidOnline ? "#10906a" : "#6e7276" }}
          >
            {paidOnline
              ? "Estás eligiendo pagar ahora en línea."
              : "Puedes pagar al recoger el vehículo."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit(false))}
            disabled={
              submitting ||
              !watch("terms") ||
              !watch("privacy") ||
              paidOnline ||
              (!tokenIsInvalid && !isValid)
            }
          >
            {submitting ? "Procesando..." : "Pago en mostrador"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit(true))}
            disabled={
              submittingOnline ||
              !watch("terms") ||
              !watch("privacy") ||
              !paidOnline ||
              (tokenIsInvalid && !isValid)
            }
          >
            {submittingOnline ? "Redirigiendo…" : "Pago en línea"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
