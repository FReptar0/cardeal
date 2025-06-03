"use client";

import { Stepper, Step, StepLabel, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ConfirmationStepper() {
  return (
    <Box
      sx={{
        mt: 18,
        mb: 3,
        px: 1,
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Stepper activeStep={0}>
        <Step>
          <StepLabel
            icon={
              <CheckCircleIcon sx={{ fontSize: 32, color: theme => theme.palette.primary.buttons }} />
            }
            sx={{
              color: theme => theme.palette.primary.buttons,
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            Confirmación
          </StepLabel>
        </Step>
      </Stepper>
    </Box>
  );
}
