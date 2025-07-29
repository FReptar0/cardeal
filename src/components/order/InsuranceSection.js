import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { formatCurrency } from "@/utils/calculations";

const InsuranceSection = ({
  selectedInsurance,
  rentalDays,
  totalInsuranceCost,
}) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        <b>Protección Seleccionada:</b>
      </Typography>
      
      {selectedInsurance ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight="bold">
              {selectedInsurance.nombre}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {selectedInsurance.total} /día
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography variant="body2" fontStyle="italic">
              ({rentalDays} días) = {formatCurrency(totalInsuranceCost)}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography variant="body2">
          No se ha seleccionado una protección.
        </Typography>
      )}
    </>
  );
};

export default InsuranceSection;