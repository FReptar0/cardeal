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
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

// Base con metadatos de cada plan de seguro
const basePlanesSeguros = [
  {
    id: "none",
    nombre: "RESPONSABILIDAD LIMITADA",
    total: "0",
    color: "#999",
    code: "", // No hay código TSD para "none"
    coberturas: [
      "Colisión y daños: RESPONSABLE 100%",
      "Responsabilidad Civil: HASTA 350 MIL MXN",
      "Protección de Robo: RESPONSABLE 100%",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
      "Gastos médicos ocupantes: HASTA 250 MIL MXN",
      "Asistencia Vial: NO INCLUYE",
    ],
  },
  {
    id: "basico",
    nombre: "PAQUETE BÁSICO",
    total: "0",

    color: "#10906a",
    code: "CDW2", // Código TSD estándar
    coberturas: [
      "Colisión y daños: RESPONSABLE 20%",
      "Responsabilidad Civil: CUBRE 350 MIL MXN",
      "Protección de Robo: RESPONSABLE 20%",
      "Asistencia Vial: NO INCLUYE",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
      "Gastos médicos ocupantes: HASTA 250 MIL MXN",
    ],
  },
  {
    id: "intermedio",
    nombre: "PAQUETE ESTÁNDAR",
    total: "0",

    color: "#10906a",
    code: "CDW", // Código TSD estándar
    coberturas: [
      "Colisión y daños: RESPONSABLE 10%",
      "Responsabilidad Civil: CUBRE 700 MIL MXN",
      "Protección de Robo: RESPONSABLE 10%",
      "Gastos médicos ocupantes: HASTA 500 MIL MXN",
      "Asistencia Vial: HASTA 40 KM",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
    ],
  },
  {
    id: "completo",
    nombre: "PAQUETE PREMIUM",
    total: "0",

    color: "#10906a",
    code: "PDW", // Código TSD estándar
    recomendado: true,
    coberturas: [
      "Colisión y daños: RESPONSABLE 5%",
      "Responsabilidad Civil: CUBRE 700 MIL MXN",
      "Protección de Robo: RESPONSABLE 5%",
      "Gastos médicos ocupantes: COBERTURA 500 MIL MXN",
      "Asistencia Vial: HASTA 100 KM",
      "Depósito en garantía: DE ACUERDO A LA CATEGORÍA",
    ],
  },
];

const getPlanesSeguros = (carCategoryRaw) => {
  const carCategory = (carCategoryRaw || "").trim().toUpperCase();
  const preciosBajos = { basico: 1, intermedio: 1, completo: 1 };
  const preciosAltos = { basico: 1, intermedio: 1, completo: 1 };

  const esSUV =
    carCategory === "SFAR" ||
    carCategory === "FFAR" ||
    carCategory === "SUV 5 STANDARD" ||
    carCategory === "SUV 5 LX";

  const precios = esSUV ? preciosAltos : preciosBajos;

  return basePlanesSeguros.map((plan) => {
    let codeTSD = plan.code;
    if (esSUV && plan.code) {
      if (plan.id === "basico") codeTSD = "CDW 2 SUV";
      else if (plan.id === "intermedio") codeTSD = "CDW SUV";
      else if (plan.id === "completo") codeTSD = "PDW SUV";
    }

    let totalPlaceholder = "0";
    if (plan.id === "basico") totalPlaceholder = precios.basico;
    if (plan.id === "intermedio") totalPlaceholder = precios.intermedio;
    if (plan.id === "completo") totalPlaceholder = precios.completo;

    return {
      ...plan,
      total: totalPlaceholder,
      codeTSD,
    };
  });
};

// Map car categories to protection folders
const categoryToFolderMap = {
  ECONOMICO: "economico",
  COMPACTO: "compacto",
  FULLSIZE: "fullsize",
  "SUV 5": "suv_5",
  "SUV 5 LX": "suv_5_lx",
};

// Adjusted function to dynamically get the image path based on category and plan ID
const getDynamicImagePath = (category, planId) => {
  if (!category) {
    console.error("La categoría seleccionada es nula o indefinida.");
    return "/Protecciones/default/default_cero.jpg";
  }

  const normalizedCategory = category.toUpperCase().trim();
  const folder = categoryToFolderMap[normalizedCategory];

  if (!folder) {
    console.error(
      `La categoría '${normalizedCategory}' no está mapeada en categoryToFolderMap.`
    );
    return "/Protecciones/default/default_cero.jpg";
  }

  const planImageMap = {
    none: `${folder}_cero.jpg`,
    basico: `${folder}_80.jpg`,
    intermedio: `${folder}_90.jpg`,
    completo: `${folder}_95.jpg`,
  };

  const imagePath = `/Protecciones/${folder}/${planImageMap[planId]}`;

  console.log("Categoría seleccionada (normalizada):", normalizedCategory);
  console.log("Plan ID:", planId);
  console.log("Carpeta generada:", folder);
  console.log("Ruta generada:", imagePath);

  return imagePath;
};

