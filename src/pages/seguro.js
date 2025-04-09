"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RentalStepper from "../components/Stepper";
import CompactHeader from "../components/CompactHeader";
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

const todasLasCoberturas = [
  "Colisión y daños",
  "Responsabilidad Civil",
  "Protección de Robo",
  "Cristales y Llantas",
  "Gastos Médicos Ocupantes",
  "Cobertura 0% Deducible",
  "Asistencia Vial",
];

const planesSeguros = [
  {
    id: "none",
    nombre: "SIN PROTECCIÓN",
    total: "$0",
    imagen: "/images-seguros/Seguro-cero.png",
    color: "#999",
    coberturas: [],
  },
  {
    id: "basico",
    nombre: "PAQUETE BÁSICO",
    total: "$570",
    imagen: "/images-seguros/Seguro-basico.png",
    color: "#d60812",
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo",
    ],
  },
  {
    id: "intermedio",
    nombre: "PAQUETE ESTÁNDAR",
    total: "$710",
    imagen: "/images-seguros/Seguro-inter.png",
    color: "#d60812",
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes",
    ],
  },
  {
    id: "completo",
    nombre: "PAQUETE PREMIUM",
    total: "$890",
    imagen: "/images-seguros/Seguro-completo.png",
    color: "#d60812",
    recomendado: true,
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo",
      "Cobertura 0% Deducible",
      "Asistencia Vial",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes",
    ],
  },
];

const SeguroVehiculo = () => {
  const [seleccionado, setSeleccionado] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);
  const [openRecommendation, setOpenRecommendation] = useState(false);
  const [recommendedPlan, setRecommendedPlan] = useState(null);

  const router = useRouter();
  // Estados para el header
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  // Datos de la SearchBar
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Se obtiene el estado del header desde localStorage
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (plan) => {
    setSeleccionado(plan.id);
    const planIndex = planesSeguros.findIndex((p) => p.id === plan.id);
    const nextPlan =
      planIndex < planesSeguros.length - 1
        ? planesSeguros[planIndex + 1]
        : null;
    if (nextPlan) {
      setRecommendedPlan(nextPlan);
      setOpenRecommendation(true);
    }
  };

  const handleContinue = () => {
    if (!seleccionado) {
      setOpenWarning(true);
    } else {
      console.log("Continuar con el seguro seleccionado:", seleccionado);
      router.push("/extras-renta");
    }
  };

  const handleSelectNextPlan = () => {
    setSeleccionado(recommendedPlan.id);
    setOpenRecommendation(false);
  };

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center", marginTop: "148px" }}>
      {/* Sección de búsqueda */}
      <Box
        sx={{
          overflow: "hidden",
          maxHeight: hideSearchSection ? 0 : "1000px",
          opacity: hideSearchSection ? 0 : 1,
          transform: hideSearchSection ? "translateY(-20px)" : "translateY(0)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            gap: 1,
          }}
        >
          <SearchBar onValuesChange={setSearchData} />
        </Box>
      </Box>

      <CompactHeader
        searchData={searchData}
        headerIsTop={headerIsTop}
        showCompactHeader={showCompactHeader}
      />

      {showCompactHeader && (
        <Box sx={{ height: "50px", transition: "height 0.3s ease" }} />
      )}

      <Box sx={{ width: "100%", marginTop: -12 }}>
        <RentalStepper />
      </Box>

      {isSticky && <Box sx={{ height: "120px" }} />}

      <Typography variant="h4" fontWeight="bold">
        Elige un tipo de protección
      </Typography>
      <Typography variant="body1" mb={4}>
        que se va a cubrir al rentar un carro
      </Typography>

      <Grid
        container
        spacing={3}
        wrap="wrap"
        justifyContent="center"
        alignItems="stretch"
      >
        {planesSeguros.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.id}>
            <Card
              sx={{
                // En escritorio, se define un ancho mínimo mayor para que sean "más anchas"
                minWidth: { xs: "auto", md: 320 },
                boxShadow: seleccionado === plan.id ? 6 : 2,
                border:
                  seleccionado === plan.id
                    ? "3px solid black"
                    : "1px solid #ddd",
                cursor: "pointer",
                p: 3,
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
                borderRadius: "10px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onClick={() => handleSelect(plan)}
            >
              {plan.recomendado && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: -8,
                    p: "6px 12px",
                    background: "black",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Recomendado
                </Box>
              )}
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "black", display: "inline" }}
              >
                {plan.total.split(" ")[0]}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "gray", display: "inline", ml: 1 }}
              >
                MXN/día
              </Typography>
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: "contain", p: 1 }}
                image={plan.imagen}
                alt={plan.nombre}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: plan.color, mb: 1 }}
                >
                  {plan.nombre}
                </Typography>
                {todasLasCoberturas.map((cobertura, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      {plan.coberturas.includes(cobertura) ? (
                        <CheckCircleIcon color="error" />
                      ) : (
                        <CancelIcon sx={{ color: "gray" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ style: { fontSize: "14px" } }}
                      primary={cobertura}
                    />
                  </ListItem>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d60812",
            color: "white",
            fontWeight: "bold",
            p: "12px 30px",
            fontSize: "16px",
          }}
          onClick={handleContinue}
        >
          CONTINUAR
        </Button>
      </Box>

      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          🚨 ATENCIÓN 🚨
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Para tu seguridad y tranquilidad, es <strong>OBLIGATORIO</strong>{" "}
            seleccionar una protección antes de continuar con tu reserva.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenWarning(false)}
            variant="contained"
            sx={{
              backgroundColor: "#d60812",
              color: "white",
              fontWeight: "bold",
              p: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            ESCOGER UNA PROTECCIÓN
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRecommendation}
        onClose={() => setOpenRecommendation(false)}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          RECOMENDACIÓN
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "16px",
              lineHeight: "1.5",
              mt: 2,
            }}
          >
            Te recomendamos considerar el{" "}
            <strong>{recommendedPlan?.nombre}</strong> por solo{" "}
            <strong>{recommendedPlan?.total}</strong> al día, que incluye
            coberturas adicionales para mayor tranquilidad.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenRecommendation(false)}
            variant="outlined"
            sx={{
              color: "grey",
              fontWeight: "bold",
              p: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              borderColor: "grey",
            }}
          >
            Mantener seguro actual
          </Button>
          <Button
            onClick={handleSelectNextPlan}
            variant="contained"
            sx={{
              backgroundColor: "#d60812",
              color: "white",
              fontWeight: "bold",
              p: "12px 20px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            Seleccionar {recommendedPlan?.nombre}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeguroVehiculo;
