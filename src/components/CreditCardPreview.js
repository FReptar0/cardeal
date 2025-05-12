import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const CardContainer = styled(Box)({
  width: "300px",
  height: "180px",
  perspective: "1000px",
});

const CardInner = styled(Box, {
  shouldForwardProp: (prop) => prop !== "flipped",
})(({ flipped }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
}));

const CardFace = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  backfaceVisibility: "hidden",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
});

const CardFront = styled(CardFace)({
  background: "linear-gradient(135deg,#4b79a1,#283e51)",
  color: "white",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const CardBack = styled(CardFace)({
  background: "linear-gradient(135deg,#283e51,#4b79a1)",
  transform: "rotateY(180deg)",
  color: "white",
  padding: "16px",
});

export default function CreditCardPreview({
  number,
  name,
  expiry,
  cvc,
  focused,
}) {
  const formattedNumber = number
    .padEnd(16, "•")
    .replace(/(.{4})/g, "$1 ")
    .trim();
  const formattedExpiry = expiry || "MM/YY";
  const displayName = (name || "NOMBRE APELLIDO").toUpperCase();

  return (
    <CardContainer>
      <CardInner flipped={focused === "cvc"}>
        <CardFront>
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: "0.75rem" }}>
              NÚMERO DE TARJETA
            </Typography>
            <Typography variant="h6" sx={{ letterSpacing: "2px", mt: 1 }}>
              {formattedNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontSize: "0.75rem" }}>
                TITULAR
              </Typography>
              <Typography
                variant="body1"
                sx={{ textTransform: "uppercase", mt: 0.5 }}
              >
                {displayName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontSize: "0.75rem" }}>
                EXPIRA
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {formattedExpiry}
              </Typography>
            </Box>
          </Box>
        </CardFront>

        <CardBack>
          <Box sx={{ background: "#000", height: "40px", mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Box
              sx={{
                background: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              <Typography variant="body1" color="textPrimary">
                {cvc || "•••"}
              </Typography>
            </Box>
          </Box>
        </CardBack>
      </CardInner>
    </CardContainer>
  );
}
