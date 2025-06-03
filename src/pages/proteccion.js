"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
// Importa el hook del contexto global
import { useBooking } from "../contexts/BookingContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

// Se reemplazan las coberturas de cada plan con la información de tu tabla
const basePlanesSeguros = [
  {
    id: "none",
    nombre: "RESPONSABILIDAD LIMITADA",
    total: "$0",
    imagen: "/images-seguros/Seguro-cero.png",
    color: "#999",
    code: "",
    coberturas: [
      "Colisión y daños: RESPONSABLE 100%",
      "Responsabilidad Civil: RASGO 300 MIL",
      "Protección de Robo: RESPONSABLE 100%",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
      "Gastos médicos ocupantes: NO INCLUYE",
      "Asistencia Vial: NO INCLUYE",
    ],
  },
  {
    id: "basico",
    nombre: "PAQUETE BÁSICO", // Equivale a PROTECCIÓN CDW 80%
    total: "$610",
    imagen: "/images-seguros/Seguro-basico.png",
    color: "#10906a",
    code: "CDW2",
    coberturas: [
      "Colisión y daños: RESPONSABLE 20%",
      "Responsabilidad Civil: CUBRE 300 MIL",
      "Protección de Robo: RESPONSABLE 20%",
      "Asistencia Vial: SI INCLUYE",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
      "Gastos médicos ocupantes: NO INCLUYE",
    ],
  },
  {
    id: "intermedio",
    nombre: "PAQUETE ESTÁNDAR", // Equivale a PROTECCIÓN CDW 90%
    total: "$710",
    imagen: "/images-seguros/Seguro-inter.png",
    color: "#10906a",
    code: "CDW",
    coberturas: [
      "Colisión y daños: RESPONSABLE 10%",
      "Responsabilidad Civil: CUBRE 300 MIL",
      "Protección de Robo: RESPONSABLE 10%",
      "Gastos médicos ocupantes: COBERTURA 100 MIL",
      "Asistencia Vial: SI INCLUYE",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
    ],
  },
  {
    id: "completo",
    nombre: "PAQUETE PREMIUM", // Equivale a PROTECCIÓN PDW 95%
    total: "$890",
    imagen: "/images-seguros/Seguro-completo.png",
    color: "#10906a",
    code: "PDW",
    recomendado: true,
    coberturas: [
      "Colisión y daños: RESPONSABLE 5%",
      "Responsabilidad Civil: CUBRE 300 MIL",
      "Protección de Robo: RESPONSABLE 5%",
      "Gastos médicos ocupantes: COBERTURA 100 MIL",
      "Asistencia Vial: SI INCLUYE",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
    ],
  },
];

// Ajusta los precios de los planes según la categoría de auto seleccionada
const getPlanesSeguros = (carCategory) => {
  const preciosBajos = {
    basico: "$610",
    intermedio: "$710",
    completo: "$890",
  };
  const preciosAltos = {
    basico: "$610",
    intermedio: "$740",
    completo: "$917",
  };

  let precios = preciosBajos;
  if (carCategory === "SUV 5 STANDARD" || carCategory === "SUV 5 LX") {
    precios = preciosAltos;
  }

  return basePlanesSeguros.map((plan) => {
    if (plan.id === "basico") {
      return { ...plan, total: precios.basico };
    } else if (plan.id === "intermedio") {
      return { ...plan, total: precios.intermedio };
    } else if (plan.id === "completo") {
      return { ...plan, total: precios.completo };
    }
    return plan;
  });
};

