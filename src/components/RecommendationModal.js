import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";
import Image from "next/image";

export default function RecommendationModal({ open, onClose, recommendedCar, onSelect, onKeep }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: 8,
          maxWidth: "500px",
          width: "90%",
        },
      }}
    >
      <Box sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>
          RECOMENDACIÓN
        </Typography>
      </Box>
      <DialogContent sx={{ pt: 0, pb: 3, px: 3, textAlign: "center" }}>
        {recommendedCar && (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1, mb: 1 }}>
              <Image
                src={recommendedCar.image}
                alt={recommendedCar.name}
                width={300}
                height={180}
                style={{
                  maxWidth: "300px",
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
                unoptimized
              />
            </Box>
            <Typography variant="body1" sx={{ textAlign: "justify", fontSize: "16px", lineHeight: 1.6, mb: 3 }}>
              Te recomendamos considerar el <strong>{recommendedCar.category}</strong> ({recommendedCar.name})
              que ofrece mayores prestaciones por un precio competitivo.
            </Typography>
            <Button
              onClick={onSelect}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "primary.buttons",
                color: "white",
                fontWeight: "bold",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              SELECCIONAR {recommendedCar.category?.toUpperCase()}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={onKeep}
              >
                Mantener la selección actual
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
