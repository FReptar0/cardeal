import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Divider,
    Container,
    Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserProfile from "@/hooks/useUserProfile";
import EditProfileModal from "@/components/EditProfileModal";
import ReservationsList from "@/components/ReservationsList";

const UserProfile = () => {
    const { userData, loading } = useUserProfile();
    const [openEditModal, setOpenEditModal] = useState(false);

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
                    {loading ? (
                        <Skeleton variant="circular" width={80} height={80} sx={{ border: "4px solid white" }} />
                    ) : (
                        <Avatar
                            src={userData.avatar || "/user-avatar.png"}
                            sx={{ width: 80, height: 80, border: "4px solid white" }}
                        />
                    )}
                    <Box>
                        {loading ? (
                            <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: "grey.300" }} />
                        ) : (
                            <Typography variant="h5" color="white">
                                {userData.fullName}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {loading ? (
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                ) : (
                    <Button
                        variant="outlined"
                        sx={{ color: "white", borderColor: "white" }}
                        startIcon={<EditIcon />}
                        onClick={() => setOpenEditModal(true)}
                    >
                        Editar info
                    </Button>
                )}
            </Box>

            {/* Sección de Información del Perfil */}
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
                        {loading ? (
                            <>
                                <Skeleton variant="text" width="60%" height={30} />
                                <Divider sx={{ my: 2 }} />
                                <Skeleton variant="text" width="40%" height={20} />
                                <Skeleton variant="text" width="90%" height={20} />
                                <Skeleton variant="text" width="80%" height={20} />
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Skeleton variant="text" width="40%" height={20} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                    <Skeleton variant="text" width="40%" height={20} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Box>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Mis reservas */}
                <Card sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                    <CardContent>
                        {loading ? (
                            <Skeleton variant="rectangular" height={200} />
                        ) : (
                            <>
                                <Typography variant="h6">Mis reservas</Typography>
                                <Divider sx={{ my: 2 }} />
                                <ReservationsList />
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>

            {/* Modal de Edición */}
            <EditProfileModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                onRefresh={() => window.location.reload()}
                defaultValues={userData}
            />
        </Container>
    );
};

export default UserProfile;