const SeguroVehiculo = () => {
  // Usamos el contexto global
  const { selectedInsurance, setSelectedInsurance, selectedCar } = useBooking();

  const [openWarning, setOpenWarning] = useState(false);
  const [openRecommendation, setOpenRecommendation] = useState(false);
  const [recommendedPlan, setRecommendedPlan] = useState(null);
  const router = useRouter();

  // Estados para header y SearchBar
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Planes ajustados según la categoría del auto
  const effectivePlanesSeguros = getPlanesSeguros(selectedCar?.category);

  // Seleccionar "premium" por defecto si no hay uno seleccionado
  useEffect(() => {
    if (!selectedInsurance) {
      const premiumPlan = effectivePlanesSeguros.find(
        (plan) => plan.id === "completo"
      );
      if (premiumPlan) {
        setSelectedInsurance({ ...premiumPlan, code: premiumPlan.code });
      }
    }
    // Solo debe correr cuando effectivePlanesSeguros cambia o selectedInsurance es null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePlanesSeguros]);

  // Seleccionar un plan
  const handleSelect = (plan) => {
    setSelectedInsurance({
      ...plan,
      code: plan.code,
    });
    console.log("Plan seleccionado:", plan);
    const planIndex = effectivePlanesSeguros.findIndex((p) => p.id === plan.id);
    const nextPlan =
      planIndex < effectivePlanesSeguros.length - 1
        ? effectivePlanesSeguros[planIndex + 1]
        : null;
    if (nextPlan) {
      setRecommendedPlan(nextPlan);
      setOpenRecommendation(true);
    }
  };

  // Continuar
  const handleContinue = () => {
    if (!selectedInsurance) {
      setOpenWarning(true);
    } else {
      console.log("Continuar con el seguro seleccionado:", selectedInsurance);
      router.push("/extras-renta");
    }
  };

  // Aceptar recomendación de upgrade
  const handleSelectNextPlan = () => {
    if (recommendedPlan) {
      setSelectedInsurance(recommendedPlan);
    }
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

      {/* Listado de planes */}
      <Grid
        container
        spacing={3}
        wrap="wrap"
        justifyContent="center"
        alignItems="stretch"
      >
        {effectivePlanesSeguros.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.id}>
            <Card
              sx={{
                minWidth: { xs: "auto", md: 320 },
                boxShadow: selectedInsurance?.id === plan.id ? 6 : 2,
                border:
                  selectedInsurance?.id === plan.id
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

              {/* Precio */}
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

                {/* Render de cada línea de cobertura */}
                {plan.coberturas.map((detalle, index) => {
                  // Muestra CancelIcon si la línea contiene "NO INCLUYE"
                  const isNoIncluye = detalle
                    .toLowerCase()
                    .includes("no incluye");
                  return (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon>
                        {isNoIncluye ? (
                          <CancelIcon
                            sx={{
                              color: (theme) => theme.palette.secondary.buttons,
                            }}
                          />
                        ) : (
                          <CheckCircleIcon
                            sx={{
                              color: (theme) => theme.palette.primary.buttons,
                            }}
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ style: { fontSize: "14px" } }}
                        primary={detalle}
                      />
                    </ListItem>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón continuar */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.buttons,
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

      {/* Diálogo de advertencia si no se selecciona un seguro */}
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
              backgroundColor: (theme) => theme.palette.secondary.main,
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

      {/* Diálogo de recomendación para subir de plan */}
      <Dialog
        open={openRecommendation}
        onClose={() => setOpenRecommendation(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: 8,
            maxWidth: "650px",
            padding: 4,
            width: "90%",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pt: 0,
            pb: 2,
            px: 3,
            maxHeight: "90vh", // Limitar la altura máxima del contenido
            overflow: "auto", // Habilitar scroll si es necesario
          }}
        >
          {/* Contenedor de la imagen */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              maxHeight: "300px", // Tamaño máximo para evitar scroll
              maxWidth: "300px", // Tamaño máximo para evitar scroll
            }}
          >
            <Box
              component="img"
              src="/bot/Bot-IA-Alpha-Escudo.webp"
              alt="Recomendación Icono"
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Contenedor del texto */}
          <Box sx={{ flex: 2, textAlign: "justify" }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Disminuye tu Depósito en Garantía y Disminuye tu Deducible, te
              ofrecemos el{" "}
              <strong>{recommendedPlan ? recommendedPlan.nombre : ""}</strong>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Te recomendamos considerar el{" "}
              <strong>{recommendedPlan ? recommendedPlan.nombre : ""}</strong>{" "}
              por solo{" "}
              <strong>{recommendedPlan ? recommendedPlan.total : ""}</strong> al
              día. Este paquete incluye coberturas adicionales que te darán
              mayor tranquilidad, seguridad y respaldo durante tu viaje.
            </Typography>
          </Box>
        </DialogContent>

        {/* Contenedor de los botones */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              fontWeight: "bold",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              mb: 2, // Margen inferior entre botones
            }}
            onClick={handleSelectNextPlan}
          >
            SELECCIONAR{" "}
            {recommendedPlan ? recommendedPlan.nombre.toUpperCase() : ""}
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => setOpenRecommendation(false)}
          >
            Mantener protección actual
          </Typography>
        </Box>
      </Dialog>
    </Container>
  );
};

export default SeguroVehiculo;
