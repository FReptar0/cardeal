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
    InputAdornment,
    IconButton,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

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

    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    remember: data.remember, // Enviar el flag "remember"
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.message || "Error al iniciar sesión");
                setLoading(false);
                return;
            }

            // Llamamos a la función login del AuthContext para guardar el token
            login(json.token);

            // Redirigimos a /perfil tras el inicio de sesión correcto
            router.push("/perfil");
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 400, userSelect: "none", outline: "none"}}
        tabIndex={-1}>
            {/* Toast Container para mostrar los mensajes */}
            <ToastContainer position="top-center" autoClose={5000} />

            <Box
                component="img"
                src="/logos/Qardeal_logo_completo_color.png"
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
                    type={showPassword ? "text" : "password"}
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
                                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
                    <Typography variant="body2" sx={{ cursor: "pointer" }} onClick={() => router.push("/recuperar-cuenta")}>
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
                        backgroundColor: theme => theme.palette.secondary.buttons,
                        fontWeight: "bold",
                        fontSize: "16px",
                        ":hover": { backgroundColor: "#a91c24" },
                    }}
                    disabled={loading}
                >
                    {loading ? "Iniciando..." : "INICIAR SESIÓN"}
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
