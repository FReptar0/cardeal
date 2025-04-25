import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    IconButton,
    Avatar,
    Box,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Esquema para actualizar la información general (sin contraseña)
const profileSchema = yup.object().shape({
    fullName: yup.string().required("El nombre es obligatorio"),
    phone: yup.string().required("El teléfono es obligatorio"),
    birthDate: yup.date().required("La fecha de nacimiento es obligatoria"),
    location: yup.string().required("La ubicación es obligatoria"),
    bio: yup.string(),
    position: yup.string(),
    avatar: yup.string().notRequired(),
});

// Esquema para actualizar la contraseña
const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required("La contraseña actual es obligatoria"),
    newPassword: yup.string()
        .required("La nueva contraseña es obligatoria")
        .min(8, "Debe contener al menos 8 caracteres")
        .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
        .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .matches(/\d/, "Debe contener al menos un número"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
        .required("Confirma la nueva contraseña"),
});

const EditProfileModal = ({ open, onClose, onRefresh, defaultValues }) => {
    const { jwt, logout } = useAuth();

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        reset: resetProfile,
        watch,
        control,
        formState: { errors: profileErrors },
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: defaultValues || {},
    });

    const avatarPreview = watch("avatar");

    useEffect(() => {
        if (defaultValues) {
            resetProfile(defaultValues);
        }
    }, [defaultValues, resetProfile]);

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

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

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                    <Box sx={{ flex: 1 }}>
                        <Box component="form" onSubmit={handleSubmitProfile(onSubmitProfile)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre completo"
                                {...registerProfile("fullName")}
                                error={!!profileErrors.fullName}
                                helperText={profileErrors.fullName?.message}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Box sx={{ width: "100%" }}>
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
                                                border: `1px solid ${profileErrors.phone ? "#d32f2f" : "#c4c4c4"}`,
                                            }}
                                            buttonStyle={{
                                                border: "none",
                                                backgroundColor: "transparent",
                                            }}
                                            containerStyle={{ width: "100%" }}
                                        />
                                        {profileErrors.phone && (
                                            <Typography variant="caption" color="error">
                                                {profileErrors.phone.message}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
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

                    {/* Divisores */}
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                    <Divider orientation="horizontal" flexItem sx={{ display: { xs: "block", md: "none" } }} />

                    {/* Sección de cambio de contraseña */}
                    <Box sx={{ flex: 1 }}>
                        <Box component="form" onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Contraseña Actual"
                                type={showCurrentPassword ? "text" : "password"}
                                {...registerPassword("currentPassword")}
                                error={!!passwordErrors.currentPassword}
                                helperText={passwordErrors.currentPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type={showNewPassword ? "text" : "password"}
                                {...registerPassword("newPassword")}
                                error={!!passwordErrors.newPassword}
                                helperText={passwordErrors.newPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirmar Nueva Contraseña"
                                type={showConfirmPassword ? "text" : "password"}
                                {...registerPassword("confirmPassword")}
                                error={!!passwordErrors.confirmPassword}
                                helperText={passwordErrors.confirmPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
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
