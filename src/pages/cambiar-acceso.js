import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Debe tener al menos 8 caracteres")
    .required("La nueva contraseña es obligatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required("La confirmación es obligatoria"),
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Contraseña restablecida. Puedes iniciar sesión.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      toast.error(err.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 8, userSelect: "none", outline: "none" }} tabIndex={-1}>
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
        Establece tu nueva contraseña
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Nueva contraseña"
          type={showPassword ? "text" : "password"}
          margin="normal"
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirmar contraseña"
          type={showPassword ? "text" : "password"}
          margin="normal"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

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
          {loading ? "Actualizando..." : "ACTUALIZAR CONTRASEÑA"}
        </Button>
      </form>
    </Box>
  );
};

export default ResetPasswordPage;
