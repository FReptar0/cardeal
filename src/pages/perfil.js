// /pages/perfil.js
import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Divider,
    Container,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserProfile from "@/hooks/useUserProfile";
import cars from "../data/cars.json";

const UserProfile = () => {
    const { userData, loading } = useUserProfile();

    // Mientras se consulta la información o se redirige, no renderizamos nada
    if (loading || !userData) return null;

    return (
        <Container sx={{ mt: 20, mb: 10, maxWidth: "100vw", px: 2 }}>
            <ToastContainer position="top-center" autoClose={5000} />

            {/* Encabezado del perfil */}
            <Box
                sx={{
                    position: "relative",
                    background: "linear-gradient(90deg, #0B5D3C, #10906A)",
                    height: 150,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        src={userData.avatar || "/user-avatar.png"}
                        sx={{ width: 80, height: 80, border: "4px solid white" }}
                    />
                    <Box>
                        <Typography variant="h5" color="white">
                            {userData.fullName}
                        </Typography>
                    </Box>
                </Box>
                <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} startIcon={<EditIcon />}>
                    Editar perfil
                </Button>
            </Box>

            {/* Contenido */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mt: 2,
                    mb: 2,
                }}
            >
                {/* Acerca de mí */}
                <Card sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Acerca de mí</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2">BIOGRAFÍA</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {userData.bio || "Aquí se mostrará la biografía del usuario si está definida."}
                        </Typography>
                        <Typography variant="subtitle2">POSICIÓN</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {userData.position || "Información de la posición (ej. Diseñador de temas en Bootstrap)."}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="subtitle2">TELÉFONO</Typography>
                                <Typography variant="body2">{userData.phone}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">FECHA DE NACIMIENTO</Typography>
                                <Typography variant="body2">
                                    {userData.birthDate
                                        ? format(new Date(userData.birthDate), "dd/MM/yyyy", { locale: es })
                                        : "Fecha no disponible"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Box>
                                <Typography variant="subtitle2">CORREO ELECTRÓNICO</Typography>
                                <Typography variant="body2">{userData.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2">UBICACIÓN</Typography>
                                <Typography variant="body2">{userData.location}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Mis reservas */}
                <Card sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Mis reservas</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {cars.map((car) => (
                                <ListItem
                                    key={car.name}
                                    sx={{
                                        border: "1px solid #ddd",
                                        borderRadius: 2,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <ListItemAvatar sx={{ maxWidth: 100, mr: 2 }}>
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={car.name.replace(" o Similar", "")}
                                        secondary={car.category}
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                                        20/10/2021
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default UserProfile;
