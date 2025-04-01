import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from "next/router";
import RentalStepper from "../components/Stepper";
import SearchBar from "../components/SearchBar";

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
    imagen: "/images-seguros/Seguro-cero.png", // imagen para sin protección
    color: "#999", // color neutro
    coberturas: [], // sin coberturas
  },
  {
    id: "basico",
    nombre: "PAQUETE BÁSICO",
    total: "$350",
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
    total: "$550",
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
    total: "$850",
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

  const handleSelect = (plan) => {
    setSeleccionado(plan.id);
    const nextPlan = planesSeguros.find((p) => p.id === getNextPlanId(plan.id));
    if (nextPlan) {
      setRecommendedPlan(nextPlan);
      setOpenRecommendation(true);
    }
  };

  const getNextPlanId = (currentPlanId) => {
    const planIndex = planesSeguros.findIndex(
      (plan) => plan.id === currentPlanId
    );
    return planIndex < planesSeguros.length - 1
      ? planesSeguros[planIndex + 1].id
      : null;
  };

  const handleContinue = () => {
    if (!seleccionado) {
      setOpenWarning(true);
    } else {
      console.log("Continuar con el seguro seleccionado: ", seleccionado);
      router.push("/extras-renta");
    }
  };

  const handleSelectNextPlan = () => {
    setSeleccionado(recommendedPlan.id);
    setOpenRecommendation(false);
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", marginTop: "148px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          gap: 1,
        }}
      >
        <SearchBar
          sx={{
            width: "100%",
            transition: "all 0.3s ease-in-out",
            marginBottom: 0,
          }}
        />

        <Box sx={{ width: "100%", marginTop: -12 }}>
          <RentalStepper />
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold">
        Elige un tipo de protección
      </Typography>
      <Typography variant="body1" mb={4}>
        que se va a cubrir al rentar un carro
      </Typography>

      {/* Grid container sin wrap para mantener las cards en una sola fila */}
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        justifyContent="center"
        alignItems="stretch"
      >
        {planesSeguros.map((plan) => (
          // Se mantienen las propiedades responsivas y se evita que se encojan
          <Grid item sx={{ flexShrink: 0 }} xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                boxShadow: seleccionado === plan.id ? 6 : 2,
                border:
                  seleccionado === plan.id
                    ? "3px solid black"
                    : "1px solid #ddd",
                cursor: "pointer",
                padding: 3,
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
                    padding: "6px 12px",
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
                sx={{ height: 200, objectFit: "contain", padding: 1 }}
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
            padding: "12px 30px",
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
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "16px",
              lineHeight: "1.5",
              mt: 2,
            }}
          >
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
              padding: "12px 20px",
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
              padding: "12px 20px",
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
              padding: "12px 20px",
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
