import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RentalStepper from "../components/Stepper";

const extras = [
  {
    id: "responsabilidad_civil",
    nombre: "Responsabilidad Civil (PLI)",
    descripcion: "Esta cobertura deberá ser pagada adicionalmente al monto de la renta diaria del vehículo.",
    precio: 538.24,
    imagen: "/extras/civil.jpg",
    unico: true,
  },
  {
    id: "conductor_adicional",
    nombre: "Conductor Adicional (CA)",
    descripcion: "Se pueden incluir hasta 3 conductores adicionales con un costo extra por día.",
    precio: 145.0,
    imagen: "/extras/conductores.jpg",
  },
  {
    id: "conductor_menor",
    nombre: "Conductor Menor (CM)",
    descripcion: "Los conductores menores de 25 años generan un cargo adicional por día.",
    precio: 145.0,
    imagen: "/extras/menor.jpg",
  },
  {
    id: "silla_bebe",
    nombre: "Silla para Bebé",
    descripcion: "Proporciona seguridad adicional para bebés y niños pequeños.",
    precio: 50.0,
    imagen: "/extras/silla.png",
  },
  {
    id: "gps",
    nombre: "GPS",
    descripcion: "Navegación GPS integrada para facilitar tu viaje.",
    precio: 60.0,
    imagen: "/extras/gps.jpg",
    unico: true,
  },
  {
    id: "wifi",
    nombre: "WiFi Móvil",
    descripcion: "Conéctate en cualquier lugar con internet de alta velocidad.",
    precio: 150.0,
    imagen: "/extras/wifi.jpg",
    unico: true,
  },
];

const ExtrasRenta = () => {
  const router = useRouter();
  const [cantidadExtras, setCantidadExtras] = useState({});

  const modificarCantidad = (id, operacion, unico = false) => {
    setCantidadExtras((prev) => {
      let nuevaCantidad = unico ? (operacion === "sumar" ? 1 : 0) : (prev[id] || 0) + (operacion === "sumar" ? 1 : -1);
      return { ...prev, [id]: nuevaCantidad < 0 ? 0 : nuevaCantidad };
    });
  };

  const total = extras.reduce((acc, extra) => {
    const cantidad = cantidadExtras[extra.id] || 0;
    const costo = extra.unico ? cantidad * extra.precio : cantidad * extra.precio * 4;
    return acc + costo;
  }, 0);

  const irAcheckout = () => {
    router.push("/checkout");
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 5 }}>
      <RentalStepper />
      <Typography variant="h4" fontWeight="bold">Extras para tu renta</Typography>
      <Typography variant="body1" mb={4}>Añade servicios adicionales para mejorar tu experiencia</Typography>

      <Grid container spacing={3} justifyContent="center">
        {extras.map((extra) => (
          <Grid item xs={12} sm={6} md={4} key={extra.id}>
            <Card sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "stretch", height: "100%", overflow: "hidden" }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: "100%", sm: 250 }, height: { xs: 160, sm: "100%" }, objectFit: "cover", borderRadius: "0px" }}
                image={extra.imagen}
                alt={extra.nombre}
              />
              <CardContent sx={{ flex: 1, textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "center", p: 2 }}>
                <Typography variant="h6" fontWeight="bold">{extra.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">{extra.descripcion}</Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column", sm: "row" }, gap: 2, pr: 2, pb: { xs: 2, sm: 0 } }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#d60812" }}>
                  {extra.precio.toFixed(2)} MXN/DÍA
                </Typography>
                {extra.unico ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: cantidadExtras[extra.id] ? "#A0A0A0" : "#d60812",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "0px",
                      padding: "8px 20px",
                      fontSize: "14px",
                    }}
                    onClick={() => modificarCantidad(extra.id, cantidadExtras[extra.id] ? "restar" : "sumar", true)}
                  >
                    {cantidadExtras[extra.id] ? "CANCELAR" : "AGREGAR"}
                  </Button>
                ) : (
                  <>
                    <IconButton onClick={() => modificarCantidad(extra.id, "restar")} disabled={cantidadExtras[extra.id] === 0}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">{cantidadExtras[extra.id] || 0}</Typography>
                    <IconButton onClick={() => modificarCantidad(extra.id, "sumar")}>
                      <AddIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, p: 2, backgroundColor: "#f8f8f8", borderRadius: "8px" }}>
        <Typography variant="h5" fontWeight="bold">TOTAL de extras:</Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#d60812" }}>{total.toFixed(2)} MXN</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, pb: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#d60812", color: "white", fontWeight: "bold", padding: "12px 30px", fontSize: "16px" }}
          onClick={irAcheckout}
        >
          CONTINUAR
        </Button>
      </Box>
    </Container>
  );
};

export default ExtrasRenta;
