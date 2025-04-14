import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, TextField, Button, Typography } from "@mui/material";

// Esquema de validación para el registro
const registerSchema = yup.object().shape({
    fullName: yup.string().required("El nombre completo es obligatorio"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Correo inválido"),
    birthDate: yup.date().required("La fecha de nacimiento es obligatoria"),
    location: yup.string().required("La ubicación es obligatoria"),
    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(6, "Debe contener al menos 6 caracteres"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Confirmar la contraseña es obligatorio"),
});

const RegisterForm = ({ onToggle }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState("");

    // Estilo para los campos del formulario
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
        setMessage("");

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
                setMessage(json.message || "Error al registrar");
                setLoading(false);
                return;
            }

            // Registro exitoso: mostramos mensaje de éxito y luego cambiamos al login
            setMessage("Usuario registrado exitosamente. Inicia sesión.");
            setTimeout(() => {
                onToggle(); // Cambia de formulario a login
            }, 2000);
        } catch (error) {
            console.error(error);
            setMessage("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 400 }}>
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
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >
                    <TextField
                        label="Nombre completo"
                        fullWidth
                        margin="dense"
                        sx={{ flex: "1 1 48%", ...thinInputSX }}
                        {...register("fullName")}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                    />
                    <TextField
                        label="Teléfono"
                        fullWidth
                        margin="dense"
                        sx={{ flex: "1 1 48%", ...thinInputSX }}
                        {...register("phone")}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
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
                        type="password"
                        fullWidth
                        margin="dense"
                        sx={{ ...thinInputSX }}
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        label="Confirmar contraseña"
                        type="password"
                        fullWidth
                        margin="dense"
                        sx={{ ...thinInputSX }}
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                </Box>

                {message && (
                    <Typography color="error" textAlign="center">
                        {message}
                    </Typography>
                )}

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
