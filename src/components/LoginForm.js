import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

// Esquema de validación para el login
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Correo inválido"),
    password: yup.string().required("La contraseña es obligatoria"),
});

const LoginForm = ({ onToggle }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = (data) => {
        console.log("Datos de login:", data);
        // Aquí puedes implementar la llamada a la API de autenticación o cualquier lógica adicional.
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
                Inicia sesión para continuar
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Correo electrónico"
                    margin="normal"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        my: 1,
                    }}
                >
                    <FormControlLabel
                        control={<Checkbox {...register("remember")} />}
                        label="Recordarme"
                    />
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                        ¿Olvidaste tu contraseña?
                    </Typography>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: "8px",
                        backgroundColor: "#c43c44",
                        fontWeight: "bold",
                        fontSize: "16px",
                        ":hover": { backgroundColor: "#a91c24" },
                    }}
                >
                    INICIAR SESIÓN
                </Button>
            </form>

            <Typography
                variant="body2"
                textAlign="center"
                mt={2}
                sx={{ cursor: "pointer" }}
                onClick={onToggle}
            >
                ¿No tienes cuenta? Regístrate
            </Typography>
        </Box>
    );
};

export default LoginForm;
