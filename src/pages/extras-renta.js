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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dynamic from "next/dynamic"; // Importar dinámicamente el componente
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RentalStepper from "../components/Stepper";
import CompactHeader from "../components/CompactHeader";

// Importa SearchBar dinámicamente
const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

// Importa el hook del contexto para extras
import { useBooking } from "../contexts/BookingContext";

// Arreglo de extras
const extras = [
  {
    id: "responsabilidad_civil",
    nombre: "Responsabilidad Civil (PLI)",
    descripcion:
      "Esta cobertura deberá ser pagada adicionalmente al monto de la renta diaria del vehículo.",
    precio: 538.24,
    imagen: "/extras/PLI.png",
    unico: true,
  },
  {
    id: "cubre_asientos",
    nombre: "Cubre asientos",
    descripcion:
      "Protege los asientos del vehículo contra derrames, suciedad y desgaste. Es un cargo único, no se regresa.",
    precio: 150,
    imagen: "/extras/seat.png",
  },
  {
    id: "conductor_adicional",
    nombre: "Conductor Adicional (CA)",
    descripcion:
      "Se pueden incluir hasta 3 conductores adicionales con un costo extra por día.",
    precio: 145.0,
    imagen: "/extras/add-person.png",
  },
  {
    id: "conductor_menor",
    nombre: "Conductor Menor (CM)",
    descripcion:
      "Los conductores menores de 25 años generan un cargo adicional por día.",
    precio: 145.0,
    imagen: "/extras/user.png",
  },
  {
    id: "silla_bebe",
    nombre: "Silla para Bebé",
    descripcion: "Proporciona seguridad adicional para bebés y niños pequeños.",
    precio: { chica: 50, mediana: 70, grande: 90 },
    imagen: "/extras/baby-car-seat.png",
  },
  {
    id: "gps",
    nombre: "GPS",
    descripcion: "Navegación GPS integrada para facilitar tu viaje.",
    precio: 60.0,
    imagen: "/extras/gps.png",
    unico: true,
  },
];

const ExtrasRenta = () => {
  const router = useRouter();

  // Usamos el estado global para extras a través del contexto
  const { selectedExtras, setSelectedExtras } = useBooking();

  // Mantenemos el estado para el tamaño de la silla de bebé de forma local
  const [sillaBebeSize, setSillaBebeSize] = useState("chica");

  // Estados para header y SearchBar
  const [isSticky, setIsSticky] = useState(false);
  const [headerIsTop, setHeaderIsTop] = useState(true);
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [hideSearchSection, setHideSearchSection] = useState(false);
  const [searchData, setSearchData] = useState(null);

  // Manejo del header
  useEffect(() => {
    const interval = setInterval(() => {
      const headerTop = JSON.parse(localStorage.getItem("isHeaderTop"));
      setHeaderIsTop(headerTop);
      setShowCompactHeader(!headerTop);
      setHideSearchSection(!headerTop);
    }, 100); // Verifica cada 100ms
    return () => clearInterval(interval);
  }, []);

  // Función para modificar la cantidad de un extra; actúa directamente sobre el estado global
  const modificarCantidad = (id, operacion, unico = false) => {
    setSelectedExtras((prev) => {
      const currentQty = prev[id] || 0;

      // Límites específicos para ciertos extras
      if (operacion === "sumar") {
        if (id === "silla_bebe" && currentQty >= 2) return prev; // Máx. 2 sillas para bebé
        if (id === "conductor_menor" && currentQty >= 1) return prev; // Máx. 1 conductor menor
        if (id === "conductor_adicional" && currentQty >= 2) return prev; // Máx. 2 conductores adicionales
      }

      let nuevaCantidad = unico
        ? operacion === "sumar"
          ? 1
          : 0
        : currentQty + (operacion === "sumar" ? 1 : -1);

      if (nuevaCantidad < 0) nuevaCantidad = 0;

      return { ...prev, [id]: nuevaCantidad };
    });
  };

  // Cálculo del total de extras usando los extras globales seleccionados
  const total = extras.reduce((acc, extra) => {
    const cantidad = selectedExtras[extra.id] || 0;
    let precio = extra.precio;
    // Para la silla de bebé, se usa el precio según el tamaño seleccionado
    if (extra.id === "silla_bebe") {
      precio = extra.precio[sillaBebeSize];
    }
    // Si el extra es "unico" se toma el precio unitario, de lo contrario se multiplica (ej: 4 días de renta)
    const costo = extra.unico ? cantidad * precio : cantidad * precio * 4;
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
          <SearchBar onValuesChange={setSearchData} />
        </Box>
      </Box>

      {/* Se utiliza el CompactHeader */}
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

                {/* Selector de tamaño para la silla de bebé */}
                {extra.id === "silla_bebe" && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel shrink id="label-tamano">
                      Tamaño
                    </InputLabel>
                    <Select
                      labelId="label-tamano"
                      value={sillaBebeSize}
                      onChange={(e) => setSillaBebeSize(e.target.value)}
                      label="Tamaño"
                    >
                      <MenuItem value="chica">
                        Chica - ${extra.precio.chica} MXN/DÍA
                      </MenuItem>
                      <MenuItem value="mediana">
                        Mediana - ${extra.precio.mediana} MXN/DÍA
                      </MenuItem>
                      <MenuItem value="grande">
                        Grande - ${extra.precio.grande} MXN/DÍA
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
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
                  {extra.id === "silla_bebe"
                    ? extra.precio[sillaBebeSize].toFixed(2)
                    : extra.precio.toFixed(2)}{" "}
                  MXN/DÍA
                </Typography>
                {extra.unico ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedExtras[extra.id]
                        ? "#A0A0A0"
                        : "#d60812",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "0px",
                      padding: "8px 20px",
                      fontSize: "14px",
                    }}
                    onClick={() =>
                      modificarCantidad(
                        extra.id,
                        selectedExtras[extra.id] ? "restar" : "sumar",
                        true
                      )
                    }
                  >
                    {selectedExtras[extra.id] ? "CANCELAR" : "AGREGAR"}
                  </Button>
                ) : (
                  <>
                    <IconButton
                      onClick={() => modificarCantidad(extra.id, "restar")}
                      disabled={selectedExtras[extra.id] === 0}
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
                  </>
                )}
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
