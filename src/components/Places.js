import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import { Box, Typography } from "@mui/material";
import { useSearch } from "@/contexts/SearchContext";

export default function Places() {
  const { searchData } = useSearch();

  const pickupDisplay = searchData.pickupLocation
    ? `${searchData.pickupLocation.ciudad} - ${searchData.pickupLocation.estado}`
    : "No especificado";

  const returnDisplay = searchData.sameOffice
    ? pickupDisplay
    : searchData.returnLocation
    ? `${searchData.returnLocation.ciudad} - ${searchData.returnLocation.estado}`
    : "No especificado";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", // Maintain space-between for layout
        alignItems: "center",
        mb: 2,
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        width: "calc(100% + 32px)", // Increase width by 16px on each side
        margin: "0 -16px", // Adjust margin to compensate for increased width
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          flex: 1,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Lugar de retiro
        </Typography>
        <LocationOnIcon sx={{ color: "#6e7276", fontSize: 32 }} />
        <Typography variant="body2" sx={{ color: "#6e7276" }}>
          {pickupDisplay}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          flex: 1,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Lugar de entrega
        </Typography>
        <StoreIcon sx={{ color: "#6e7276", fontSize: 32 }} />
        <Typography variant="body2" sx={{ color: "#6e7276" }}>
          {returnDisplay}
        </Typography>
      </Box>
    </Box>
  );
}
