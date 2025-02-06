import { useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const extras = [
  {
    id: "responsabilidad_civil",
    nombre: "Responsabilidad Civil (PLI)",
    descripcion: "Responsabilidad Civil (PLI). Esta cobertura deberá ser pagada adicionalmente al monto de la renta diaria del vehículo.",
    precio: 538.24,
    imagen: "/images-extras/responsabilidad_civil.jpg",
  },
  {
    id: "conductor_adicional",
    nombre: "Conductor Adicional (CA)",
    descripcion: "El máximo de conductores que se pueden incluir en una reservación son 3. (Cada conductor adicional tiene un costo de $125.00 + impuestos por día).",
    precio: 145.00,
    imagen: "/images-extras/conductor_adicional.jpg",
  },
  {
    id: "conductor_menor",
    nombre: "Conductor Menor (CM)",
    descripcion: "La edad mínima para reservar un vehículo es de 18 años. Se considera conductor menor a personas menores de 25 años, generando un cargo adicional por conductor menor ($125.00 MXN + impuestos por día).",
    precio: 145.00,
    imagen: "/images-extras/conductor_menor.jpg",
  },
];

const ExtrasRenta = () => {
  const [cantidadExtras, setCantidadExtras] = useState({});

  const modificarCantidad = (id, operacion) => {
    setCantidadExtras((prev) => {
      const nuevaCantidad = (prev[id] || 0) + (operacion === "sumar" ? 1 : -1);
      return { ...prev, [id]: nuevaCantidad < 0 ? 0 : nuevaCantidad };
    });
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold">Extras para tu renta</Typography>
      <Typography variant="body1" mb={4}>Añade servicios adicionales a tu renta de auto</Typography>
      <Grid container spacing={3} justifyContent="center">
        {extras.map((extra) => (
          <Grid item xs={12} key={extra.id}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <CardMedia component="img" sx={{ width: 250, height: 150, objectFit: "cover", borderRadius: "8px" }} image={extra.imagen} alt={extra.nombre} />
              <CardContent sx={{ flex: 1, textAlign: "left" }}>
                <Typography variant="h6" fontWeight="bold">{extra.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">{extra.descripcion}</Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#d60812" }}>{extra.precio.toFixed(2)} MXN/DÍA</Typography>
                <IconButton onClick={() => modificarCantidad(extra.id, "restar")} disabled={cantidadExtras[extra.id] === 0}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{cantidadExtras[extra.id] || 0}</Typography>
                <IconButton onClick={() => modificarCantidad(extra.id, "sumar")}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained" sx={{ backgroundColor: "#d60812", color: "white", fontWeight: "bold", borderRadius: "8px", padding: "12px 30px", fontSize: "16px" }}>
          CONTINUAR
        </Button>
      </Box>
    </Container>
  );
};

export default ExtrasRenta;
