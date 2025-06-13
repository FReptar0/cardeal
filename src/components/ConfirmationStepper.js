"use client";

import { Stepper, Step, StepLabel, Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRef, useEffect } from "react";

const steps = [
  { label: "Renta", icon: DirectionsCarIcon },
  { label: "Protección", icon: SecurityIcon },
  { label: "Extras", icon: AddCircleIcon },
  { label: "Checkout", icon: ShoppingCartIcon },
  { label: "Confirmación", icon: CheckCircleIcon },
];

export default function ConfirmationStepper() {
  const activeStep = 4; // Confirmación es el paso final
  const stepRefs = useRef([]);

  useEffect(() => {
    if (stepRefs.current[activeStep]) {
      stepRefs.current[activeStep].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  return (
    <Box
      sx={{
        mt: 18,
        mb: 3,
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        px: 1,
        "@media (min-width: 457px)": {
          overflowX: "visible",
        },
      }}
    >
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        sx={{
          width: "max-content",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "flex-start",
          "@media (min-width: 457px)": {
            width: "100%",
            justifyContent: "space-between",
          },
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index <= activeStep;
          return (
            <Step
              key={step.label}
              ref={(el) => (stepRefs.current[index] = el)}
              sx={{
                "@media (max-width: 456px)": {
                  flex: "0 0 80px",
                },
                "@media (min-width: 457px)": {
                  flex: 1,
                },
              }}
            >
              <StepLabel
                icon={
                  <step.icon
                    sx={{
                      fontSize: 32,
                      color: isCompleted
                        ? (theme) => theme.palette.primary.buttons
                        : "#b0b0b0",
                    }}
                  />
                }
                sx={{
                  color: isCompleted
                    ? (theme) => theme.palette.primary.buttons
                    : "#b0b0b0",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
