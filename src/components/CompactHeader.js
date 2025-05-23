"use client";

import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import format from "date-fns/format";
import { useSearch } from "../contexts/SearchContext";

const CompactHeader = ({ headerIsTop, showCompactHeader }) => {
  const { searchData } = useSearch();

  return (
    <Box
      sx={{
        position: "fixed",
        top: headerIsTop ? "100px" : "60px",
        left: 0,
        width: "100%",
        backgroundColor: theme => theme.palette.primary.buttons,
        zIndex: 1200,
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
        {/* Sección de textos: Origen, Destino, y Fechas */}
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
          {/* Origen */}
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textAlign: { xs: "center", sm: "left" },
              flexBasis: { xs: "100%", sm: "auto" },
            }}
          >
            Origen:{" "}
            {searchData.pickupLocation.nombre
              ? `${searchData.pickupLocation.nombre} - (${searchData.pickupLocation.pais})`
              : "No seleccionado"}
          </Typography>

          {/* Destino */}
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textAlign: { xs: "center", sm: "left" },
              flexBasis: { xs: "100%", sm: "auto" },
            }}
          >
            Destino:{" "}
            {searchData.sameOffice
              ? "Misma oficina"
              : searchData.returnLocation?.nombre
              ? `${searchData.returnLocation.nombre} - (${searchData.returnLocation.pais})`
              : "No seleccionado"}
          </Typography>

          {/* Fecha y hora */}
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              flexBasis: "100%",
              marginBottom: 2,
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

        {/* Botón flotando a mitad fuera del contenedor */}
        <Tooltip title="Volver arriba" arrow>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: "-20px",
              transform: "translateX(-50%)",
              background: "white",
              width: 35,
              height: 35,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              transition: "background 0.3s",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUpwardIcon sx={{ color: theme => theme.palette.primary.buttons, fontSize: 20 }} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CompactHeader;
