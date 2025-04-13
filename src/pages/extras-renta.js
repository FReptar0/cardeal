"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigation para componentes client
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RentalStepper from "../components/Stepper";
import CompactHeader from "../components/CompactHeader";
import { useBooking } from "../contexts/BookingContext";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

// Arreglo de extras
const extras = [
  {
    id: "conductor_adicional",
    nombre: "Conductor Adicional",
    descripcion:
      "Se pueden incluir conductores adicionales con un costo extra por día.",
    precio: 110,
    imagen: "/extras/add-person.png",
  },
  {
    id: "conductor_menor",
    nombre: "Conductor Menor de 25 Años",
    descripcion:
      "Los conductores menores de 25 años generan un cargo adicional por día.",
    precio: 110,
    imagen: "/extras/user.png",
  },
  {
    id: "baby_seat",
    nombre: "Baby Seat (Grupo 0+)",
    descripcion: "Bebé (grupo 0+), niños de 1 a 13 kilos.",
    precio: 150,
    imagen: "/extras/baby-car-seat.png",
  },
  {
    id: "child_seat",
    nombre: "Child Seat (Grupo 0/1/2)",
    descripcion: "Niños de 1 a 25 kilos.",
    precio: 150,
    imagen: "/extras/baby-car-seat.png",
  },
  {
    id: "booster",
    nombre: "Booster",
    descripcion: "Asiento para niños de 18 a 45 kilos.",
    precio: 150,
    imagen: "/extras/baby-car-seat.png",
  },
];

const ExtrasRenta = () => {
  const router = useRouter();

  // Usa el estado global de extras desde el BookingContext
  const { selectedExtras, setSelectedExtras } = useBooking();
  // Obtiene las fechas de la renta desde el SearchContext
  const { searchData } = useSearch();

  // Calcula los días de renta usando las fechas de searchData
  const rentalDays =
    searchData && searchData.pickupDate && searchData.returnDate
      ? Math.ceil(
          (new Date(searchData.returnDate) - new Date(searchData.pickupDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  // Estados para header y SearchBar
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  const [searchDataLocal, setSearchDataLocal] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Función para modificar la cantidad de un extra
  const modificarCantidad = (id, operacion) => {
    setSelectedExtras((prev) => {
      const currentQty = prev[id] || 0;
      let nuevaCantidad = currentQty;
      if (operacion === "sumar") {
        if (id === "baby_seat" && currentQty >= 2) return prev;
        if (id === "child_seat" && currentQty >= 2) return prev;
        if (id === "booster" && currentQty >= 2) return prev;
        if (id === "conductor_menor" && currentQty >= 1) return prev;
        if (id === "conductor_adicional" && currentQty >= 2) return prev;
        nuevaCantidad += 1;
      } else {
        nuevaCantidad = currentQty - 1;
        if (nuevaCantidad < 0) nuevaCantidad = 0;
      }
      return { ...prev, [id]: nuevaCantidad };
    });
  };

  // Calcula el total de extras según los extras seleccionados y el número de días de renta
  const total = extras.reduce((acc, extra) => {
    const cantidad = selectedExtras[extra.id] || 0;
    const costo = cantidad * extra.precio * rentalDays;
    return acc + costo;
  }, 0);

  const irAcheckout = () => {
    router.push("/checkout");
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", marginTop: "148px" }}>
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
            justifyContent: "flex-start",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            gap: 1,
          }}
        >
          <SearchBar onValuesChange={setSearchDataLocal} />
        </Box>
      </Box>

      <CompactHeader
        searchData={searchDataLocal}
        headerIsTop={headerIsTop}
        showCompactHeader={showCompactHeader}
      />

      {showCompactHeader && (
        <Box sx={{ height: "50px", transition: "height 0.3s ease" }} />
      )}

      <Box sx={{ width: "100%" }}>
        <RentalStepper />
      </Box>

      {isSticky && <Box sx={{ height: "120px" }} />}

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Extras para tu renta
      </Typography>
      <Typography variant="body1" mb={4}>
        Añade servicios adicionales para mejorar tu experiencia
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {extras.map((extra) => (
          <Grid item xs={12} sm={6} md={12} key={extra.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "stretch",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  m: "8px",
                  width: { xs: "100%", md: 125 },
                  height: "auto",
                  objectFit: "contain",
                }}
                image={extra.imagen}
                alt={extra.nombre}
              />
              <CardContent
                sx={{
                  flex: 1,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {extra.nombre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {extra.descripcion}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  pr: 2,
                  pb: { xs: 2, md: 0 },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#d60812" }}
                >
                  {extra.precio.toFixed(2)} MXN/DÍA
                </Typography>
                <IconButton
                  onClick={() => modificarCantidad(extra.id, "restar")}
                  disabled={(selectedExtras[extra.id] || 0) === 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">
                  {selectedExtras[extra.id] || 0}
                </Typography>
                <IconButton
                  onClick={() => modificarCantidad(extra.id, "sumar")}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          p: 2,
          backgroundColor: "#f8f8f8",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          TOTAL de extras:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#d60812" }}>
          {total.toFixed(2)} MXN
        </Typography>
      </Box>

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
          onClick={irAcheckout}
        >
          CONTINUAR
        </Button>
      </Box>
    </Container>
  );
};

export default ExtrasRenta;
