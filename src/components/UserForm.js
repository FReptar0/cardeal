// /components/UserForm.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { locations } from "@/utils/locations";

export default function UserForm() {
  const router = useRouter();
  const { jwt, isLoggedIn, login } = useAuth();
  const { userData, loading: loadingProfile } = useUserProfile();
  const { selectedCar, selectedInsurance, selectedExtras } = useBooking();
  const { searchData, setSearchData } = useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Validaciones dinámicas
  const schema = yup.object().shape({
    terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
    privacy: yup
      .boolean()
      .oneOf([true], "Debes aceptar la política de privacidad"),
    ...(!isLoggedIn && {
      fullName: yup.string().required("El nombre completo es obligatorio"),
      phone: yup
        .string()
        .matches(
          /^\d{10}$/,
          "El teléfono debe tener exactamente 10 dígitos, no se permiten letras ni espacios"
        )
        .required("El teléfono es obligatorio"),
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
          (value) =>
            value && differenceInYears(new Date(), new Date(value)) >= 18
        ),
      location: yup.string().required("La ubicación es obligatoria"),
      password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
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

  // Prefill form with profile data when logged in
  useEffect(() => {
    if (isLoggedIn && !loadingProfile && userData) {
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
  }, [isLoggedIn, loadingProfile, userData, reset]);

  // Se eliminó el redireccionamiento si no está iniciada la sesión en la pantalla de checkout
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      let token = jwt;
      let justRegistered = false;
      // registro automático si no está logueado
      if (!isLoggedIn) {
        // Registra al usario si no esta logueado
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
        if (!res.ok) return toast.error(json.message);
        toast.success("Usuario registrado");
        // login automático
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const loginJson = await loginRes.json();
        if (!loginRes.ok) return toast.error("Error al iniciar sesión");
        token = loginJson.token;
        await login(token);
        justRegistered = true;
      }

      // datos de contacto
      const contactName = justRegistered ? data.fullName : userData.fullName;
      const contactEmail = justRegistered ? data.email : userData.email;
      const contactPhone = justRegistered ? data.phone : userData.phone;
      // crear reserva
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
        }),
      });
      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok) {
        return toast.error(bookingJson.message || "Error al crear la reserva");
      }
      router.push(`/confirm/${bookingJson.bookingId}`);
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  // mostrar loader si perfil aún no cargó
  if (isLoggedIn && loadingProfile) {
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
        {isLoggedIn
          ? "Finaliza tu reserva"
          : "Completa tus datos para registrarte"}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {!isLoggedIn && (
          <>
            <TextField
              label="Nombre completo"
              fullWidth
              margin="normal"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <TextField
              label="Teléfono"
              fullWidth
              margin="normal"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
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
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                     {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 20 }}/> : <VisibilityOutlined sx={{ fontSize: 20 }}/>}
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
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffOutlined sx={{ fontSize: 20 }}/> : <VisibilityOutlined sx={{ fontSize: 20 }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}

        <Autocomplete
          options={locations}
          getOptionLabel={(opt) => `${opt.city} - ${opt.name}`}
          groupBy={(opt) => opt.city}
          value={searchData.pickupLocation}
          onChange={(_, v) =>
            v && setSearchData({ ...searchData, pickupLocation: v })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lugar de retiro"
              margin="normal"
              fullWidth
            />
          )}
        />
        <Autocomplete
          options={locations}
          getOptionLabel={(opt) => `${opt.city} - ${opt.name}`}
          groupBy={(opt) => opt.city}
          value={searchData.returnLocation}
          onChange={(_, v) =>
            v && setSearchData({ ...searchData, returnLocation: v })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lugar de entrega"
              margin="normal"
              fullWidth
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              {...register("terms")}
              sx={{ color: "#d60812", "&.Mui-checked": { color: "#d60812" } }}
            />
          }
          label={
            <Link
              href="/terminos-y-condiciones"
              underline="hover"
              sx={{ color: "#d60812", "&:hover": { color: "#a00612" } }}
            >
              Acepto los términos y condiciones
            </Link>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              {...register("privacy")}
              sx={{ color: "#d60812", "&.Mui-checked": { color: "#d60812" } }}
            />
          }
          label={
            <Link
              href="/aviso-de-privacidad"
              underline="hover"
              sx={{ color: "#d60812", "&:hover": { color: "#a00612" } }}
            >
              Acepto la política de privacidad
            </Link>
          }
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#d60812",
              height: 55,
              ":hover": { backgroundColor: "#a00612" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
            disabled={
              submitting ||
              !watch("terms") ||
              !watch("privacy") ||
              (!isLoggedIn && !isValid)
            }
          >
            {submitting ? (
              <>
                Procesando...
                <CircularProgress size={20} sx={{ color: "#a00612" }} />
              </>
            ) : (
              "Pago al entregar"
            )}
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{
              height: 55,
              backgroundColor: "#ffc439",
              color: "#000",
              ":hover": { backgroundColor: "#ffb300" },
            }}
            disabled={
              !watch("terms") || !watch("privacy") || (!isLoggedIn && !isValid)
            }
          >
            Pago en línea
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
