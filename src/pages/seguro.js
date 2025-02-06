import { useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const planesSeguros = [
  {
    id: "basico",
    nombre: "PAQUETE BASICO",
    precio: "$539.92 MXN/DÍA",
    total: "$8,000.00 MXN",
    imagen: "/images-seguros/camry1.png",
    color: "#E53935",
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo"
    ],
  },
  {
    id: "intermedio",
    nombre: "PAQUETE ESTANDAR",
    precio: "$1009.20 MXN/DÍA",
    total: "$6,000.00 MXN",
    imagen: "/images-seguros/camry2.png",
    color: "#E53935",
    coberturas: [
      "Colisión y daños",
      "Asistencia Vial",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes",
      "Responsabilidad Civil",
      "Protección de Robo"
    ],
  },
  {
    id: "completo",
    nombre: "PAQUETE PREMIUM",
    precio: "$1444.60 MXN/DÍA",
    total: "$3,000.00 MXN",
    imagen: "/images-seguros/camry3.png",
    color: "#E53935",
    recomendado: true,
    coberturas: [
      "Colisión y daños",
      "Cobertura 0% Deducible",
      "Asistencia Vial",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes",
      "Responsabilidad Civil",
      "Protección de Robo"
    ],
  },
];

const SeguroVehiculo = () => {
  const [seleccionado, setSeleccionado] = useState(null);
  const [recomendado, setRecomendado] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const handleSelect = (plan) => {
    setSeleccionado(plan.id);
    const siguientePlan = planesSeguros.find((p, index) => p.id === plan.id && index < planesSeguros.length - 1);
    if (siguientePlan) {
      setRecomendado(siguientePlan);
      setOpenPopup(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold">Elige el tipo de seguro</Typography>
      <Typography variant="body1" mb={4}>que se va a cubrir al rentar un carro</Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {planesSeguros.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                boxShadow: seleccionado === plan.id ? 6 : 2,
                cursor: "pointer",
                padding: 3,
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                '&:hover': { transform: "scale(1.05)" },
                borderRadius: "10px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
              onClick={() => handleSelect(plan)}
            >
              {plan.recomendado && (
                <Box sx={{ position: "absolute", top: 0, right: -8, padding: "10px 14px", background: "black", color: "white", padding: "6px 12px", borderRadius: "5px" }}>
                  Recomendado
                </Box>
              )}
              <Typography variant="h6" fontWeight="bold" sx={{ color: "black", p: 1 }}>{plan.total} <InfoIcon fontSize="small" /></Typography>
              <CardMedia component="img" sx={{ height: 200, objectFit: "contain", padding: 1 }} image={plan.imagen} alt={plan.nombre} />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: plan.color, mb: 1 }}>{plan.nombre}</Typography>
                <Grid container spacing={1}>
                  {plan.coberturas.map((cobertura, index) => (
                    <Grid item xs={12} key={index}>
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <CheckCircleIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ style: { fontSize: '14px' } }} primary={cobertura} />
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 4 }} />
                <Button variant="contained" sx={{ mt: 'auto', backgroundColor: "red", color: "white", fontWeight: "bold", borderRadius: "20px", padding: "10px 20px", width: "100%" }}>
                  Elegir por {plan.precio}
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SeguroVehiculo;
