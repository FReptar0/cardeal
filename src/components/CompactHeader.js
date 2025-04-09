"use client";

import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import format from "date-fns/format";
import { useSearch } from "../contexts/SearchContext"; // Importamos el hook del contexto

const CompactHeader = ({ headerIsTop, showCompactHeader }) => {
    // Obtenemos la data global de reserva
    const { searchData } = useSearch();

    return (
        <Box
            sx={{
                position: "fixed",
                top: headerIsTop ? "100px" : "60px",
                left: 0,
                width: "100%",
                height: "64px",
                background: "#10906a",
                zIndex: 1200,
                opacity: showCompactHeader ? 1 : 0,
                transition: "opacity .4s ease, transform .7s ease",
                pointerEvents: showCompactHeader ? "auto" : "none",
                visibility: showCompactHeader ? "visible" : "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 2,
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
                    Origen: {searchData?.pickupLocation?.name || "No seleccionado"}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
                    Destino:{" "}
                    {searchData?.sameOffice
                        ? "Misma oficina"
                        : searchData?.returnLocation?.name || "No seleccionado"}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", fontSize: "1.1rem" }}>
                    {searchData?.pickupDate &&
                        `${format(searchData.pickupDate, "dd/MM/yyyy")} ${searchData.pickupTime} → ${format(
                            searchData.returnDate,
                            "dd/MM/yyyy"
                        )} ${searchData.returnTime}`}
                </Typography>
                <Tooltip title="Volver arriba" arrow>
                    <Box
                        sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: "-75%",
                            transform: "translate(-50%, 50%)",
                            background: "white",
                            width: 40,
                            height: 40,
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
                        <ArrowUpwardIcon sx={{ color: "#10906a", fontSize: 20 }} />
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default CompactHeader;
