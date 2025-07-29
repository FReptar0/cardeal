import React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
} from "@mui/material";
import Places from "@/components/Places";
import { formatCurrency } from "@/utils/calculations";

const VehicleSection = ({
  selectedCar,
  pickupDateString,
  returnDateString,
  rentalDays,
  dailyCarCost,
  totalCarCost,
  dailyCarCost2,
  totalCarCost2,
  paidOnline,
  pickupDisplay,
  returnDisplay,
}) => {
  if (!selectedCar) {
    return (
      <Typography variant="body2">
        No se ha seleccionado un vehículo.
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Image
          src={selectedCar.image}
          alt={selectedCar.name}
          width={300}
          height={180}
          style={{ 
            width: "100%", 
            maxWidth: 300, 
            borderRadius: 8, 
            height: "auto", 
            objectFit: "contain" 
          }}
          priority
        />
        <Typography variant="body1" fontWeight="bold">
          {selectedCar.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {selectedCar.category}
        </Typography>
      </Box>

      <Places
        pickupDisplay={pickupDisplay}
        returnDisplay={returnDisplay}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          margin: "0 auto",
        }}
      />

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        <b>Fechas de la Renta:</b>
      </Typography>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2">
          {pickupDateString} - {returnDateString}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          ({rentalDays} días)
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" fontStyle="italic">
          {paidOnline
            ? `${formatCurrency(dailyCarCost2)} /día (precio en línea)`
            : `${formatCurrency(dailyCarCost)} /día (precio mostrador)`}
        </Typography>
        
        {paidOnline && totalCarCost !== totalCarCost2 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "#bdbdbd",
                fontWeight: 500,
                fontSize: 16,
                mb: 0.5,
              }}
            >
              {formatCurrency(totalCarCost)}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: (theme) => theme.palette.primary.text,
                fontSize: 18,
              }}
            >
              {formatCurrency(totalCarCost2)}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={
              paidOnline
                ? { color: (theme) => theme.palette.primary.text }
                : {}
            }
          >
            {formatCurrency(paidOnline ? totalCarCost2 : totalCarCost)}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default VehicleSection;