const SeguroVehiculo = () => {
  const { selectedInsurance, setSelectedInsurance, selectedCar } = useBooking();
  const { searchData } = useSearch();
  const router = useRouter();

  const [openWarning, setOpenWarning] = useState(false);
  const [openRecommendation, setOpenRecommendation] = useState(false);
  const [recommendedPlan, setRecommendedPlan] = useState(null);

  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);

  const [proteccionesDisponibles, setProteccionesDisponibles] = useState([]);
  const [loadingProtecciones, setLoadingProtecciones] = useState(true);

  // Obtenemos el arreglo de planes con placeholders y codeTSD dinámico
  const effectivePlanesSeguros = getPlanesSeguros(
    selectedCar?.abbreviation || ""
  );

  useEffect(() => {
    if (
      selectedCar?.abbreviation &&
      searchData?.pickupLocation?.id &&
      searchData?.returnLocation?.id &&
      searchData?.pickupDate &&
      searchData?.returnDate &&
      searchData?.pickupTime &&
      searchData?.returnTime
    ) {
      const fetchProtecciones = async () => {
        setLoadingProtecciones(true);

        const payload = {
          pickupLocationId: searchData.pickupLocation.id,
          returnLocationId: searchData.sameOffice
            ? searchData.pickupLocation.id
            : searchData.returnLocation.id,
          pickupDateTime: `${searchData.pickupDate} ${searchData.pickupTime}`,
          returnDateTime: `${searchData.returnDate} ${searchData.returnTime}`,
          classCode: selectedCar.abbreviation,
        };

        console.log("📤 [front] Body para /api/carInsurance:", payload);

        try {
          const response = await fetch("/api/carInsurance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            console.error(
              "❌ [front] /api/carInsurance devolvió status:",
              response.status
            );
            setProteccionesDisponibles([]);
            setLoadingProtecciones(false);
            return;
          }

          const data = await response.json();
          console.log("📥 [front] Respuesta JSON de /api/carInsurance:", data);

          const rentalDays =
            searchData && searchData.pickupDate && searchData.returnDate
              ? Math.ceil(
                  (new Date(searchData.returnDate) -
                    new Date(searchData.pickupDate)) /
                    (1000 * 60 * 60 * 24)
                )
              : 1;

          console.log("🔢 [front] rentalDays calculados:", rentalDays);

          const proteccionesConPrecioPorDia = data.map((extra) => {
            const precioDia =
              rentalDays > 0
                ? parseFloat((extra.precioTotal / rentalDays).toFixed(2))
                : parseFloat(extra.precioTotal.toFixed(2));
            return {
              codeExtras: extra.codeExtras,
              precioDia,
            };
          });

          console.log(
            "🗂️ [front] proteccionesConPrecioPorDia:",
            proteccionesConPrecioPorDia
          );
          setProteccionesDisponibles(proteccionesConPrecioPorDia);
        } catch (error) {
          console.error(
            "❌ [front] Error al llamar a /api/carInsurance:",
            error
          );
          setProteccionesDisponibles([]);
        } finally {
          setLoadingProtecciones(false);
        }
      };

      fetchProtecciones();
    }
  }, [
    selectedCar?.abbreviation,
    searchData?.pickupLocation?.id,
    searchData?.returnLocation?.id,
    searchData?.pickupDate,
    searchData?.pickupTime,
    searchData?.returnDate,
    searchData?.returnTime,
    searchData?.sameOffice,
  ]);

  // Log the selected car and image paths for each insurance plan
  const planesConPrecioDinamico = React.useMemo(() => {
    // console.log("Carro seleccionado:", selectedCar);
    return effectivePlanesSeguros.map((plan) => {
      if (plan.id === "none") {
        return { ...plan, total: "0.00" };
      }
      const match = proteccionesDisponibles.find(
        (p) => p.codeExtras === plan.codeTSD
      );
      const precio = match ? match.precioDia : 0;
      const imagen = getDynamicImagePath(selectedCar?.category, plan.id);
      // console.log(`Imagen para el plan ${plan.id}:`, imagen);
      return {
        ...plan,
        total: precio.toFixed(2),
        imagen, // Dynamic image
      };
    });
  }, [effectivePlanesSeguros, proteccionesDisponibles, selectedCar?.category]);

  // —————————————————————————————————————————————————————————————————————————
  // Opción 1: seleccionar “Premium” solo cuando loadingProtecciones === false
  useEffect(() => {
    if (
      !selectedInsurance &&
      !loadingProtecciones &&
      planesConPrecioDinamico.length > 0
    ) {
      const premiumPlan = planesConPrecioDinamico.find(
        (plan) => plan.id === "completo"
      );
      if (premiumPlan) {
        setSelectedInsurance({ ...premiumPlan, code: premiumPlan.codeTSD });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planesConPrecioDinamico, loadingProtecciones]);
  // —————————————————————————————————————————————————————————————————————————

  const handleSelect = (plan) => {
    if (plan.id === "none" || plan.total !== "0.00") {
      setSelectedInsurance({ ...plan, code: plan.code });
      console.log("✅ [front] Plan seleccionado:", plan);

      const planIndex = planesConPrecioDinamico.findIndex(
        (p) => p.id === plan.id
      );
      const nextPlan =
        planIndex < planesConPrecioDinamico.length - 1
          ? planesConPrecioDinamico[planIndex + 1]
          : null;
      if (nextPlan) {
        setRecommendedPlan(nextPlan);
        setOpenRecommendation(true);
      }
    }
  };

  const handleContinue = () => {
    if (!selectedInsurance) {
      setOpenWarning(true);
    } else {
      console.log(
        "➡️ [front] Continuando con el seguro seleccionado:",
        selectedInsurance
      );
      router.push("/extras-renta");
    }
  };

  const handleSelectNextPlan = () => {
    if (recommendedPlan) {
      setSelectedInsurance(recommendedPlan);
    }
    setOpenRecommendation(false);
  };

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center", marginTop: "148px" }}>
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
          <SearchBar onValuesChange={() => {}} />
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

      <Typography variant="h4" fontWeight="bold">
        Elige un tipo de protección
      </Typography>
      <Typography variant="body1" mb={4}>
        que se va a cubrir al rentar un carro
      </Typography>

      {loadingProtecciones ? (
        <Box
          sx={{
            height: "20vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">Cargando protecciones…</Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          wrap="wrap"
          justifyContent="center"
          alignItems="stretch"
        >
          {planesConPrecioDinamico.map((plan) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <Card
                sx={{
                  minWidth: { xs: "auto", md: 320 },
                  boxShadow: selectedInsurance?.id === plan.id ? 6 : 2,
                  border:
                    selectedInsurance?.id === plan.id
                      ? "3px solid black"
                      : "1px solid #ddd",
                  cursor:
                    plan.id === "none" || plan.total !== "0.00"
                      ? "pointer"
                      : "not-allowed",
                  p: 3,
                  backgroundColor: "#fff",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform:
                      plan.id === "none" || plan.total !== "0.00"
                        ? "scale(1.05)"
                        : "none",
                  },
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
                  sx={{
                    color: plan.total === "0.00" ? "gray" : "black",
                    display: "inline",
                  }}
                >
                  {plan.total}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: plan.total === "0.00" ? "gray" : "gray",
                    display: "inline",
                    ml: 1,
                  }}
                >
                  MXN/día
                </Typography>

                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                    objectFit: "contain",
                    p: 1,
                  }}
                  image={plan.imagen}
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

                  {plan.coberturas.map((detalle, index) => {
                    const isNoIncluye = detalle
                      .toLowerCase()
                      .includes("no incluye");
                    return (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon>
                          {isNoIncluye ? (
                            <CancelIcon
                              sx={{
                                color: (theme) =>
                                  theme.palette.secondary.buttons,
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
                          primaryTypographyProps={{
                            style: { fontSize: "14px" },
                          }}
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
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          pb: 3,
        }}
      >
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
              backgroundColor: (theme) => theme.palette.primary.main,
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
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              maxHeight: "300px",
              maxWidth: "300px",
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

          <Box sx={{ flex: 2, textAlign: "justify" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "16px", lineHeight: 1.6, mb: 2 }}
            >
              Disminuye tu Depósito en Garantía y Deducible, te ofrecemos el{" "}
              <strong>{recommendedPlan ? recommendedPlan.nombre : ""}</strong>
            </Typography>

            <Typography
              variant="body1"
              sx={{ fontSize: "16px", lineHeight: 1.6, mb: 3 }}
            >
              Te recomendamos considerar el{" "}
              <strong>{recommendedPlan ? recommendedPlan.nombre : ""}</strong>{" "}
              por sólo{" "}
              <strong>{recommendedPlan ? recommendedPlan.total : ""}</strong>{" "}
              MXN/día. Este paquete incluye coberturas adicionales para tu
              tranquilidad durante el viaje.
            </Typography>
          </Box>
        </DialogContent>

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
              mb: 2,
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
