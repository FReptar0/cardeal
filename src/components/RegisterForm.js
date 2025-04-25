import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import { differenceInYears } from "date-fns";
import PhoneInput from "react-phone-input-2";

// Esquema de validación
const registerSchema = yup.object().shape({
    fullName: yup.string().required("El nombre completo es obligatorio"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Correo inválido"),
    birthDate: yup
        .date()
        .required("La fecha de nacimiento es obligatoria")
        .typeError("Por favor, ingresa una fecha válida")
        .test(
            "is-adult",
            "Debes tener al menos 18 años para registrarte",
            (value) => value && differenceInYears(new Date(), new Date(value)) >= 18
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
        .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Confirmar la contraseña es obligatorio"),
});

const RegisterForm = ({ onToggle }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const thinInputSX = {
        "& .MuiOutlinedInput-input": {
            paddingTop: "12px",
            paddingBottom: "6px",
        },
        "& .MuiInputLabel-root": {
            transform: "translate(14px, 9px) scale(1)",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            transform: "translate(14px, -4px) scale(0.75)",
        },
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
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
                toast.error(json.message || "Error al registrar");
                setLoading(false);
                return;
            }

            toast.success("Usuario registrado exitosamente. Inicia sesión.");
            setTimeout(() => {
                onToggle(); // Cambia a formulario de login
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 400 }}>
            <ToastContainer position="top-center" autoClose={5000} />

            <Box
                component="img"
                src="/logos/Qardeal_logo completo verde y rojo.png"
                alt="Qardeal logo"
                sx={{
                    display: "block",
                    margin: "0 auto",
                    width: { xs: "80%", sm: "300px", md: "400px" },
                    height: "auto",
                    mb: -5,
                }}
            />
            <Typography variant="subtitle1" textAlign="center" mb={4}>
                Completa tus datos para registrarte
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column", // Cambiamos para apilar
                        gap: 1,
                    }}
                >
                    <TextField
                        label="Nombre completo"
                        fullWidth
                        margin="dense"
                        sx={{ width: "100%", ...thinInputSX }} // Ocupar 100%
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
                                    country={'mx'}
                                    enableSearch
                                    inputStyle={{
                                        width: '100%',
                                        height: '56px',
                                        fontSize: '16px',
                                        paddingLeft: '48px',
                                        borderRadius: '4px',
                                        border: `1px solid ${errors.phone ? '#d32f2f' : '#c4c4c4'}`,
                                    }}
                                    buttonStyle={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                    }}
                                    containerStyle={{ width: '100%' }}
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
                        fullWidth
                        margin="dense"
                        sx={{ width: "100%", ...thinInputSX }}
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        label="Fecha de nacimiento"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                        sx={{ flex: "1 1 48%", ...thinInputSX }}
                        {...register("birthDate")}
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                    />

                    <TextField
                        label="Ubicación"
                        fullWidth
                        margin="dense"
                        sx={{ flex: "1 1 48%", ...thinInputSX }}
                        {...register("location")}
                        error={!!errors.location}
                        helperText={errors.location?.message}
                    />

                    <TextField
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="dense"
                        sx={{ ...thinInputSX }}
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
                                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Typography variant="caption" color="textSecondary">
                        La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.
                    </Typography>

                    <TextField
                        label="Confirmar contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        margin="dense"
                        sx={{ ...thinInputSX }}
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
                                        {showConfirmPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: "8px",
                        backgroundColor: "#548b6c",
                        fontWeight: "bold",
                        fontSize: "16px",
                        ":hover": { backgroundColor: "#306c4a" },
                    }}
                    disabled={loading}
                >
                    {loading ? "Registrando..." : "REGISTRARSE"}
                </Button>
            </form>

            <Typography
                variant="body2"
                textAlign="center"
                mt={2}
                sx={{ cursor: "pointer" }}
                onClick={onToggle}
            >
                ¿Ya tienes cuenta? Inicia sesión
            </Typography>
        </Box>
    );
};

export default RegisterForm;
