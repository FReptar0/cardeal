// components/UserForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import differenceInYears from "date-fns/differenceInYears";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Link,
  Card,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Switch,
} from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useSearch } from "@/contexts/SearchContext";
import useUserProfile from "@/hooks/useUserProfile";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sub } from "date-fns";

// Importa el componente que construye y envía el formulario a Flap
import CardPaymentForm from "@/components/CardPaymentForm";

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

  // Estado para controlar el modal de pago y los datos a enviar
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const isJwtExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  };
  const tokenIsInvalid = !jwt || isJwtExpired(jwt);

  const schema = yup.object().shape({
    terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
    privacy: yup.boolean().oneOf([true], "Debes aceptar la política de privacidad"),
    ...(tokenIsInvalid && {
      fullName: yup.string().required("El nombre completo es obligatorio"),
      phone: yup.string().required("El teléfono es obligatorio"),
      email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
      birthDate: yup
        .date()
        .required("La fecha de nacimiento es obligatoria")
        .test(
          "is-adult",
          "Debes tener al menos 18 años",
          (value) =>
            value && differenceInYears(new Date(), new Date(value)) >= 18
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

  useEffect(() => {
    if (!tokenIsInvalid && !loadingProfile && userData) {
      reset({
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        birthDate: userData.birthDate?.slice(0, 10) || "",
        location: userData.location,
        terms: false,
        privacy: false,
      });
    }
  }, [tokenIsInvalid, loadingProfile, userData, reset]);

  // --- Estado y fetch de sucursales desde API, igual que SearchBar ---
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetch("/api/locations")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    if (searchData.sameOffice) {
      setSearchData((prev) => ({
        ...prev,
        returnLocation: prev.pickupLocation,
      }));
    }
  }, [searchData.sameOffice, searchData.pickupLocation, setSearchData]);

  const onSubmit = (isOnline) => async (data) => {
    if (isOnline) setSubmittingOnline(true);
    else setSubmitting(true);

    try {
      let token = jwt;
      let justRegistered = false;

      // Registro e inicio de sesión si es necesario
      if (tokenIsInvalid) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            password: data.password,
            birthDate: data.birthDate,
            location: data.location,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.message);
          return;
        }
        toast.success("Usuario registrado");

        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const loginJson = await loginRes.json();
        if (!loginRes.ok) {
          toast.error("Error al iniciar sesión");
          return;
        }
        token = loginJson.token;
        await login(token);
        justRegistered = true;
      }

      const contactName = justRegistered ? data.fullName : userData.fullName;
      const contactEmail = justRegistered ? data.email : userData.email;
      const contactPhone = justRegistered ? data.phone : userData.phone;

      // Creación de la reserva en backend
      const bookingRes = await fetch("/api/bookings/create", {
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
      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok) {
        toast.error(bookingJson.message || "Error al crear la reserva");
        return;
      }

      if (isOnline) {
        // Prepara datos para el formulario Flap
        setPaymentData({
          mp_order: String(bookingJson.bookingId),
          mp_reference: bookingJson.reference || String(bookingJson.bookingId),
          mp_amount: bookingJson.totalAmount.toFixed(2),
          mp_concept: "3",
          mp_node: "20",
          mp_currency: "1",
        });
        setCardFormOpen(true);
      } else {
        clearBooking();
        clearSearch();
        router.push(`/confirm/${bookingJson.bookingId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
      setSubmittingOnline(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setSubmittingOnline(true);

      // Creación de la reserva en backend después del pago exitoso
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          selectedCar,
          selectedInsurance,
          selectedExtras,
          searchData,
          contactName: userData.fullName,
          contactEmail: userData.email,
          contactPhone: userData.phone,
          paid: true,
          paidOnline: true,
          discount,
        }),
      });

      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok) {
        toast.error(bookingJson.message || "Error al crear la reserva");
        return;
      }

      clearBooking();
      clearSearch();
      router.push(`/confirm/${bookingJson.bookingId}`);
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setSubmittingOnline(false);
    }
  };

  const handleOnlinePayment = () => {
    setCardFormOpen(true);
  };

  const handleCardFormSubmit = (cardData) => {
    // Simular proceso de pago exitoso
    setTimeout(() => {
      setCardFormOpen(false);
      handlePaymentSuccess(cardData);
    }, 1000); // Simulación de tiempo de procesamiento
  };

  // Cierra el modal de pago (la forma se envía sola)
  const handleCardClose = () => {
    setCardFormOpen(false);
  };

  if (!tokenIsInvalid && loadingProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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
                      country={"mx"}
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
                      buttonStyle={{ border: "none", backgroundColor: "transparent" }}
                      containerStyle={{ width: "100%" }}
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
                      <IconButton onClick={() => setShowConfirmPassword((p) => !p)}>
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

          <Autocomplete
            options={locations}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(opt) => {
              if (!opt || typeof opt !== "object") return typeof opt === "string" ? opt : "";
              const ciudad = opt.ciudad?.trim() || opt.city?.trim() || "";
              const nombre = opt.nombre?.trim() || opt.name?.trim() || "";
              return `${ciudad}${ciudad && nombre ? " – " : ""}${nombre}`;
            }}
            value={
              // Si es string plano, mostrarlo como opción seleccionada
              typeof searchData.pickupLocation === "string"
                ? { id: "custom", ciudad: "", nombre: searchData.pickupLocation }
                : locations.find((loc) => loc.id === searchData.pickupLocation?.id) || null
            }
            onChange={(_, v) => v && setSearchData({ ...searchData, pickupLocation: v })}
            renderInput={(params) => (
              <TextField {...params} label="Lugar de retiro" margin="normal" fullWidth />
            )}
          />
          <Autocomplete
            options={locations}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              if (typeof value === "string") {
                const ciudad = option.ciudad?.trim() || option.city?.trim() || "";
                const nombre = option.nombre?.trim() || option.name?.trim() || "";
                return `${ciudad}${ciudad && nombre ? " – " : ""}${nombre}` === value;
              }
              return option.id === value.id;
            }}
            getOptionLabel={(opt) => {
              if (!opt || typeof opt !== "object") return typeof opt === "string" ? opt : "";
              const ciudad = opt.ciudad?.trim() || opt.city?.trim() || "";
              const nombre = opt.nombre?.trim() || opt.name?.trim() || "";
              return `${ciudad}${ciudad && nombre ? " – " : ""}${nombre}`;
            }}
            value={
              typeof searchData.returnLocation === "string"
                ? searchData.returnLocation
                : locations.find((loc) => loc.id === searchData.returnLocation?.id) || null
            }
            onChange={(_, v) => setSearchData({ ...searchData, returnLocation: v })}
            renderInput={(params) => (
              <TextField {...params} label="Lugar de entrega" margin="normal" fullWidth />
            )}
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

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={paidOnline}
                  onChange={(e) => setPaidOnline(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#10906a" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#10906a",
                    },
                  }}
                />
              }
              label="Quiero pagar en línea"
            />
          </Box>
          {paidOnline ? (
            <Typography variant="caption" sx={{ mt: 1, color: "#10906a" }}>
              Estás eligiendo pagar ahora en línea.
            </Typography>
          ) : (
            <Typography variant="caption" sx={{ mt: 1, color: "#6e7276" }}>
              Puedes pagar al recoger el vehículo.
            </Typography>
          )}

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
              onClick={handleOnlinePayment}
              disabled={
                submittingOnline ||
                !watch("terms") ||
                !watch("privacy") ||
                !paidOnline ||
                (tokenIsInvalid && !isValid)
              }
            >
              {submittingOnline ? "Procesando..." : "Pago en línea"}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Modal que construye y envía el form a Flap */}
      <CardPaymentForm
        open={cardFormOpen}
        onClose={handleCardClose}
        onPay={handleCardFormSubmit}
        data={paymentData}
      />
    </>
  );
}
