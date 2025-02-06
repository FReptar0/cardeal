import { useState } from "react";
import {
  Container, Grid, Card, CardContent, CardMedia, Typography, Box, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useRouter } from "next/router"; // Importa useRouter

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
    id: "basico",
    nombre: "PAQUETE BASICO",
    total: "$350",
    imagen: "/images-seguros/camry1.png",
    color: "#d60812",
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo"
    ]
  },
  {
    id: "intermedio",
    nombre: "PAQUETE ESTANDAR",
    total: "$550",
    imagen: "/images-seguros/camry2.png",
    color: "#d60812",
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes"
    ]
  },
  {
    id: "completo",
    nombre: "PAQUETE PREMIUM",
    total: "$850",
    imagen: "/images-seguros/camry3.png",
    color: "#d60812",
    recomendado: true,
    coberturas: [
      "Colisión y daños",
      "Responsabilidad Civil",
      "Protección de Robo",
      "Cobertura 0% Deducible",
      "Asistencia Vial",
      "Cristales y Llantas",
      "Gastos Médicos Ocupantes"
    ]
  }
];


const SeguroVehiculo = () => {
  const [seleccionado, setSeleccionado] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);

  const router = useRouter(); // Inicializa el router

  const handleSelect = (plan) => {
    setSeleccionado(plan.id);
  };

  const handleContinue = () => {
    if (!seleccionado) {
      setOpenWarning(true);
    } else {
      console.log("Continuar con el seguro seleccionado: ", seleccionado);
      router.push("/extras-renta"); // Redirige a la página
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
                border: seleccionado === plan.id ? "3px solid black" : "1px solid #ddd",
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
                <Box sx={{ position: "absolute", top: -2, right: -8, padding: "6px 12px", background: "black", color: "white", borderRadius: "5px" }}>
                  Recomendado
                </Box>
              )}
              <Typography variant="h4" fontWeight="bold" sx={{ color: "black", display: "inline" }}>
                {plan.total.split(" ")[0]} {/* Solo toma el valor numérico */}
              </Typography>
              <Typography variant="h6" sx={{ color: "gray", display: "inline", ml: 1 }}>
                /día
              </Typography>

              <CardMedia component="img" sx={{ height: 200, objectFit: "contain", padding: 1 }} image={plan.imagen} alt={plan.nombre} />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: plan.color, mb: 1 }}>{plan.nombre}</Typography>

                {/* Mostrar coberturas con CheckCircleIcon o CancelIcon según disponibilidad */}
                {todasLasCoberturas.map((cobertura, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      {plan.coberturas.includes(cobertura) ? (
                        <CheckCircleIcon color="error" />
                      ) : (
                        <CancelIcon sx={{ color: "gray" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ style: { fontSize: '14px' } }} primary={cobertura} />
                  </ListItem>
                ))}

                <Box sx={{ mt: 4 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#10906a",
                    fontWeight: "bold",
                    textAlign: "center",
                    mt: 2
                  }}
                >
                  {`Elegir por $${parseInt(plan.total.replace("$", "")) * 4} MXN (4 días)`}
                </Typography>
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
            fontSize: "16px"
          }}
          onClick={handleContinue} // Ahora redirige a /extras-renta
        >
          CONTINUAR
        </Button>
      </Box>

      <Dialog open={openWarning} onClose={() => setOpenWarning(false)}>
        <DialogTitle sx={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          🚨 ATENCIÓN 🚨
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: "justify", fontSize: "16px", lineHeight: "1.5", mt: 2 }}>
            Para tu seguridad y tranquilidad, es <strong>OBLIGATORIO</strong> seleccionar un seguro antes de continuar con tu reserva.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenWarning(false)}
            variant="contained"
            sx={{ backgroundColor: "#d60812", color: "white", fontWeight: "bold", padding: "12px 20px", borderRadius: "8px", fontSize: "16px" }}
          >
            ESCOGER UN SEGURO
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default SeguroVehiculo;
