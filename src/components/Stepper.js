"use client";

import { Stepper, Step, StepLabel, Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const steps = [
  { label: "Renta", icon: DirectionsCarIcon, path: "/rental" },
  { label: "Protección", icon: SecurityIcon, path: "/proteccion" },
  { label: "Extras", icon: AddCircleIcon, path: "/extras-renta" },
  { label: "Checkout", icon: ShoppingCartIcon, path: "/checkout" },
  { label: "Confirmación", icon: CheckCircleIcon, path: "/confirm" },
];

export default function RentalStepper() {
  const router = useRouter();
  const pathname = usePathname();
  const activeStep = steps.findIndex((step) => {
    if (!pathname) return false; // Verificar si pathname es válido
    if (step.path === "/confirm") {
      return pathname.startsWith(step.path);
    }
    return step.path === pathname;
  });

  // refs para centrar el paso activo en móvil
  const stepRefs = useRef([]);

  // Solo permitir regresar a pasos anteriores
  const handleStepClick = (index) => {
    if (index <= activeStep) {
      router.push(steps[index].path);
    }
  };

  // Scroll al paso activo
  useEffect(() => {
    if (stepRefs.current[activeStep]) {
      stepRefs.current[activeStep].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeStep]);

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
              onClick={() => handleStepClick(index)}
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
                      color: isCompleted ? theme => theme.palette.primary.buttons : "#b0b0b0",
                    }}
                  />
                }
                sx={{
                  cursor: isCompleted ? "pointer" : "default",
                  color: isCompleted ? theme => theme.palette.primary.buttons : "#b0b0b0",
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
