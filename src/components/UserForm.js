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
import { encryptId } from "@/utils/encryption";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Estado para el modo usuario registrado (por defecto es invitado)
  const [registeredMode, setRegisteredMode] = useState(false);

  const isJwtExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : false;
    } catch {
      return true;
    }
  };

  const tokenIsInvalid = !jwt || isJwtExpired(jwt);

  // Esquema de validación dinámico según modo invitado
  const schema = React.useMemo(() => {
    if (!registeredMode) {
      // Invitado por defecto
      return yup.object().shape({
        fullName: yup.string().required("El nombre completo es obligatorio"),
        phone: yup.string().required("El teléfono es obligatorio"),
        email: yup
          .string()
          .email("Correo inválido")
          .required("El correo es obligatorio"),
        confirmEmail: yup
          .string()
          .oneOf([yup.ref("email"), null], "Los correos no coinciden")
          .required("Confirma el correo electrónico"),
        birthDate: yup
          .date()
          .typeError("Por favor, ingresa una fecha válida en el formato correcto (YYYY-MM-DD)")
          .required("La fecha de nacimiento es obligatoria")
          .test(
            "is-adult",
            "Debes tener al menos 18 años para registrarte",
            (value) => {
              if (!value || Object.prototype.toString.call(value) !== '[object Date]' || isNaN(value.getTime())) {
                return false;
              }
              return differenceInYears(new Date(), new Date(value)) >= 18;
            }
          ),
        terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
        privacy: yup.boolean().oneOf([true], "Debes aceptar la política de privacidad"),
      });
    }
    // Usuario registrado o registro nuevo
    return yup.object().shape({
      terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
      privacy: yup.boolean().oneOf([true], "Debes aceptar la política de privacidad"),
      ...(tokenIsInvalid && {
        fullName: yup.string().required("El nombre completo es obligatorio"),
        phone: yup.string().required("El teléfono es obligatorio"),
        email: yup
          .string()
          .email("Correo inválido")
          .required("El correo es obligatorio"),
        birthDate: yup
          .date()
          .typeError("Por favor, ingresa una fecha válida en el formato correcto (YYYY-MM-DD)")
          .required("La fecha de nacimiento es obligatoria")
          .test(
            "is-adult",
            "Debes tener al menos 18 años para registrarte",
            (value) => {
              if (!value || Object.prototype.toString.call(value) !== '[object Date]' || isNaN(value.getTime())) {
                return false;
              }
              return differenceInYears(new Date(), new Date(value)) >= 18;
            }
          ),
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
    mode: "all", // Validación en tiempo real para todos los campos
    reValidateMode: "onChange", // Revalida en cada cambio
    criteriaMode: "all", // Muestra todos los errores posibles
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      confirmEmail: "",
      birthDate: "",
      // location: "",
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
      // Lógica para invitado (guestMode)
      if (guestMode) {
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
            "No se pudo registrar la reserva en TSD. Intenta de nuevo."
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
                      border: `1px solid ${errors.phone ? "#d32f2f" : "#c4c4c4"
                        }`,
                    }}
                    buttonStyle={{ border: "none", background: "transparent" }}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange(value)}
                  />
                  {errors.phone && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
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
            {/* Fecha de nacimiento siempre visible, contraseñas solo si es modo registrado */}
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
            {registeredMode && (
              <>
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
          </>
        )}
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
                  '&.Mui-checked': {
                    color: (theme) => theme.palette.primary.buttons || "#10906a",
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
              (!registeredMode
                ? !watch("fullName") || !watch("phone") || !watch("email") || !watch("birthDate") || !watch("terms") || !watch("privacy")
                : (tokenIsInvalid && !isValid) || !watch("terms") || !watch("privacy")
              )
            }
            sx={{
              backgroundColor: (theme) =>
                theme.palette.primary.buttons || "#b0b0b0",
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.primary.buttons || "#b0b0b0",
              },
              position: "relative",
              minHeight: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: 'Oxford, Arial, sans-serif',
            }}
          >
            <span style={{ width: "100%", textAlign: "center", fontWeight: 700 }}>
              {submitting
                ? "Procesando..."
                : "Pago en mostrador".charAt(0).toUpperCase() +
                "Pago en mostrador".slice(1).toLowerCase()}
            </span>
            <span style={{ width: "100%", textAlign: "center", marginTop: 4 }}>
              <Typography
                variant="caption"
                sx={{
                  color:
                    submitting ||
                      (!registeredMode
                        ? !watch("fullName") || !watch("phone") || !watch("email") || !watch("birthDate") || !watch("terms") || !watch("privacy")
                        : (tokenIsInvalid && !isValid)
                      )
                      ? "#b0b0b0"
                      : "#fff",
                  fontWeight: 700,
                  display: "block",
                }}
              >
                {`Total: $${calculateTotal(false)}`}
              </Typography>
            </span>
          </Button>

          {registeredMode && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleSubmit(onSubmit(true))}
              disabled={
                submittingOnline ||
                (tokenIsInvalid && !isValid) ||
                !watch("terms") ||
                !watch("privacy")
              }
              sx={{
                backgroundColor: (theme) =>
                  submittingOnline || (tokenIsInvalid && !isValid)
                    ? "rgba(16, 144, 106, 0.5)" // verde opaco
                    : theme.palette.primary.buttons || "#10906a",
                "&:hover": {
                  backgroundColor: (theme) =>
                    submittingOnline || (tokenIsInvalid && !isValid)
                      ? "rgba(16, 144, 106, 0.7)"
                      : theme.palette.primary.buttons || "#10906a",
                },
                position: "relative",
                minHeight: 64,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                fontFamily: 'Oxford, Arial, sans-serif',
              }}
            >
              <span style={{ width: "100%", textAlign: "center", fontWeight: 700 }}>
                {submittingOnline
                  ? "Redirigiendo…"
                  : "Pago en línea".charAt(0).toUpperCase() +
                  "Pago en línea".slice(1).toLowerCase()}
              </span>
              <span style={{ width: "100%", textAlign: "center", marginTop: 4 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      submittingOnline || (tokenIsInvalid && !isValid)
                        ? "#b0b0b0"
                        : "#fff",
                    fontWeight: 700,
                    display: "block",
                  }}
                >
                  {`Total: $${calculateTotal(true)}`}
                </Typography>
              </span>
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
