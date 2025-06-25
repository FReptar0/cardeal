"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import format from "date-fns/format";
import { useSearch } from "../contexts/SearchContext";

const CompactHeader = ({ headerIsTop, showCompactHeader }) => {
  const { searchData } = useSearch();

  return (
    <Box
      sx={{
        position: "relative", // ya no es fixed
        top: "auto",
        left: "50%", // centramos el ancho completo
        transform: "translateX(-50%)",
        width: "100vw", // ancho de toda la ventana
        backgroundColor: (theme) => theme.palette.primary.buttons,
        zIndex: 1000, // por encima del contenido
        opacity: showCompactHeader ? 1 : 0,
        pointerEvents: showCompactHeader ? "auto" : "none",
        visibility: showCompactHeader ? "visible" : "hidden",
        transition: "opacity 0.4s ease, transform 0.7s ease",
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Origen:{" "}
            {searchData.pickupLocation?.nombre
              ? `${searchData.pickupLocation.nombre} - (${searchData.pickupLocation.pais})`
              : "No seleccionado"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Destino:{" "}
            {searchData.sameOffice
              ? "Misma oficina"
              : searchData.returnLocation?.nombre
              ? `${searchData.returnLocation.nombre} - (${searchData.returnLocation.pais})`
              : "No seleccionado"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              flexBasis: "100%",
              textAlign: "center",
            }}
          >
            {searchData?.pickupDate &&
              `${format(searchData.pickupDate, "dd/MM/yyyy")} ${
                searchData.pickupTime
              } → ${format(searchData.returnDate, "dd/MM/yyyy")} ${
                searchData.returnTime
              }`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompactHeader;
