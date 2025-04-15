// /components/EditProfileModal.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Divider,
    IconButton,
    Avatar,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";

// Esquema para actualizar la información general (sin contraseña)
const profileSchema = yup.object().shape({
    fullName: yup.string().required("El nombre es obligatorio"),
    phone: yup.string().required("El teléfono es obligatorio"),
    birthDate: yup.date().required("La fecha de nacimiento es obligatoria"),
    location: yup.string().required("La ubicación es obligatoria"),
    bio: yup.string(),
    position: yup.string(),
    avatar: yup.string().notRequired(), // Se llenará con la imagen en Base64
});

// Esquema para actualizar la contraseña
const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required("La contraseña actual es obligatoria"),
    newPassword: yup
        .string()
        .required("La nueva contraseña es obligatoria")
        .min(6, "Debe tener al menos 6 caracteres"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
        .required("Confirma la nueva contraseña"),
});

const EditProfileModal = ({ open, onClose, onRefresh, defaultValues }) => {
    const { jwt, logout } = useAuth();

    // Formulario para actualización de información general
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        reset: resetProfile,
        watch,
        formState: { errors: profileErrors },
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: defaultValues || {},
    });

    // Obtenemos el valor actual del avatar
    const avatarPreview = watch("avatar");

    // Actualizar valores cuando defaultValues cambien
    useEffect(() => {
        if (defaultValues) {
            resetProfile(defaultValues);
        }
    }, [defaultValues, resetProfile]);

    // Formulario para actualización de contraseña
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    // Convertir el archivo seleccionado a Base64 para el avatar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileValue("avatar", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Enviar formulario de información general
    const onSubmitProfile = async (data) => {
        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.message || "Error al actualizar el perfil");
                return;
            }
            toast.success("Perfil actualizado exitosamente");
            onClose();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error de conexión");
        }
    };

    // Enviar formulario de actualización de contraseña
    const onSubmitPassword = async (data) => {
        try {
            const res = await fetch("/api/user/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.message || "Error al actualizar la contraseña");
                return;
            }
            toast.success("Contraseña actualizada exitosamente");
            resetPassword();
            onClose();
            logout();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Error de conexión");
        }
    };

    // Estilo para los botones (para la sección de upload, se usa el color #10906a solo en borde y texto)
    const uploadButtonStyle = {
        borderColor: "#10906a",
        color: "#10906a",
        ":hover": {
            borderColor: "#0e7c5a",
            color: "#0e7c5a",
            backgroundColor: "transparent",
        },
    };

    const updateButtonStyle = {
        backgroundColor: "#d60812",
        ":hover": { backgroundColor: "#b0060f" },
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
                Editar Perfil
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <ToastContainer position="top-center" autoClose={5000} />
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
                    {/* Sección: Información General */}
                    <Box sx={{ flex: 1 }}>
                        <Box component="form" onSubmit={handleSubmitProfile(onSubmitProfile)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre completo"
                                {...registerProfile("fullName")}
                                error={!!profileErrors.fullName}
                                helperText={profileErrors.fullName?.message}
                            />
                            <TextField
                                fullWidth
                                label="Teléfono"
                                {...registerProfile("phone")}
                                error={!!profileErrors.phone}
                                helperText={profileErrors.phone?.message}
                            />
                            <TextField
                                fullWidth
                                label="Fecha de nacimiento"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...registerProfile("birthDate")}
                                error={!!profileErrors.birthDate}
                                helperText={profileErrors.birthDate?.message}
                            />
                            <TextField
                                fullWidth
                                label="Ubicación"
                                {...registerProfile("location")}
                                error={!!profileErrors.location}
                                helperText={profileErrors.location?.message}
                            />
                            <TextField
                                fullWidth
                                label="Biografía"
                                {...registerProfile("bio")}
                                error={!!profileErrors.bio}
                                helperText={profileErrors.bio?.message}
                            />
                            <TextField
                                fullWidth
                                label="Posición"
                                {...registerProfile("position")}
                                error={!!profileErrors.position}
                                helperText={profileErrors.position?.message}
                            />
                            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                <Button variant="outlined" component="label" sx={{ ...uploadButtonStyle }}>
                                    Subir Avatar (png, jpg, webp)
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {/* Previsualización del Avatar */}
                                {avatarPreview && (
                                    <Avatar
                                        src={avatarPreview}
                                        sx={{ width: 120, height: 120, mt: 1, border: "2px solid #10906a" }}
                                    />
                                )}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button type="submit" variant="contained" fullWidth sx={{ ...updateButtonStyle }}>
                                    Actualizar Información
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Divisor visual */}
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                    <Divider orientation="horizontal" flexItem sx={{ display: { xs: "block", md: "none" } }} />

                    {/* Sección: Actualización de Contraseña */}
                    <Box sx={{ flex: 1 }}>
                        <Box component="form" onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Contraseña Actual"
                                type="password"
                                {...registerPassword("currentPassword")}
                                error={!!passwordErrors.currentPassword}
                                helperText={passwordErrors.currentPassword?.message}
                            />
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type="password"
                                {...registerPassword("newPassword")}
                                error={!!passwordErrors.newPassword}
                                helperText={passwordErrors.newPassword?.message}
                            />
                            <TextField
                                fullWidth
                                label="Confirmar Nueva Contraseña"
                                type="password"
                                {...registerPassword("confirmPassword")}
                                error={!!passwordErrors.confirmPassword}
                                helperText={passwordErrors.confirmPassword?.message}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button type="submit" variant="contained" fullWidth sx={{ ...updateButtonStyle }}>
                                    Actualizar Contraseña
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;
