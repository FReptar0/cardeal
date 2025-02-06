import { useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const planesSeguros = [
  {
    id: "basico",
    nombre: "PAQUETE BASICO",
    precio: "$539.92 MXN/DÍA",
    total: "$8,000.00 MXN",
    imagen: "/images-seguros/camry1.png",
    color: "#d60812",
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
    color: "#d60812",
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
    color: "#d60812",
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

  const [openWarning, setOpenWarning] = useState(false);

  const handleSelect = (plan) => {
    setSeleccionado(plan.id);
    const siguientePlan = planesSeguros.find((p, index) => p.id === plan.id && index < planesSeguros.length - 1);
    if (siguientePlan) {
      setRecomendado(siguientePlan);
      setOpenPopup(true);
    }
  };

  const handleContinue = () => {
    if (!seleccionado) {
      setOpenWarning(true);
    } else {
      console.log("Continuar con el seguro seleccionado: ", seleccionado);
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
              <Typography variant="h6" fontWeight="bold" sx={{ color: "black", p: 1 }}>{plan.total} </Typography>
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained" sx={{ backgroundColor: "#d60812", color: "white", fontWeight: "bold", borderRadius: "8px", padding: "12px 30px", fontSize: "16px" }} onClick={handleContinue}>
          CONTINUAR
        </Button>
      </Box>

      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
        <DialogTitle sx={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>ATENCIÓN</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            CARDEAL tiene como objetivo explicar las opciones de coberturas de forma clara y sencilla. Nuestro compromiso es ofrecer protecciones que resguarden al conductor y a sus acompañantes contra colisión, daños y robo en cualquier situación.
          </Typography>
          <Typography variant="body1" mt={2}>
            CARDEAL pone a tu disposición diferentes tipos de coberturas y paquetes con descuentos especiales. Si no eres elegible para declinar las coberturas, por favor selecciona una de las siguientes opciones para continuar con tu reserva.
          </Typography>
          <Typography variant="body1" mt={2} fontWeight="bold">
            ⚠ Tu reserva NO incluye cobertura de responsabilidad, colisión, robo y daños. Es fundamental proporcionar la documentación necesaria si deseas rechazar estas coberturas previamente indicadas.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWarning(false)} variant="outlined" sx={{ borderColor: "#d60812", color: "#d60812" }}>Continuar</Button>
          <Button onClick={() => setOpenWarning(false)} variant="contained" sx={{ backgroundColor: "#d60812", color: "white" }}>Escoger un seguro</Button>

        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeguroVehiculo;
