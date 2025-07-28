import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const PaymentButtons = ({ 
  handleSubmit,
  onSubmit,
  submitting,
  submittingOnline,
  registeredMode,
  tokenIsInvalid,
  isValid,
  watch,
  calculateTotal
}) => {
  const isCounterDisabled = submitting ||
    (!registeredMode
      ? !watch("fullName") ||
        !watch("phone") ||
        !watch("email") ||
        !watch("birthDate") ||
        !watch("terms") ||
        !watch("privacy")
      : (tokenIsInvalid && !isValid) ||
        !watch("terms") ||
        !watch("privacy"));

  const isOnlineDisabled = submittingOnline ||
    (tokenIsInvalid && !isValid) ||
    !watch("terms") ||
    !watch("privacy");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mt: 3,
      }}
    >
      <Button
        fullWidth
        variant="outlined"
        onClick={handleSubmit(onSubmit(false))}
        disabled={isCounterDisabled}
        sx={{
          borderColor: "#10906a",
          backgroundColor: "#fff",
          color: "#111",
          "&:hover": {
            borderColor: "#10906a",
            backgroundColor: "#e6f5f0",
            color: "#111",
          },
          position: "relative",
          minHeight: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        <span
          style={{ width: "100%", textAlign: "center", fontWeight: 700 }}
        >
          {submitting
            ? "Procesando..."
            : "Pago en mostrador".charAt(0).toUpperCase() +
              "Pago en mostrador".slice(1).toLowerCase()}
        </span>
        <span style={{ width: "100%", textAlign: "center", marginTop: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: isCounterDisabled ? "#b0b0b0" : "#111",
              fontWeight: 700,
              display: "block",
            }}
          >
            {`Total: $${calculateTotal(false)}`}
          </Typography>
        </span>
      </Button>

      {registeredMode && (
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleSubmit(onSubmit(true))}
          disabled={isOnlineDisabled}
          sx={{
            backgroundColor: (theme) =>
              isOnlineDisabled
                ? "rgba(16, 144, 106, 0.5)"
                : theme.palette.primary.buttons || "#10906a",
            "&:hover": {
              backgroundColor: (theme) =>
                isOnlineDisabled
                  ? "rgba(16, 144, 106, 0.7)"
                  : theme.palette.primary.buttons || "#10906a",
            },
            position: "relative",
            minHeight: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            style={{ width: "100%", textAlign: "center", fontWeight: 700 }}
          >
            {submittingOnline
              ? "Redirigiendo…"
              : "Pago en línea".charAt(0).toUpperCase() +
                "Pago en línea".slice(1).toLowerCase()}
          </span>
          <span
            style={{ width: "100%", textAlign: "center", marginTop: 4 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isOnlineDisabled ? "#b0b0b0" : "#fff",
                fontWeight: 700,
                display: "block",
              }}
            >
              {`Total: $${calculateTotal(true)}`}
            </Typography>
          </span>
        </Button>
      )}
    </Box>
  );
};

export default PaymentButtons;