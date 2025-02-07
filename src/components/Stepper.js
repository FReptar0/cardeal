"use client";

import { Stepper, Step, StepLabel } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, usePathname } from "next/navigation";

const steps = [
  { label: "Renta", icon: DirectionsCarIcon, path: "/rental" },
  { label: "Seguro", icon: SecurityIcon, path: "/seguro" },
  { label: "Extras", icon: AddCircleIcon, path: "/extras-renta" },
  { label: "Checkout", icon: ShoppingCartIcon, path: "/checkout" },
  { label: "Confirmación", icon: CheckCircleIcon, path: "/confirm" },
];

const RentalStepper = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Obtener el índice actual basado en la ruta
  const activeStep = steps.findIndex((step) => step.path === pathname);

  const handleStepClick = (index) => {
    // Solo permitir regresar a pasos anteriores
    if (index <= activeStep) {
      router.push(steps[index].path);
    }
  };

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((step, index) => {
        const isCompleted = index <= activeStep; // Si el paso ya fue alcanzado
        return (
          <Step key={step.label} onClick={() => handleStepClick(index)}>
            <StepLabel
              icon={<step.icon sx={{ fontSize: 32, color: isCompleted ? "#d60812" : "#b0b0b0" }} />}
              sx={{
                cursor: isCompleted ? "pointer" : "default",
                color: isCompleted ? "#d60812" : "#b0b0b0",
                fontSize: "18px",
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default RentalStepper;
