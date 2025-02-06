import { useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Button } from "@mui/material";
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

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold">Elige el tipo de seguro</Typography>
      <Typography variant="body1" mb={4}>que se va a cubrir al rentar un carro</Typography>

      <Grid container spacing={3} justifyContent="center">
        {planesSeguros.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                border: seleccionado === plan.id ? "3px solid red" : "1px solid #ddd",
                boxShadow: seleccionado === plan.id ? 6 : 2,
                cursor: "pointer",
                padding: 3,
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                '&:hover': { transform: "scale(1.05)" },
                borderRadius: "10px",
                position: "relative",
                height: "100%",
              }}
              onClick={() => setSeleccionado(plan.id)}
            >
              {plan.recomendado && (
                <Box sx={{ position: "absolute", top: -10, right: -10, background: "black", color: "white", padding: "5px 10px", borderRadius: "5px" }}>
                  Recomendado
                </Box>
              )}
              <Typography variant="h6" fontWeight="bold" sx={{ color: "black", p: 1 }}>{plan.total} <InfoIcon fontSize="small" /></Typography>
              <CardMedia component="img" sx={{ height: 200, objectFit: "contain", padding: 1 }} image={plan.imagen} alt={plan.nombre} />
              <CardContent>
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
                <Button variant="outlined" sx={{ mt: 2, borderColor: "red", color: "red", fontWeight: "bold" }}>
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
