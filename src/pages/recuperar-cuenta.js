import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, TextField, Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Correo inválido"),
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Te hemos enviado un correo con instrucciones.");
    } catch (err) {
      toast.error(err.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        outline: "none",
      }}
      tabIndex={-1}
    >
      <ToastContainer position="top-center" autoClose={5000} />

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: -8,
        }}
      >
        <Box
          component="img"
          src="/logos/Qardeal_logo_completo_color.png"
          alt="Qardeal logo"
          sx={{
            width: "100%",
            height: "auto",
            mb: -3,
          }}
        />
        <Typography variant="subtitle1" textAlign="center" mb={4}>
          Recupera el acceso a tu cuenta
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Correo electrónico"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", textDecoration: "none", mt: 1, mb: 1 }}
              onClick={() => router.push("/login")}
            >
              Regresar al inicio de sesión
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: "8px",
              backgroundColor: (theme) => theme.palette.secondary.buttons,
              fontWeight: "bold",
              fontSize: "16px",
              ":hover": { backgroundColor: "#a91c24" },
            }}
            disabled={loading}
          >
            {loading ? "Enviando..." : "ENVIAR INSTRUCCIONES"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
